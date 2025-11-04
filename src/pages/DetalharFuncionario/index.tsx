import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import {
  useChangeAdminUsuario,
  useGetUsuario,
  useResetPasswordUsuario,
} from "src/hooks/useUsuario";
import { useGetGrade } from "src/hooks/useGrade";
import { useCallback, useState } from "react";
import { useSnackbar } from "src/hooks/useSnackbar";
import ModalCadastrarBiometria from "src/components/ModalCadastrarBiometria";
import ModalVisualizarFrequenciaFuncionario from "src/components/ModalVisualizarFrequenciaFuncionario";
import { useAuth } from "src/hooks/useAuth";

const DetalhesFuncionario = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { id: idUsuarioString } = useParams<{ id: string }>();
  const idUsuario = idUsuarioString ? parseInt(idUsuarioString, 10) : undefined;
  const { data: usuario } = useGetUsuario(idUsuario);
  const { data: grade } = useGetGrade(usuario?.idGrade ?? undefined);
  const { mutate: resetPasswordMutate, isPending: isReseting } =
    useResetPasswordUsuario();
  const { mutate: changeAdminMutate, isPending: isChangingAdmin } =
    useChangeAdminUsuario();
  const [cadastrarBiometriaOpen, setCadastrarBiometriaOpen] = useState(false);
  const [visualizarFrequenciaOpen, setVisualizarFrequenciaOpen] =
    useState(false);

  const formatCpf = (cpfValue: string) => {
    const numbers = String(cpfValue).replace(/\D/g, "");
    if (numbers.length !== 11) {
      return cpfValue;
    }
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleResetPassword = useCallback(() => {
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

  const handleChangeAdmin = useCallback(() => {
    changeAdminMutate(idUsuario, {
      onSuccess: (e) =>
        showSnackbar(
          `Usuário ${e?.nome} ${
            e?.admin ? "tornou-se admin" : "deixou de ser admin"
          }`,
          "success"
        ),
      onError: (err) =>
        showSnackbar(
          `Falha ao alterar o papel de admin: ${err.message}`,
          "error"
        ),
    });
  }, [changeAdminMutate, showSnackbar, idUsuario]);

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
            {usuario?.cpf && formatCpf(usuario?.cpf)}
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
          disabled={isReseting || isChangingAdmin}
        >
          Voltar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {role === "MASTER" && (
          <Button
            variant="contained"
            onClick={handleChangeAdmin}
            disabled={isReseting || isChangingAdmin}
          >
            {usuario?.admin ? "Remover admin" : "Tornar admin"}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => setVisualizarFrequenciaOpen(true)}
        >
          Visualizar frequência
        </Button>
        <Button
          variant="contained"
          onClick={() => setCadastrarBiometriaOpen(true)}
        >
          Cadastrar biometria
        </Button>
        <Button
          variant="contained"
          onClick={handleResetPassword}
          disabled={isReseting || isChangingAdmin}
        >
          Resetar senha
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/listar-funcionarios/${idUsuario}/editar`)}
          disabled={isReseting || isChangingAdmin}
        >
          Editar
        </Button>
      </Stack>
      {cadastrarBiometriaOpen && usuario?.id && (
        <ModalCadastrarBiometria
          idUsuario={usuario.id}
          open={cadastrarBiometriaOpen}
          setOpen={setCadastrarBiometriaOpen}
        />
      )}
      {visualizarFrequenciaOpen && usuario?.id && (
        <ModalVisualizarFrequenciaFuncionario
          idUsuario={usuario.id}
          nome={usuario.nome}
          cpf={usuario.cpf}
          open={visualizarFrequenciaOpen}
          setOpen={setVisualizarFrequenciaOpen}
        />
      )}
    </Box>
  );
};

export default DetalhesFuncionario;
