import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUsuario, useResetPasswordUsuario } from "src/hooks/useUsuario";
import { useGetGrade } from "src/hooks/useGrade";
import { useCallback } from "react";
import { useSnackbar } from "src/hooks/useSnackbar";

const DetalhesFuncionario = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { id: idUsuarioString } = useParams<{ id: string }>();
  const idUsuario = idUsuarioString ? parseInt(idUsuarioString, 10) : undefined;
  const { data: usuario } = useGetUsuario(idUsuario);
  const { data: grade } = useGetGrade(usuario?.idGrade ?? undefined);
  const { mutate: resetPasswordMutate, isPending: isReseting } =
    useResetPasswordUsuario();

  const handleResetPassword = useCallback(() => {
    console.log("teste");
    resetPasswordMutate(idUsuario, {
      onSuccess: () =>
        showSnackbar(
          `Senha do usuário ${usuario?.nome} resetada com sucesso`,
          "success"
        ),
      onError: (err) =>
        showSnackbar(`Falha ao resetar a senha: ${err.message}`, "error"),
    });
  }, [resetPasswordMutate, showSnackbar, idUsuario, usuario]);

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Detalhes funcionário
      </Typography>
      <Stack direction={"row"} gap={"1rem"} sx={{ mt: "1.5rem", mb: "1.5rem" }}>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">Nome</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {usuario?.nome}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">CPF</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {usuario?.cpf}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">E-mail</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {usuario?.email}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">Status</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {usuario?.ativo ? "Ativo" : "Inativo"}
          </Typography>
        </Paper>
      </Stack>
      <Stack direction={"row"} gap={"1rem"}>
        <Paper sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" noWrap>
            Data Criação
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {usuario?.dataCriacao
              ? new Date(usuario.dataCriacao).toLocaleDateString()
              : "-"}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">Grade</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {`${grade?.horarioEntradaInicial} - ${grade?.horarioSaidaInicial} - ${grade?.horarioEntradaFinal} - ${grade?.horarioSaidaFinal}`}
          </Typography>
        </Paper>
      </Stack>
      <Stack direction={"row"} sx={{ mt: "1.5rem" }} gap={"1rem"}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/listar-funcionarios")}
          disabled={isReseting}
        >
          Voltar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          onClick={handleResetPassword}
          disabled={isReseting}
        >
          Resetar senha
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/listar-funcionarios/${idUsuario}/editar`)}
          disabled={isReseting}
        >
          Editar
        </Button>
      </Stack>
    </Box>
  );
};

export default DetalhesFuncionario;
