import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Feed from "../../components/Feed";
import Rightbar from "../../components/Rightbar";
import Add from "../../components/Add";

function Home() {
  const [mode, setMode] = useState("light");
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId'); // Or get it from Redux using useSelector

  // Redirect to login if userId is not found
  useEffect(() => {
    if (!userId) {
      console.log('user id check pannu', userId);
      navigate("/login");
    }
  }, [userId, navigate]);

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar/>
        <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar setMode={setMode} mode={mode}  sx={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 1100 }} />
          <Feed />
          <Rightbar />
        </Stack>
        <Add />
      </Box>
    </ThemeProvider>
  );
}

export default Home;
