import { Box, Button, Modal, Paper, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useGetCurrentUsuario } from "src/hooks/useUsuario";
import { useAuth } from "src/hooks/useAuth";
import { useGetGrade } from "src/hooks/useGrade";

interface ModalPerfilUsuarioProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const sxBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "600px",
  maxHeight: "600px",
  backgroundColor: "background.default",
  borderRadius: "8px",
  p: "1.5rem",
};

const ModalPerfilUsuario = ({ open, setOpen }: ModalPerfilUsuarioProps) => {
  const { idUsuario } = useAuth();
  const { data: usuario } = useGetCurrentUsuario(idUsuario);
  const { data: grade } = useGetGrade(usuario?.idGrade ?? undefined);

  const formatCpf = (cpfValue: string) => {
    const numbers = String(cpfValue).replace(/\D/g, "");
    if (numbers.length !== 11) {
      return cpfValue;
    }
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Stack sx={sxBox} gap={"1.5rem"}>
        <Typography variant="h4" sx={{ mb: "1rem", width: "100%" }}>
          Perfil
        </Typography>
        <Stack direction={"row"} gap={"1rem"} sx={{}}>
          <Paper sx={{ px: 2, py: 1, width: "100%" }}>
            <Typography variant="overline">Nome</Typography>
            <Typography variant="body1">{usuario?.nome}</Typography>
          </Paper>
          <Paper sx={{ px: 2, py: 1, width: "100%" }}>
            <Typography variant="overline">CPF</Typography>
            <Typography variant="body1">
              {usuario?.cpf && formatCpf(usuario?.cpf)}
            </Typography>
          </Paper>
        </Stack>
        <Stack direction={"row"} gap={"1rem"} sx={{}}>
          <Paper sx={{ px: 2, py: 1, width: "100%" }}>
            <Typography variant="overline">E-mail</Typography>
            <Typography variant="body1">{usuario?.email}</Typography>
          </Paper>
          <Paper sx={{ px: 2, py: 1, width: "100%" }}>
            <Typography variant="overline">Status</Typography>
            <Typography variant="body1">
              {usuario?.ativo ? "Ativo" : "Inativo"}
            </Typography>
          </Paper>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline" noWrap>
              Data Criação
            </Typography>
            <Typography variant="body1">
              {usuario?.dataCriacao
                ? new Date(usuario.dataCriacao).toLocaleDateString()
                : "-"}
            </Typography>
          </Paper>
        </Stack>
        <Stack direction={"row"} gap={"1rem"}>
          <Paper sx={{ px: 2, py: 1, width: "100%" }}>
            <Typography variant="overline">Grade</Typography>
            <Typography variant="body1">
              {`${grade?.horarioEntradaInicial} - ${grade?.horarioSaidaInicial} - ${grade?.horarioEntradaFinal} - ${grade?.horarioSaidaFinal}`}
            </Typography>
          </Paper>
        </Stack>
        <Stack direction={"row"} sx={{ width: "100%" }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => setOpen(false)}
          >
            Voltar
          </Button>
          <Box sx={{ flexGrow: 1 }} />
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalPerfilUsuario;
