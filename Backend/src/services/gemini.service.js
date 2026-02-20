const { GoogleGenAI } = require("@google/genai");
const db = require("../config/db");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const modelId = "gemini-3-flash-preview";

const systemInstruction = `You are a helpful AI assistant for a food ordering application.
Your goal is to assist users in browsing the menu, managing their cart, and viewing their order history.
You have access to the user's ID via the tool context.

Rules:
1. Always be polite and helpful.
2. When a user asks to add something to the cart, you MUST first identify the specific product and restaurant. If the user is vague (e.g., "add a burger"), use the searchProducts tool to find options and present them to the user.
3. Only use the addToCart tool when you have a specific productId and restaurantId.
4. When listing products or orders, format the output in a readable way.
5. If a tool fails, explain the error to the user gracefully.
`;

const tools = [
  {
    name: "searchProducts",
    description: "Search for products (food items) by name or category.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query (e.g., 'burger', 'pizza', 'vegan').",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "getCart",
    description: "Get the current user's cart items.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "addToCart",
    description: "Add a specific product to the user's cart. Clears cart if adding from a different restaurant.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "STRING",
          description: "The UUID of the product to add.",
        },
        restaurantId: {
          type: "STRING",
          description: "The UUID of the restaurant providing the product.",
        },
        quantity: {
          type: "INTEGER",
          description: "The quantity to add (default 1).",
        },
      },
      required: ["productId", "restaurantId"],
    },
  },
  {
    name: "getOrders",
    description: "Get the user's past order history.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
];

async function handleToolCall(toolCall, userId) {
  const { name, args } = toolCall;

  switch (name) {
    case "searchProducts":
      return await searchProducts(args.query);
    case "getCart":
      return await getCart(userId);
    case "addToCart":
      return await addToCart(userId, args.productId, args.restaurantId, args.quantity);
    case "getOrders":
      return await getOrders(userId);
    default:
      console.warn(`Unknown tool called: ${name}`);
      return `Tool '${name}' not found. Please explain to the user that I cannot perform this action.`;
  }
}

// --- Tool Implementations ---

async function searchProducts(query) {
  try {
    const { rows } = await db.query(
      `SELECT p.id, p.title, p.price, p.description, r.id as "restaurantId", r.title as "restaurantName"
       FROM products p
       JOIN restaurant_menu rm ON p.id = rm.product_id
       JOIN restaurants r ON r.id = rm.restaurant_id
       WHERE p.title ILIKE $1 OR p.category ILIKE $1 OR p.description ILIKE $1
       LIMIT 5`,
      [`%${query}%`]
    );
    if (rows.length === 0) return `No products found matching '${query}'.`;
    return rows;
  } catch (err) {
    console.error("Tool Error (searchProducts):", err);
    return "Error searching products.";
  }
}

async function getCart(userId) {
  try {
    const { rows } = await db.query(
      `SELECT 
        c.quantity,
        p.title,
        p.price,
        r.title AS "restaurantName"
       FROM cart c
       JOIN products p ON p.id = c.product_id
       JOIN restaurants r ON r.id = c.restaurant_id
       WHERE c.user_id = $1`,
      [userId]
    );
    if (rows.length === 0) return "Cart is empty.";
    return rows;
  } catch (err) {
    console.error("Tool Error (getCart):", err);
    return "Error fetching cart.";
  }
}

async function addToCart(userId, productId, restaurantId, quantity = 1) {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // Check for existing items from different restaurant
    const existingCart = await client.query(
      `SELECT DISTINCT restaurant_id FROM cart WHERE user_id = $1`,
      [userId]
    );

    let message = "Item added to cart.";

    if (existingCart.rows.length > 0) {
      const existingRestaurantId = existingCart.rows[0].restaurant_id;
      if (existingRestaurantId !== restaurantId) {
        await client.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);
        message = "Cart cleared (different restaurant) and item added.";
      }
    }

    await client.query(
      `INSERT INTO cart (user_id, product_id, restaurant_id, quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart.quantity + $4`,
      [userId, productId, restaurantId, quantity]
    );

    await client.query("COMMIT");
    return message;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Tool Error (addToCart):", err);
    return "Error adding item to cart.";
  } finally {
    client.release();
  }
}

