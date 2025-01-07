import { Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";
import Register from './features/auth/Register';
import Home from "./features/home/Home";
import RequireAuth from './features/auth/RequireAuth'; // Import RequireAuth

function App() {
  const [mode, setMode] = useState("light");

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Persist Login */}
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            {/* Protected Routes */}
            <Route
              path="home"
              element={
                <RequireAuth>
                  <Home /> {/* Wrap the Home component with RequireAuth */}
                </RequireAuth>
              }
            />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
