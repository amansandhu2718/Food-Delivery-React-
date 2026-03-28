import React from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const jump = keyframes`
  0% { transform: translateY(0); }
  20% { transform: translateY(-20px); }
  40% { transform: translateY(0); }
  100% { transform: translateY(0); }
`;

const items = [
    "No Packaging Fee",
    "NO Platform Fee",
    "Lowest Price",
];

export default function JumpingCircles() {
    return (
        <Box
            sx={{
                display: "flex",
                pt: 4,
                gap: { xs: 2, sm: 4 },
                justifyContent: "center",
                alignItems: "center",
                // flexWrap: "wrap",
            }}
        >
            {items.map((text, index) => (
                <Box
                    key={index}
                    sx={{
                        width: { xs: 70, sm: 80, md: 100 },
                        height: { xs: 70, sm: 80, md: 100 },
                        borderRadius: "50%",
                        background: "#ffcb21",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        p: 2,
                        animation: `${jump} 1.8s ease-in-out infinite`,
                        animationDelay: `${index * 0.6}s`,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "0.7rem", sm: "0.9rem" },
                            color: "#000",
                        }}
                    >
                        {text}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}