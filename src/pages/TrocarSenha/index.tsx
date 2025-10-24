// import { Box } from "@mui/material";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoginCard, SignInContainer } from "../Login/styles";
import ColorModeIconDropdown from "../../components/ColorModeIconDropdown";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordUsuario } from "src/hooks/useUsuario";
import { useSnackbar } from "src/hooks/useSnackbar";
import { useAuth } from "src/hooks/useAuth";

const TrocarSenha = () => {
  const { showSnackbar } = useSnackbar();
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { idUsuario, logout } = useAuth();
  const { mutate: changePasswordMutate, isPending: isChanging } =
    useChangePasswordUsuario();

  const handleChangePassword = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!senha || !confirmacaoSenha) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      if (senha.trim() !== confirmacaoSenha.trim()) {
        setError("As senhas devem ser iguais.");
        return;
      }

      changePasswordMutate(
        {
          id: idUsuario,
          senha: senha,
        },
        {
          onSuccess: () => {
            showSnackbar(`Senha atualizada com sucesso`, "success");
            navigate("/visualizar-frequencia");
          },

          onError: (err) =>
            showSnackbar(`Falha ao atualizar a senha: ${err.message}`, "error"),
        }
      );
    },
    [
      changePasswordMutate,
      showSnackbar,
      navigate,
      idUsuario,
      senha,
      confirmacaoSenha,
    ]
  );

  const handleSair = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
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
          Atualizar a senha
        </Typography>
        <Box
          component="form"
          onSubmit={handleChangePassword}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="password">Nova senha</FormLabel>
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmation-password">
              Confirmar nova senha
            </FormLabel>
            <TextField
              name="confirmation-password"
              placeholder="••••••"
              type="password"
              id="confirmation-password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              value={confirmacaoSenha}
              onChange={(e) => setConfirmacaoSenha(e.target.value)}
            />
          </FormControl>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Stack direction={"row"} gap={"1.5rem"}>
            <Button
              fullWidth
              variant="contained"
              disabled={isChanging}
              onClick={handleSair}
            >
              Sair
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isChanging}
            >
              {isChanging ? "Atualizando..." : "Atualizar"}
            </Button>
          </Stack>
        </Box>
      </LoginCard>
    </SignInContainer>
  );
};

export default TrocarSenha;
