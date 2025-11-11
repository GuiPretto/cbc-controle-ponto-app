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
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { useGetGrade } from "src/hooks/useGrade";
import {
  useDeleteJustificativa,
  useGetByUserAndDateJustificativa,
  useRegisterJustificativa,
  useUpdateJustificativa,
} from "src/hooks/useJustificativa";
import { useSnackbar } from "src/hooks/useSnackbar";

const RegistrarJustificativa = () => {
  const navigate = useNavigate();
  const { idUsuario, idGrade } = useAuth();
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
  const { mutate: editarMutate, isPending: isEditando } =
    useUpdateJustificativa();
  const { mutate: excluirMutate, isPending: isExcluindo } =
    useDeleteJustificativa();
  const { data: grade } = useGetGrade(idGrade ?? undefined);
  const { data: justificativa, isLoading: isBuscandoJustificativa } =
    useGetByUserAndDateJustificativa(idUsuario, data.format("YYYY-MM-DD"));

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
          showSnackbar("Justificativa cadastrada com sucesso!", "success");
          navigate("/visualizar-frequencia");
        },
        onError: (e) => {
          showSnackbar(e.message, "error");
        },
      }
    );
  };

  const handleEditar = () => {
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

    editarMutate(
      {
        id: justificativa?.id,
        motivo,
        entradaInicial: periodos.e1,
        saidaInicial: periodos.s1,
        entradaFinal: periodos.e2,
        saidaFinal: periodos.s2,
      },
      {
        onSuccess: () => {
          showSnackbar("Justificativa cadastrada com sucesso!", "success");
          navigate("/visualizar-frequencia");
        },
        onError: (e) => {
          showSnackbar(e.message, "error");
        },
      }
    );
  };

  const handleExcluir = () => {
    setDataError(false);
    setMotivoError(false);
    setPeriodosError(false);
    if (!justificativa?.id || !idUsuario) {
      showSnackbar(
        "Ocorreu um erro, por favor, deslogue e logue novamente.",
        "error"
      );
      return;
    }
    excluirMutate(
      {
        id: justificativa.id,
        idUsuario,
      },
      {
        onSuccess: () => {
          showSnackbar("Justificativa excluída com sucesso!", "success");
          navigate("/visualizar-frequencia");
        },
        onError: (e) => {
          showSnackbar(e.message, "error");
        },
      }
    );
  };

  const getDiaUtil = useCallback(
    (diaSemana: number) => {
      switch (diaSemana) {
        case 0:
          return grade?.dom;
        case 1:
          return grade?.seg;
        case 2:
          return grade?.ter;
        case 3:
          return grade?.qua;
        case 4:
          return grade?.qui;
        case 5:
          return grade?.sex;
        case 6:
          return grade?.sab;
      }
    },
    [grade]
  );

  const getDiaAnteriorNaGrade = useCallback(
    (diaAtual: Dayjs) => {
      const diaAnterior = diaAtual.subtract(1, "day");
      if (getDiaUtil(diaAnterior.day())) {
        return diaAnterior;
      } else {
        return getDiaAnteriorNaGrade(diaAnterior);
      }
    },
    [getDiaUtil]
  );

  useEffect(() => {
    if (grade) {
      const teste = getDiaAnteriorNaGrade(dayjs());
      setData(teste);
    }
  }, [getDiaAnteriorNaGrade, grade]);

  useEffect(() => {
    if (justificativa) {
      setMotivo(justificativa.motivo);
      setPeriodos({
        e1: justificativa.entradaInicial,
        s1: justificativa.saidaInicial,
        e2: justificativa.entradaFinal,
        s2: justificativa.saidaFinal,
      });
    }
  }, [justificativa]);

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "2rem" }}>
        Registrar justificativa
      </Typography>
      <FormGroup>
        <Stack direction={"row"} gap={"1rem"}>
          <FormControl>
            <DatePicker
              readOnly
              value={data}
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
        <Stack direction={"row"} sx={{ mt: "1.5rem" }} gap={"1rem"}>
          <Box sx={{ flexGrow: 1 }} />
          {justificativa && (
            <Button
              variant="contained"
              onClick={handleExcluir}
              disabled={isExcluindo}
            >
              {isExcluindo ? "Excluindo..." : "Excluir"}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={justificativa ? handleEditar : handleCadastrar}
            disabled={isCadastrando || isEditando || isBuscandoJustificativa}
          >
            {isCadastrando || isEditando ? "Registrando..." : "Registrar"}
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  );
};

export default RegistrarJustificativa;
