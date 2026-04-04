import React, { useState, useEffect } from "react";
import { Box, Typography, Container, IconButton, Button, Grid, Fade, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Assets
import heroImg from "../assets/hero.jpg";
import heroImg2 from "../assets/hero2.jpg";
import heroImg3 from "../assets/hero3.jpg";

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const images = [
    {
      src: heroImg,
      title: "Changing Minds",
      subtitle: "Changing Laws",
      thirdline: "Changing Lives",
      description: "HERCIRCLE offers hope, courage, and community to everyone impacted by sexual violence.",
    },
    {
      src: heroImg2,
      title: "Empower Her Journey",
      subtitle: "Transform Her Future",
      thirdline: "Together We Rise",
      description: "Join thousands of women who have found their strength and voice with HerCircle.",
    },
    {
      src: heroImg3,
      title: "You Are Not Alone",
      subtitle: "Support Is Here",
      thirdline: "24/7 Available",
      description: "Access free counseling, legal aid, and a community that truly cares.",
    },
  ];

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setFade(true);
    }, 300);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fdfbf9", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      
      {/* BACKGROUND DECOR (Subtle circles) */}
      <Box sx={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", bgcolor: "#f7ece7", zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          
          {/* IMAGE SECTION (Main Attraction) */}
          <Grid item xs={12} md={6}>
            <Fade in={fade} timeout={800}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: "350px", md: "550px" },
                    borderRadius: "30px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    border: "12px solid #fff",
                  }}
                >
                  <Box
                    component="img"
                    src={images[currentIndex].src}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                
                {/* FLOATING BADGE */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    left: -20,
                    bgcolor: "#c27a5f",
                    color: "#fff",
                    px: 3,
                    py: 1,
                    borderRadius: "10px",
                    fontWeight: "bold",
                    boxShadow: "0 10px 20px rgba(194, 122, 95, 0.4)",
                  }}
                >
                  Since 2024
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* TEXT CONTENT SECTION */}
          <Grid item xs={12} md={6}>
            <Fade in={fade} timeout={600}>
              <Box>
                <Typography variant="overline" sx={{ color: "#c27a5f", fontWeight: 700, letterSpacing: 2 }}>
                  Heroic Initiatives
                </Typography>
                
                <Typography sx={{ fontSize: { xs: "2.5rem", md: "3.8rem" }, fontWeight: 900, color: "#3d2c35", lineHeight: 1.1, mb: 1 }}>
                  {images[currentIndex].title}
                </Typography>
                
                <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" }, fontWeight: 400, color: "#c27a5f", mb: 3 }}>
                  {images[currentIndex].subtitle}
                </Typography>

                <Typography sx={{ fontSize: "1.1rem", color: "#6b5260", lineHeight: 1.7, mb: 4, maxWidth: "450px" }}>
                  {images[currentIndex].description}
                </Typography>

                {/* CALL TO ACTION */}
                <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
                  <Button variant="contained" disableElevation sx={{ bgcolor: "#3d2c35", color: "#fff", px: 4, py: 1.5, borderRadius: "12px", "&:hover": { bgcolor: "#c27a5f" } }}>
                    Join Us
                  </Button>
                  <Button variant="outlined" sx={{ borderColor: "#3d2c35", color: "#3d2c35", px: 4, borderRadius: "12px", borderWidth: "2px", "&:hover": { borderWidth: "2px" } }}>
                    Read More
                  </Button>
                </Stack>

                {/* SLIDE INDICATORS (The dots) */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {images.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: index === currentIndex ? "40px" : "10px",
                        height: "10px",
                        borderRadius: "5px",
                        bgcolor: index === currentIndex ? "#c27a5f" : "#d9977e",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Grid>

        </Grid>
      </Container>

      {/* NAVIGATION ARROWS (Corner Styled) */}
      <Box sx={{ position: "absolute", bottom: 40, right: 60, display: "flex", gap: 1 }}>
        <IconButton onClick={handlePrev} sx={{ border: "1px solid #3d2c35", borderRadius: "12px" }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={handleNext} sx={{ bgcolor: "#3d2c35", color: "#fff", borderRadius: "12px", "&:hover": { bgcolor: "#c27a5f" } }}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Hero;