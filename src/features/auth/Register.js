import { useState, useEffect } from "react";
import { useRegisterMutation } from "./authApiSlice";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const NewUserForm = () => {
  useTitle("New User");

  const [addNewUser, { isLoading, isSuccess, isError, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      // Clear form fields upon successful registration
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const canSave = [validUsername, validPassword, validEmail].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, email });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={onSaveUserClicked}
        sx={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        {isError && <Alert severity="error">{error?.data?.message}</Alert>}

        <Typography variant="h4" align="center" gutterBottom>
          New User
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={onUsernameChanged}
          error={!validUsername && username.length > 0}
          helperText={!validUsername && username.length > 0 ? "Invalid username (3-20 letters)." : ""}
          autoComplete="off"
          required
        />

        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={onEmailChanged}
          error={!validEmail && email.length > 0}
          helperText={!validEmail && email.length > 0 ? "Invalid email format." : ""}
          autoComplete="off"
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={onPasswordChanged}
          error={!validPassword && password.length > 0}
          helperText={!validPassword && password.length > 0 ? "Invalid password (4-12 chars)." : ""}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!canSave}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default NewUserForm;
