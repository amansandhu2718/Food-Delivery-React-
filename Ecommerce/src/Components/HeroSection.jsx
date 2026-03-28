import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Container maxWidth="xxl" sx={{ mt: 2, px: { xs: 2, md: 8 } }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "40px",
          bgcolor: theme.palette.mode === "dark" ? "background.paper" : "#141414",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          boxShadow: theme.palette.mode === "dark" ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=70"
          alt="Cravvy"
          loading="lazy"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 10, px: { xs: 4, md: 12 }, maxWidth: 900 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: 0.8,
              borderRadius: "100px",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              mb: 3,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            Editor's Signature Picks
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.8rem", md: "5.5rem" },
              color: "white",
              lineHeight: 1,
              mb: 3,
              fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.04em",
            }}
          >
            The Art of <br />
            <Box component="span" sx={{ color: "primary.main", filter: "brightness(1.2)" }}>
              Fine Dining
            </Box>
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: { xs: "1rem", md: "1.25rem" },
              mb: 6,
              fontWeight: 500,
              maxWidth: 550,
              lineHeight: 1.5,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            A curated journal of the city's finest kitchens, delivered with surgical precision to your doorstep.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "center" }}>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/explore")}
              sx={{
                px: 5,
                py: 2,
                bgcolor: "primary.main",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "0 20px 40px rgba(1, 128, 41, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              Explore Menus
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/ExploreFood")}
              sx={{
                px: 5,
                py: 2,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.4)",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                bgcolor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              View Journals
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Hero;
