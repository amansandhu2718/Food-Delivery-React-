const db = require("../config/db"); // your postgres connection
const bcrypt = require("bcrypt");

// Unique tag for dummy data so cleanup is safe
const DUMMY_TAG = "DUMMY_SEED";

// 50+ Restaurants with varied cuisines
const RESTAURANTS = [
  // --- North Indian / Biryani ---
  {
    title: "Spice Garden",
    location: "Indiranagar, Bangalore",
    contact: "9991112222",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356f36",
    rating: 4.5,
    cuisine: ["North Indian", "Biryani"],
    deliveryTime: 35,
    priceForTwo: 600,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  // {
  //   title: "Empire Restaurant",
  //   location: "Church Street, Bangalore",
  //   contact: "8882223333",
  //   image: "https://images.unsplash.com/photo-1631515243188-e93d58296aee",
  //   rating: 4.3,
  //   cuisine: ["North Indian", "Mughlai"],
  //   deliveryTime: 40,
  //   priceForTwo: 700,
  //   isOpen: true,
  //   isVeg: false,
  //   hasOffer: true,
  // },
  {
    title: "Punjab Grill",
    location: "Malleshwaram, Bangalore",
    contact: "7773334444",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b",
    rating: 4.6,
    cuisine: ["North Indian", "Punjabi"],
    deliveryTime: 45,
    priceForTwo: 1200,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Moti Mahal",
    location: "Cyber City, Gurgaon",
    contact: "9988776655",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    rating: 4.4,
    cuisine: ["North Indian", "Tandoori"],
    deliveryTime: 30,
    priceForTwo: 800,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },

  // --- South Indian ---
  {
    title: "MTR 1924",
    location: "Lalbagh, Bangalore",
    contact: "6664445555",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be",
    rating: 4.8,
    cuisine: ["South Indian", "Breakfast"],
    deliveryTime: 25,
    priceForTwo: 400,
    isOpen: true,
    isVeg: true,
    hasOffer: false,
  },
  {
    title: "Vidyarthi Bhavan",
    location: "Basavanagudi, Bangalore",
    contact: "5556667777",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e0",
    rating: 4.7,
    cuisine: ["South Indian", "Dosa"],
    deliveryTime: 30,
    priceForTwo: 300,
    isOpen: true,
    isVeg: true,
    hasOffer: false,
  },
  {
    title: "Saravana Bhavan",
    location: "CP, Delhi",
    contact: "1122334455",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
    rating: 4.5,
    cuisine: ["South Indian", "Tamil"],
    deliveryTime: 20,
    priceForTwo: 500,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },

  // --- Burgers / Fast Food ---
  {
    title: "Burger Hub",
    location: "Koramangala, Bangalore",
    contact: "8885554444",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    rating: 4.2,
    cuisine: ["Burger", "Fast Food"],
    deliveryTime: 25,
    priceForTwo: 500,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Leon's Burgers",
    location: "Indiranagar, Bangalore",
    contact: "4445556666",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    rating: 4.4,
    cuisine: ["Burger", "American"],
    deliveryTime: 30,
    priceForTwo: 600,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Truffles",
    location: "St. Marks Road, Bangalore",
    contact: "3334445555",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
    rating: 4.6,
    cuisine: ["Burger", "Cafe"],
    deliveryTime: 40,
    priceForTwo: 800,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "KFC",
    location: "MG Road, Pune",
    contact: "5544332211",
    image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac59cb",
    rating: 4.1,
    cuisine: ["Fried Chicken", "Fast Food"],
    deliveryTime: 20,
    priceForTwo: 600,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },

  // --- Pizza / Italian ---
  {
    title: "Italiano",
    location: "Whitefield, Bangalore",
    contact: "7776665555",
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94",
    rating: 4.6,
    cuisine: ["Italian", "Pizza"],
    deliveryTime: 35,
    priceForTwo: 800,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Pizza Paradise",
    location: "JP Nagar, Bangalore",
    contact: "7774441111",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    rating: 4.5,
    cuisine: ["Pizza", "Italian"],
    deliveryTime: 35,
    priceForTwo: 700,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },
  {
    title: "Oven Story",
    location: "HSR Layout, Bangalore",
    contact: "6663332222",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
    rating: 4.1,
    cuisine: ["Pizza", "Fast Food"],
    deliveryTime: 30,
    priceForTwo: 600,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Baking Bad",
    location: "GK, Delhi",
    contact: "9911991199",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    rating: 4.7,
    cuisine: ["Pizza", "Gourmet"],
    deliveryTime: 40,
    priceForTwo: 1000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },

  // --- Asian / Chinese ---
  {
    title: "Mainland China",
    location: "Indiranagar, Bangalore",
    contact: "2223334444",
    image: "https://images.unsplash.com/photo-1582293041099-b78373237703",
    rating: 4.7,
    cuisine: ["Asian", "Chinese"],
    deliveryTime: 45,
    priceForTwo: 1500,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Wok This Way",
    location: "Electronic City, Bangalore",
    contact: "5552229999",
    image: "https://images.unsplash.com/photo-1541544744-378caae9a3ad",
    rating: 4.3,
    cuisine: ["Asian", "Chinese"],
    deliveryTime: 40,
    priceForTwo: 750,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Thai Basil",
    location: "Richmond Road, Bangalore",
    contact: "4441118888",
    image: "https://images.unsplash.com/photo-1564436872-f6d81182df12",
    rating: 4.5,
    cuisine: ["Asian", "Thai"],
    deliveryTime: 45,
    priceForTwo: 1100,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Yauatcha",
    location: "Bandra, Mumbai",
    contact: "8877665544",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    rating: 4.8,
    cuisine: ["Asian", "Dim Sum"],
    deliveryTime: 50,
    priceForTwo: 2500,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },

  // --- Coastal / Seafood ---
  {
    title: "Fisherman's Wharf",
    location: "Sarjapur, Bangalore",
    contact: "9911223344",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a",
    rating: 4.6,
    cuisine: ["Seafood", "Goan"],
    deliveryTime: 45,
    priceForTwo: 1800,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Gajalee",
    location: "Vile Parle, Mumbai",
    contact: "7766554433",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62",
    rating: 4.7,
    cuisine: ["Seafood", "Malvani"],
    deliveryTime: 40,
    priceForTwo: 2000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Karavalli",
    location: "Residency Road, Bangalore",
    contact: "3344556677",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
    rating: 4.9,
    cuisine: ["Coastal", "Konkan"],
    deliveryTime: 50,
    priceForTwo: 3000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },

  // --- Mediterranean / Lebanese ---
  {
    title: "Bayroute",
    location: "Powai, Mumbai",
    contact: "9900887766",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
    rating: 4.7,
    cuisine: ["Middle Eastern", "Lebanese"],
    deliveryTime: 45,
    priceForTwo: 2500,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Zabaan",
    location: "Hauz Khas, Delhi",
    contact: "4455667788",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    rating: 4.4,
    cuisine: ["Middle Eastern", "Healthy"],
    deliveryTime: 35,
    priceForTwo: 1200,
    isOpen: true,
    isVeg: true,
    hasOffer: false,
  },
  {
    title: "Olive Bar and Kitchen",
    location: "Mehrauli, Delhi",
    contact: "1100223344",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    rating: 4.8,
    cuisine: ["Mediterranean", "European"],
    deliveryTime: 55,
    priceForTwo: 3500,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },

  // --- Japanese / Sushi ---
  {
    title: "Sushi World",
    location: "MG Road, Bangalore",
    contact: "9998887777",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    rating: 4.8,
    cuisine: ["Sushi", "Japanese"],
    deliveryTime: 40,
    priceForTwo: 1200,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Tokyo Train",
    location: "Indiranagar, Bangalore",
    contact: "8889996666",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    rating: 4.3,
    cuisine: ["Sushi", "Asian"],
    deliveryTime: 45,
    priceForTwo: 1500,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  // {
  //   title: "Kaze",
  //   location: "Lavelle Road, Bangalore",
  //   contact: "6655443322",
  //   image: "https://images.unsplash.com/photo-1563245339-dfc201046d8e",
  //   rating: 4.7,
  //   cuisine: ["Japanese", "Pan Asian"],
  //   deliveryTime: 50,
  //   priceForTwo: 2800,
  //   isOpen: true,
  //   isVeg: false,
  //   hasOffer: false,
  // },

  // --- Mexican ---
  {
    title: "Taco Bell",
    location: "Koramangala, Bangalore",
    contact: "1110009999",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    rating: 4.1,
    cuisine: ["Mexican", "Fast Food"],
    deliveryTime: 25,
    priceForTwo: 400,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Chinita Real Mexican",
    location: "Indiranagar, Bangalore",
    contact: "0009998888",
    image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f",
    rating: 4.6,
    cuisine: ["Mexican", "Authentic"],
    deliveryTime: 35,
    priceForTwo: 1000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  // {
  //   title: "Chili's",
  //   location: "Ambience Mall, Gurgaon",
  //   contact: "7788990011",
  //   image: "https://images.unsplash.com/photo-1512485600893-b08bc1ad59b1",
  //   rating: 4.4,
  //   cuisine: ["Mexican", "American"],
  //   deliveryTime: 40,
  //   priceForTwo: 1500,
  //   isOpen: true,
  //   isVeg: false,
  //   hasOffer: true,
  // },

  // --- Dessert / Bakery ---
  {
    title: "Sweet Tooth",
    location: "Brigade Road, Bangalore",
    contact: "9990001111",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
    rating: 4.7,
    cuisine: ["Dessert", "Bakery"],
    deliveryTime: 20,
    priceForTwo: 400,
    isOpen: true,
    isVeg: true,
    hasOffer: false,
  },
  {
    title: "Creamy Creations",
    location: "Koramangala, Bangalore",
    contact: "8881110000",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
    rating: 4.5,
    cuisine: ["Dessert", "Ice Cream"],
    deliveryTime: 15,
    priceForTwo: 300,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },
  {
    title: "Corner House",
    location: "Residency Road, Bangalore",
    contact: "7770001111",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
    rating: 4.9,
    cuisine: ["Dessert", "Ice Cream"],
    deliveryTime: 25,
    priceForTwo: 350,
    isOpen: true,
    isVeg: true,
    hasOffer: false,
  },
  {
    title: "Theobroma",
    location: "Colaba, Mumbai",
    contact: "2233445566",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
    rating: 4.7,
    cuisine: ["Dessert", "Patisserie"],
    deliveryTime: 30,
    priceForTwo: 600,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },

  // --- Healthy / Vegan ---
  {
    title: "Green Salad Bowl",
    location: "Indiranagar, Bangalore",
    contact: "7779993333",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    rating: 4.6,
    cuisine: ["Healthy", "Salads"],
    deliveryTime: 25,
    priceForTwo: 900,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },
  {
    title: "Vegan Vibes",
    location: "Whitefield, Bangalore",
    contact: "6668884444",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    rating: 4.4,
    cuisine: ["Healthy", "Vegan"],
    deliveryTime: 35,
    priceForTwo: 800,
    isOpen: true,
    isVeg: true,
    hasOffer: false,
  },
  {
    title: "Fit Chef",
    location: "Vasant Kunj, Delhi",
    contact: "1122998877",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    rating: 4.5,
    cuisine: ["Healthy", "Keto"],
    deliveryTime: 30,
    priceForTwo: 1000,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },

  // --- Multi-Cuisine ---
  {
    title: "The Globe",
    location: "Sector 29, Gurgaon",
    contact: "9988112233",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    rating: 4.3,
    cuisine: ["Multi Cuisine", "Buffet"],
    deliveryTime: 40,
    priceForTwo: 1200,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Skyline Lounge",
    location: "HSR Layout, Bangalore",
    contact: "4455112233",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    rating: 4.5,
    cuisine: ["Multi Cuisine", "Continental"],
    deliveryTime: 45,
    priceForTwo: 1500,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Roots",
    location: "JP Nagar, Bangalore",
    contact: "3344112233",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    rating: 4.6,
    cuisine: ["Indian", "Global"],
    deliveryTime: 40,
    priceForTwo: 1000,
    isOpen: true,
    isVeg: true,
    hasOffer: true,
  },

  // Adding more to reach 50+ entries
  {
    title: "Cafe Delhi Heights",
    location: "DLF Mall",
    contact: "2233112233",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    rating: 4.4,
    cuisine: ["Cafe", "Indian"],
    deliveryTime: 30,
    priceForTwo: 1200,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Social",
    location: "Church Street",
    contact: "1122112233",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88",
    rating: 4.5,
    cuisine: ["Bar", "Finger Food"],
    deliveryTime: 35,
    priceForTwo: 1500,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  // {
  //   title: "Big Brewsky",
  //   location: "Sarjapur",
  //   contact: "9922112233",
  //   image: "https://images.unsplash.com/photo-1516211697506-8360bd7991ba",
  //   rating: 4.7,
  //   cuisine: ["Pub", "Continental"],
  //   deliveryTime: 50,
  //   priceForTwo: 2000,
  //   isOpen: true,
  //   isVeg: false,
  //   hasOffer: false,
  // },
  {
    title: "Toit",
    location: "Indiranagar",
    contact: "8822112233",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    rating: 4.6,
    cuisine: ["Brewery", "Pizza"],
    deliveryTime: 40,
    priceForTwo: 1800,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Farzi Cafe",
    location: "Aerocity",
    contact: "7722112233",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    rating: 4.4,
    cuisine: ["Modern Indian", "Fusion"],
    deliveryTime: 45,
    priceForTwo: 2200,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Mamagoto",
    location: "Khan Market",
    contact: "6622112233",
    image: "https://images.unsplash.com/photo-1541544744-378caae9a3ad",
    rating: 4.5,
    cuisine: ["Asian", "Japanese"],
    deliveryTime: 40,
    priceForTwo: 1800,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Pa Pa Ya",
    location: "BKC",
    contact: "5522112233",
    image: "https://images.unsplash.com/photo-1563245339-dfc201046d8e",
    rating: 4.7,
    cuisine: ["Asian", "Sushi"],
    deliveryTime: 50,
    priceForTwo: 3000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Smoke House Deli",
    location: "Lavelle Road",
    contact: "4422112233",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
    rating: 4.4,
    cuisine: ["European", "Delicatessen"],
    deliveryTime: 35,
    priceForTwo: 1600,
    isOpen: true,
    isVeg: false,
    hasOffer: true,
  },
  {
    title: "Indigo Deli",
    location: "Colaba",
    contact: "3322112233",
    image: "https://images.unsplash.com/photo-1447078806655-40579c2520d6",
    rating: 4.6,
    cuisine: ["European", "Cafe"],
    deliveryTime: 35,
    priceForTwo: 2000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
  {
    title: "Le Cirque",
    location: "The Leela",
    contact: "2222112233",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    rating: 4.9,
    cuisine: ["French", "Fine Dining"],
    deliveryTime: 60,
    priceForTwo: 8000,
    isOpen: true,
    isVeg: false,
    hasOffer: false,
  },
];

const PRODUCTS = [
  // --- Indian ---
  {
    title: "Hyderabadi Biryani",
    price: 35000,
    category: "Biryani",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    rating: 4.8,
  },
  {
    title: "Butter Chicken",
    price: 42000,
    category: "Main Course",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc",
    rating: 4.7,
  },
  {
    title: "Dal Makhani",
    price: 32000,
    category: "Main Course",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1546833999-b9f5816029bd",
    rating: 4.6,
  },
  {
    title: "Masala Dosa",
    price: 12000,
    category: "South Indian",
    menuCategory: "breakfast",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e0",
    rating: 4.9,
  },
  {
    title: "Paneer Tikka",
    price: 28000,
    category: "Starters",
    menuCategory: "starter",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
    rating: 4.5,
  },

  // --- Fast Food ---
  {
    title: "Classic Burger",
    price: 19000,
    category: "Burger",
    menuCategory: "fast_food",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    rating: 4.2,
  },
  {
    title: "Cheese Fries",
    price: 15000,
    category: "Fast Food",
    menuCategory: "starter",
    image: "https://images.unsplash.com/photo-1573082833025-dc182643a60a",
    rating: 4.1,
  },
  {
    title: "Chicken Wings",
    price: 28000,
    category: "Fast Food",
    menuCategory: "starter",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2",
    rating: 4.4,
  },

  // --- Pizza ---
  {
    title: "Margherita Pizza",
    price: 45000,
    category: "Pizza",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    rating: 4.5,
  },
  {
    title: "Pepperoni Pizza",
    price: 55000,
    category: "Pizza",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    rating: 4.7,
  },

  // --- Asian ---
  {
    title: "Kung Pao Chicken",
    price: 38000,
    category: "Chinese",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    rating: 4.5,
  },
  {
    title: "Sushi Platter",
    price: 120000,
    category: "Sushi",
    menuCategory: "main",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    rating: 4.9,
  },

  // --- Dessert ---
  {
    title: "Chocolate Cake",
    price: 22000,
    category: "Dessert",
    menuCategory: "dessert",
    image: "https://images.unsplash.com/photo-1578985543846-ea727aee55bb",
    rating: 4.8,
  },
  {
    title: "Ice Cream",
    price: 12000,
    category: "Dessert",
    menuCategory: "dessert",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dabb89a",
    rating: 4.6,
  },
];

async function seedDummyData() {
  const client = await db.pool.connect();

  try {
    console.log("Seeding dummy data...");
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Users & Owners
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'USER')
       ON CONFLICT (email) DO NOTHING RETURNING id`,
      ["Dummy User", "dummy.user@test.com", passwordHash],
    );
    const userId =
      userResult.rows[0]?.id ||
      (
        await client.query(
          "SELECT id FROM users WHERE email='dummy.user@test.com'",
        )
      ).rows[0].id;

    const owners = [];
    for (let i = 1; i <= 50; i++) {
      const res = await client.query(
        `INSERT INTO users (name, email, password, role, phone)
         VALUES ($1, $2, $3, 'REST_OWNER', $4)
         ON CONFLICT (email) DO NOTHING RETURNING id`,
        [
          `Owner ${i}`,
          `owner${i}@test.com`,
          passwordHash,
          `98765432${i.toString().padStart(2, "0")}`,
        ],
      );
      if (res.rows[0]) owners.push(res.rows[0].id);
    }

    // 2. Restaurants
    const restaurantIds = [];
    for (const r of RESTAURANTS) {
      const result = await client.query(
        `INSERT INTO restaurants
          (title, location, contact, promo, image_url, rating, cuisine,
           delivery_time, price_for_two, is_open, is_veg, has_offer)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id`,
        [
          r.title,
          r.location,
          r.contact,
          DUMMY_TAG,
          r.image,
          r.rating,
          r.cuisine,
          r.deliveryTime,
          r.priceForTwo,
          r.isOpen,
          r.isVeg,
          r.hasOffer,
        ],
      );
      restaurantIds.push(result.rows[0].id);
    }

    // 3. Products
    const productIds = [];
    for (const p of PRODUCTS) {
      const result = await client.query(
        `INSERT INTO products (title, price, category, menu_category, image_url, rating)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id`,
        [p.title, p.price, p.category, p.menuCategory, p.image, p.rating],
      );
      productIds.push(result.rows[0].id);

      // Link to a few restaurants
      for (let i = 0; i < 5; i++) {
        const rid =
          restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
        await client.query(
          `INSERT INTO restaurant_menu (restaurant_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [rid, result.rows[0].id],
        );
      }
    }

    // 4. Transactions (50 entries over last 7 days)
    console.log("Generating 50 transactions...");
    for (let i = 1; i <= 50; i++) {
      const totalAmount = Math.floor(Math.random() * 500000) + 100000; // 1k to 6k rupees in paise
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const tRes = await client.query(
        `INSERT INTO transactions (user_id, total_amount, promo_used, created_at)
         VALUES ($1, $2, 'DUMMY', $3) RETURNING id`,
        [userId, totalAmount, date],
      );

      const tid = tRes.rows[0].id;
      // Add 1-3 items per transaction
      const itemCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < itemCount; j++) {
        const pid = productIds[Math.floor(Math.random() * productIds.length)];
        await client.query(
          `INSERT INTO transaction_items (transaction_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [tid, pid, Math.floor(Math.random() * 3) + 1, 20000],
        );
      }
    }

    await client.query("COMMIT");
    console.log("Big dummy data seeded successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed", err);
  } finally {
    client.release();
  }
}

/**
 * Cleanup dummy data
 */
async function cleanupDummyData() {
  const client = await db.pool.connect();

  try {
    console.log("Cleaning dummy data...");
    await client.query("BEGIN");

    // Delete transaction items first (FK constraint)
    await client.query(
      `DELETE FROM transaction_items
       WHERE transaction_id IN (
         SELECT id FROM transactions WHERE promo_used='DUMMY'
       )`,
    );

    await client.query(`DELETE FROM transactions WHERE promo_used='DUMMY'`);

    await client.query(
      `DELETE FROM restaurant_menu
       WHERE restaurant_id IN (
         SELECT id FROM restaurants WHERE promo=$1
       )`,
      [DUMMY_TAG],
    );

    // Also need to clean up stats if any
    await client.query(
      `DELETE FROM restaurant_stats
         WHERE restaurant_id IN (
           SELECT id FROM restaurants WHERE promo=$1
         )`,
      [DUMMY_TAG],
    );

    await client.query(`DELETE FROM restaurants WHERE promo=$1`, [DUMMY_TAG]);

    // We clean products that are just floating (no safe way to easier track products other than scanning title or linking via menu.
    // Usually standard app would have soft deletes or promo column on products too.
    // For now, let's delete products that were in our list.)
    const codes = PRODUCTS.map((p) => p.title);
    if (codes.length > 0) {
      await client.query("DELETE FROM products WHERE title = ANY($1)", [codes]);
    }

    await client.query(
      `DELETE FROM users WHERE email LIKE 'dummy.%@test.com' OR email LIKE 'owner%@test.com'`,
    );

    await client.query("COMMIT");
    console.log("Dummy data cleaned successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Cleanup failed", err);
  } finally {
    client.release();
  }
}

module.exports = {
  seedDummyData,
  cleanupDummyData,
};
