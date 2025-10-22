import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { LoginCard, SignInContainer } from "./styles";
import ColorModeIconDropdown from "../../components/ColorModeIconDropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoading, login: authLogin } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!cpf || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const result = await authLogin(cpf, password);
      if (result.success) {
        navigate("/visualizar-batidas");
      } else {
        setError(
          result.error || "Erro de autenticação. Verifique suas credenciais."
        );
      }
    } catch (err) {
      setError("Falha na comunicação com o Processo Principal.");
      console.error("Login IPC error:", err);
    }
  };

  return (
    <SignInContainer>
      <ColorModeIconDropdown
        sx={{ position: "fixed", top: "1rem", right: "1rem" }}
      />
      <LoginCard variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">CPF</FormLabel>
            <TextField
              id="cpf"
              type="number"
              name="cpf"
              placeholder="12345678912"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
                "& input[type=number]": {
                  "-moz-appearance": "textfield",
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          <Button onClick={() => navigate("/captura")}>Captura</Button>
        </Box>
      </LoginCard>
    </SignInContainer>
  );
};

export default Login;
