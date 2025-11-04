import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoginCard, SignInContainer } from "./styles";
import ColorModeIconDropdown from "../../components/ColorModeIconDropdown";
import CbcLogo from "../../assets/logo-cbc.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import InputMask from "react-input-mask";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoading, login: authLogin } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!cpf.replace(/\D/g, "") || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const result = await authLogin(cpf.replace(/\D/g, ""), password);
      if (result.success) {
        if (result.data?.role === "ADMIN") {
          navigate("/listar-funcionarios");
        } else {
          navigate("/visualizar-frequencia");
        }
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
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"1rem"}
        >
          <img src={CbcLogo} width={36} height={36} />
          <Typography
            fontFamily={"Nexa"}
            component="h1"
            variant="h4"
            sx={{ fontSize: "1.5rem" }}
          >
            Controle de Ponto
          </Typography>
        </Stack>
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
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <InputMask
                mask="999.999.999-99"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                maskChar=" "
              >
                {() => <TextField />}
              </InputMask>
            }
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
