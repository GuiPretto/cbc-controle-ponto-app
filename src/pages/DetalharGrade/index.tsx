import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGrade } from "src/hooks/useGrade";

const DetalharGrade = () => {
  const navigate = useNavigate();
  const { id: idGradeString } = useParams<{ id: string }>();
  const idGrade = idGradeString ? parseInt(idGradeString, 10) : undefined;
  const { data: grade } = useGetGrade(idGrade);

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Detalhes grade
      </Typography>
      <Stack direction={"row"} gap={"1rem"} sx={{ mt: "1.5rem", mb: "1.5rem" }}>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">
            Entrada Inicial (Bloqueio em min)
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {`${grade?.horarioEntradaInicial} (${grade?.bloqueioEntradaInicial})`}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">
            Saída Inicial (Bloqueio em min)
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {`${grade?.horarioSaidaInicial} (${grade?.bloqueioSaidaInicial})`}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">
            Entrada Final (Bloqueio em min)
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {`${grade?.horarioEntradaFinal} (${grade?.bloqueioEntradaFinal})`}
          </Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, width: "100%" }}>
          <Typography variant="overline">
            Saída Final (Bloqueio em min)
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {`${grade?.horarioSaidaFinal} (${grade?.bloqueioSaidaFinal})`}
          </Typography>
        </Paper>
      </Stack>

      <Stack direction={"row"} gap={"1rem"}>
        <Paper sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" noWrap>
            Dias Úteis
          </Typography>
          <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
            <FormControlLabel
              control={<Checkbox checked={grade?.seg} />}
              label="Segunda-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={<Checkbox checked={grade?.ter} />}
              label="Terça-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={<Checkbox checked={grade?.qua} />}
              label="Quarta-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={<Checkbox checked={grade?.qui} />}
              label="Quinta-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={<Checkbox checked={grade?.sex} />}
              label="Sexta-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={<Checkbox checked={grade?.sab} />}
              label="Sábado"
              labelPlacement="top"
            />
            <FormControlLabel
              control={<Checkbox checked={grade?.dom} />}
              label="Domingo"
              labelPlacement="top"
            />
          </Stack>
        </Paper>
      </Stack>
      <Stack direction={"row"} sx={{ mt: "1.5rem" }} gap={"1rem"}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/listar-grades")}
        >
          Voltar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          onClick={() => navigate(`/listar-grades/${idGrade}/editar`)}
        >
          Editar
        </Button>
      </Stack>
    </Box>
  );
};

export default DetalharGrade;