async function getOrders(userId) {
  try {
    const { rows } = await db.query(
      `SELECT t.id, t.total_amount, t.created_at,
        (SELECT json_agg(json_build_object('title', p.title, 'quantity', ti.quantity)) 
         FROM transaction_items ti 
         JOIN products p ON p.id = ti.product_id 
         WHERE ti.transaction_id = t.id) as items
       FROM transactions t
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [userId]
    );
    if (rows.length === 0) return "No previous orders found.";
    return rows;
  } catch (err) {
    console.error("Tool Error (getOrders):", err);
    return "Error fetching orders.";
  }
}

async function chatWithGemini(userId, userMessage, history) {
    const formattedHistory = history.map(msg => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const contents = [
        ...formattedHistory,
        {
            role: 'user',
            parts: [{ text: userMessage }]
        }
    ];

    const config = {
        tools: [{ functionDeclarations: tools }],
    }

    // Since we can't easily maintain a persistent session object across HTTP requests without complexity,
    // we use the single-turn generation with history, but actually the library supports multi-turn chat sessions.
    // However, for simplicity with custom DB history, passing the full history each time is safer.

    // BUT `generateContentStream` with tools can be tricky if not using `chatSession`.
    // Let's use `ai.languageModel.generateContent` which is stateless but accepts contents array.
    // Wait, the SDK has changed. `ai.models.generateContentStream` is correct.
    
    // We need to handle the loop of tool calling.
    // Basic loop:
    // 1. Send message + history + tools
    // 2. If response has function calls -> execute them -> append results -> send again.
    // 3. Repeat until text response.

    let currentContents = [...contents];
    let turnCount = 0;
    const MAX_TURNS = 5;

    console.log("Starting chat turn with model:", modelId);

    while (turnCount < MAX_TURNS) {
        try {
            const result = await ai.models.generateContent({
                model: modelId,
                config,
                contents: currentContents,
                systemInstruction: { parts: [{ text: systemInstruction }] }
            });
            
            // In some SDK versions, result is the response, in others result.response is the response.
            // Based on previous errors, we were getting a response object but .functionCalls wasn't on it.
            // Let's assume result might be the response or result.response.
            const response = result.response || result;

            if (!response.candidates || !response.candidates.length) {
                 return "No candidates returned from Gemini.";
            }

            const content = response.candidates[0].content;
            const parts = content.parts || [];
            
            // Filter for function calls
            const functionCalls = parts
                .filter(part => part.functionCall)
                .map(part => part.functionCall);

            if (functionCalls.length > 0) {
                 console.log("Tool calls received:", functionCalls.map(c => c.name));
                 
                 // Add the model's request to history
                 currentContents.push(content);

                 for (const call of functionCalls) {
                     console.log("Executing tool:", call.name, JSON.stringify(call.args));
                     // The arguments might be an object or struct depending on SDK
                     const args = call.args;
                     const toolName = call.name;
                     
                     const toolResult = await handleToolCall({ name: toolName, args }, userId);
                     console.log("Tool result:", JSON.stringify(toolResult).substring(0, 100) + "...");
                     
                     // Construct tool response
                     currentContents.push({
                         role: 'tool',
                         parts: [{
                             functionResponse: {
                                name: toolName,
                                response: { result: toolResult }
                             }
                         }]
                     });
                 }
                 turnCount++;
                 // Loop continues
            } else {
                // No tool calls, just text
                // Extract text from parts
                const textPart = parts.find(p => p.text);
                return textPart ? textPart.text : (response.text ? response.text() : "No text response");
            }
        } catch (err) {
            console.error("Error in Gemini generation loop:", err);
            return "I'm having trouble connecting to the AI right now. Please try again later.";
        }
    }
    return "I'm busy right now, please try again.";
}

module.exports = { chatWithGemini };
