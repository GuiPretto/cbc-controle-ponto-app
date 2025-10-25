import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ArrowBack } from "@mui/icons-material";
import DataGridFrequencia from "../DataGridFrequencia";

interface ModalVisualizarFrequenciaFuncionarioProps {
  idUsuario: number;
  nome: string;
  cpf: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const sxBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "960px",
  maxHeight: "90vh",
  backgroundColor: "background.paper",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: "1.5rem",
};

const ModalVisualizarFrequenciaFuncionario = ({
  idUsuario,
  nome,
  cpf,
  open,
  setOpen,
}: ModalVisualizarFrequenciaFuncionarioProps) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Stack sx={sxBox} gap={"1.5rem"}>
        <Stack direction={"row"} gap={"1.5rem"} sx={{ width: "100%" }}>
          <Box>
            <Typography variant="overline">Nome</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {nome}
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline">Cpf</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {cpf}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ width: "100%", minHeight: "100px" }}>
          <DataGridFrequencia idUsuario={idUsuario} />
        </Box>
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

export default ModalVisualizarFrequenciaFuncionario;
