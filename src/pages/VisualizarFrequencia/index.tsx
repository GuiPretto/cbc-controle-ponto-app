import { Box, Typography } from "@mui/material";

import { useAuth } from "src/hooks/useAuth";
import DataGridFrequencia from "src/components/DataGridFrequencia";

const VisualizarFrequencia = () => {
  const { idUsuario } = useAuth();

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Visualizar frequência
      </Typography>
      <DataGridFrequencia idUsuario={idUsuario} />
    </Box>
  );
};

export default VisualizarFrequencia;
