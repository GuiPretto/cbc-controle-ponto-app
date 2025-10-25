import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { useRegisterJustificativa } from "src/hooks/useJustificativa";
import { useSnackbar } from "src/hooks/useSnackbar";

const RegistrarJustificativa = () => {
  const navigate = useNavigate();
  const { idUsuario } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [data, setData] = useState<Dayjs>(dayjs());
  const [dataError, setDataError] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [motivoError, setMotivoError] = useState(false);
  const [periodos, setPeriodos] = useState({
    e1: false,
    s1: false,
    e2: false,
    s2: false,
  });
  const [periodosError, setPeriodosError] = useState(false);
  const { mutate: cadastrarMutate, isPending: isCadastrando } =
    useRegisterJustificativa();

  const handleCadastrar = () => {
    setDataError(false);
    setMotivoError(false);
    setPeriodosError(false);
    if (
      !idUsuario ||
      !data ||
      !motivo ||
      Object.values(periodos).every((valor) => !valor)
    ) {
      if (!idUsuario) {
        showSnackbar(
          "Ocorreu um erro, por favor, deslogue e logue novamente.",
          "error"
        );
      }
      if (!data) {
        setDataError(true);
      }
      if (!motivo) {
        setMotivoError(true);
      }
      if (Object.values(periodos).every((valor) => !valor)) {
        setPeriodosError(true);
      }
      return;
    }

    cadastrarMutate(
      {
        data: data.format("YYYY-MM-DD"),
        motivo,
        entradaInicial: periodos.e1,
        saidaInicial: periodos.s1,
        entradaFinal: periodos.e2,
        saidaFinal: periodos.s2,
        idUsuario: idUsuario,
      },
      {
        onSuccess: () => {
          setMotivo("");
          setPeriodos({
            e1: false,
            s1: false,
            e2: false,
            s2: false,
          });
          showSnackbar("Justificativa cadastrada com sucesso!", "success");
          navigate("/visualizar-frequencia");
        },
        onError: (e) => {
          showSnackbar(e.message, "error");
        },
      }
    );
  };

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Registrar justificativa
      </Typography>
      <FormGroup>
        <Stack direction={"row"} gap={"1rem"}>
          <FormControl>
            <DatePicker
              value={data}
              onChange={(e) => setData(dayjs(e))}
              name="data"
              label="Data"
              slotProps={{
                textField: {
                  helperText: dataError && "MM/DD/YYYY",
                },
              }}
            />
          </FormControl>
          <TextField
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            name="motivo"
            label="MOTIVO"
            fullWidth
            error={motivoError}
            helperText={motivoError && "Motivo é obrigatório"}
          />
        </Stack>
        <Stack>
          <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={periodos.e1}
                  onChange={(e) =>
                    setPeriodos({ ...periodos, e1: e.target.checked })
                  }
                />
              }
              label="Entrada Inicial (E1)"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={periodos.s1}
                  onChange={(e) =>
                    setPeriodos({ ...periodos, s1: e.target.checked })
                  }
                />
              }
              label="Saída Inicial (S1)"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={periodos.e2}
                  onChange={(e) =>
                    setPeriodos({ ...periodos, e2: e.target.checked })
                  }
                />
              }
              label="Entrada Final (E2)"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={periodos.s2}
                  onChange={(e) =>
                    setPeriodos({ ...periodos, s2: e.target.checked })
                  }
                />
              }
              label="Entrada Final (S2)"
              labelPlacement="top"
            />
          </Stack>
          <FormHelperText sx={{ color: red[700] }}>
            {periodosError && "Selecione ao menos um período"}
          </FormHelperText>
        </Stack>
        <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            onClick={handleCadastrar}
            disabled={isCadastrando}
          >
            {isCadastrando ? "Registrando..." : "Registrar"}
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  );
};

export default RegistrarJustificativa;
