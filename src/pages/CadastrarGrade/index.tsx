import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "src/hooks/useSnackbar";
import { useRegisterGrade } from "src/hooks/useGrade";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { red } from "@mui/material/colors";

const CadastrarGrade = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [e1, setE1] = useState<Dayjs | undefined>(undefined);
  const [e1Error, setE1Error] = useState(false);
  const [e1Bloqueio, setE1Bloqueio] = useState(0);
  const [e1BloqueioError, setE1BloqueioError] = useState(false);
  const [s1, setS1] = useState<Dayjs | undefined>(undefined);
  const [s1Error, setS1Error] = useState(false);
  const [s1Bloqueio, setS1Bloqueio] = useState(0);
  const [s1BloqueioError, setS1BloqueioError] = useState(false);
  const [e2, setE2] = useState<Dayjs | undefined>(undefined);
  const [e2Error, setE2Error] = useState(false);
  const [e2Bloqueio, setE2Bloqueio] = useState(0);
  const [e2BloqueioError, setE2BloqueioError] = useState(false);
  const [s2, setS2] = useState<Dayjs | undefined>(undefined);
  const [s2Error, setS2Error] = useState(false);
  const [s2Bloqueio, setS2Bloqueio] = useState(0);
  const [s2BloqueioError, setS2BloqueioError] = useState(false);
  const [dias, setDias] = useState({
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    dom: false,
  });
  const [diasError, setDiasError] = useState(false);

  const { mutate: cadastrarMutate, isPending: isCadastrando } =
    useRegisterGrade();

  const handleCadastrar = () => {
    setE1Error(false);
    setE1BloqueioError(false);
    setS1Error(false);
    setS1BloqueioError(false);
    setE2Error(false);
    setE2BloqueioError(false);
    setS2Error(false);
    setS2BloqueioError(false);
    setDiasError(false);
    if (
      !e1 ||
      e1Bloqueio === null ||
      e1Bloqueio === undefined ||
      e1Bloqueio < 0 ||
      !s1 ||
      s1Bloqueio === null ||
      s1Bloqueio === undefined ||
      s1Bloqueio < 0 ||
      !e2 ||
      e2Bloqueio === null ||
      e2Bloqueio === undefined ||
      e2Bloqueio < 0 ||
      !s2 ||
      s2Bloqueio === null ||
      s2Bloqueio === undefined ||
      s2Bloqueio < 0 ||
      Object.values(dias).every((valor) => !valor)
    ) {
      if (!e1) {
        setE1Error(true);
      }
      if (!e1Bloqueio) {
        setE1BloqueioError(true);
      }
      if (!s1) {
        setS1Error(true);
      }
      if (!s1Bloqueio) {
        setS1BloqueioError(true);
      }
      if (!e2) {
        setE2Error(true);
      }
      if (!e2Bloqueio) {
        setE2BloqueioError(true);
      }
      if (!s2) {
        setS2Error(true);
      }
      if (!s2Bloqueio) {
        setS2BloqueioError(true);
      }
      if (Object.values(dias).every((valor) => !valor)) {
        setDiasError(true);
      }

      return;
    }

    cadastrarMutate(
      {
        horarioEntradaInicial: e1.format("HH:mm:ss"),
        horarioSaidaInicial: s1.format("HH:mm:ss"),
        horarioEntradaFinal: e2.format("HH:mm:ss"),
        horarioSaidaFinal: s2.format("HH:mm:ss"),
        bloqueioEntradaInicial: e1Bloqueio,
        bloqueioSaidaInicial: s1Bloqueio,
        bloqueioEntradaFinal: e2Bloqueio,
        bloqueioSaidaFinal: s2Bloqueio,
        seg: dias.seg,
        ter: dias.ter,
        qua: dias.qua,
        qui: dias.qui,
        sex: dias.sex,
        sab: dias.sab,
        dom: dias.dom,
      },
      {
        onSuccess: () => {
          setE1(undefined);
          setE1Bloqueio(0);
          setS1(undefined);
          setS1Bloqueio(0);
          setE2(undefined);
          setE2Bloqueio(0);
          setS2(undefined);
          setS2Bloqueio(0);
          showSnackbar("Grade cadastrada com sucesso!", "success");
          navigate("/listar-grades");
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
        Cadastrar grade
      </Typography>
      <FormGroup>
        <Stack direction={"row"} gap={"1rem"} sx={{ maxWidth: "100%" }}>
          <TimePicker
            value={e1}
            onChange={(e) => setE1(dayjs(e))}
            name="e1"
            label="Entrada Inicial (E1)"
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                helperText: e1Error && "HH:MM",
                color: "error",
              },
            }}
          />
          <TimePicker
            value={s1}
            onChange={(e) => setS1(dayjs(e))}
            name="s1"
            label="Saída Inicial (S1)"
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                helperText: s1Error && "HH:MM",
                color: "error",
              },
            }}
          />
          <TimePicker
            value={e2}
            onChange={(e) => setE2(dayjs(e))}
            name="e2"
            label="Entrada Final (S2)"
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                helperText: e2Error && "HH:MM",
                color: "error",
              },
            }}
          />
          <TimePicker
            value={s2}
            onChange={(e) => setS2(dayjs(e))}
            name="s2"
            label="Saída Final (S2)"
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                helperText: s2Error && "HH:MM",
                color: "error",
              },
            }}
          />
        </Stack>
        <Stack
          direction={"row"}
          gap={"1rem"}
          sx={{ mt: "1.5rem" }}
          flexWrap={"nowrap"}
        >
          <TextField
            value={e1Bloqueio}
            onChange={(e) => setE1Bloqueio(Number(e.target.value))}
            type="number"
            name="e1Bloqueio"
            label="Bloqueio E1"
            fullWidth
            error={e1BloqueioError}
            helperText={
              e1BloqueioError && "Bloqueio é obrigatório e maior/igual a 0"
            }
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
            }}
          />
          <TextField
            value={s1Bloqueio}
            onChange={(e) => setS1Bloqueio(Number(e.target.value))}
            type="number"
            name="s1Bloqueio"
            label="Bloqueio S1"
            fullWidth
            error={s1BloqueioError}
            helperText={
              s1BloqueioError && "Bloqueio é obrigatório e maior/igual a 0"
            }
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
            }}
          />
          <TextField
            value={e2Bloqueio}
            onChange={(e) => setE2Bloqueio(Number(e.target.value))}
            type="number"
            name="e2Bloqueio"
            label="Bloqueio E2"
            fullWidth
            error={e2BloqueioError}
            helperText={
              e2BloqueioError && "Bloqueio é obrigatório e maior/igual a 0"
            }
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
            }}
          />
          <TextField
            value={s2Bloqueio}
            onChange={(e) => setS2Bloqueio(Number(e.target.value))}
            type="number"
            name="s2Bloqueio"
            label="Bloqueio S2"
            fullWidth
            error={s2BloqueioError}
            helperText={
              s2BloqueioError && "Bloqueio é obrigatório e maior/igual a 0"
            }
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
            }}
          />
        </Stack>

        <Stack>
          <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.seg}
                  onChange={(e) => setDias({ ...dias, seg: e.target.checked })}
                />
              }
              label="Segunda-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.ter}
                  onChange={(e) => setDias({ ...dias, ter: e.target.checked })}
                />
              }
              label="Terça-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.qua}
                  onChange={(e) => setDias({ ...dias, qua: e.target.checked })}
                />
              }
              label="Quarta-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.qui}
                  onChange={(e) => setDias({ ...dias, qui: e.target.checked })}
                />
              }
              label="Quinta-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.sex}
                  onChange={(e) => setDias({ ...dias, sex: e.target.checked })}
                />
              }
              label="Sexta-feira"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.sab}
                  onChange={(e) => setDias({ ...dias, sab: e.target.checked })}
                />
              }
              label="Sábado"
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dias.dom}
                  onChange={(e) => setDias({ ...dias, dom: e.target.checked })}
                />
              }
              label="Domingo"
              labelPlacement="top"
            />
          </Stack>
          <FormHelperText sx={{ color: red[700] }}>
            {diasError && "Selecione ao menos um dia útil"}
          </FormHelperText>
        </Stack>
        <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            onClick={handleCadastrar}
            disabled={isCadastrando}
          >
            {isCadastrando ? "Salvando..." : "Salvar"}
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  );
};

export default CadastrarGrade;
