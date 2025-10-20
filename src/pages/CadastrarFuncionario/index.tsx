import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGrades } from "src/hooks/useGrade";
import { useSnackbar } from "src/hooks/useSnackbar";
import { useRegisterUsuario } from "src/hooks/useUsuario";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CadastrarFuncionario = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState(false);
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [grade, setGrade] = useState<number | string>(" ");
  const [gradeError, setGradeError] = useState(false);
  const { data: grades } = useGrades();
  const { mutate: cadastrarMutate, isPending: isCadastrando } =
    useRegisterUsuario();

  const handleCadastrar = () => {
    setNomeError(false);
    setCpfError(false);
    setEmailError(false);
    setEmailErrorMessage("");
    setGradeError(false);
    if (
      !nome ||
      !cpf ||
      !email ||
      !EMAIL_REGEX.test(email) ||
      !grade ||
      grade === " "
    ) {
      if (!nome) {
        setNomeError(true);
      }
      if (!cpf) {
        setCpfError(true);
      }
      if (!email || !EMAIL_REGEX.test(email)) {
        setEmailErrorMessage(
          !email ? "E-mail é obrigatório" : "Este e-mail está incorreto"
        );
        setEmailError(true);
      }
      if (!grade || grade === " ") {
        setGradeError(true);
      }
      return;
    }

    cadastrarMutate(
      {
        nome,
        cpf,
        email,
        idGrade: Number(grade),
      },
      {
        onSuccess: () => {
          setNome("");
          setCpf("");
          setEmail("");
          setGrade(" ");
          showSnackbar("Funcionário cadastrado com sucesso!", "success");
          navigate("/listar-funcionarios");
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
        Cadastrar funcionário
      </Typography>
      <FormGroup>
        <Stack direction={"row"} gap={"1rem"}>
          <TextField
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            name="nome"
            label="Nome"
            error={nomeError}
            helperText={nomeError && "Nome é obrigatório"}
            fullWidth
          />

          <TextField
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            type="number"
            name="cpf"
            label="CPF"
            fullWidth
            error={cpfError}
            helperText={cpfError && "CPF é obrigatório"}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            label="E-mail"
            error={emailError}
            helperText={emailError && emailErrorMessage}
            fullWidth
          />
        </Stack>
        <Stack sx={{ mt: "1.5rem" }}>
          <FormControl error={!!gradeError}>
            <InputLabel id="grade-select">Grade</InputLabel>
            <Select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              name="grade"
              label="Grade"
              labelId="grade-select"
              fullWidth
              error={gradeError}
            >
              <MenuItem value=" " disabled>
                <em>Selecione a grade</em>
              </MenuItem>
              {grades?.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {`${g.horarioEntradaInicial} - ${g.horarioSaidaInicial} - ${g.horarioEntradaFinal} - ${g.horarioSaidaFinal}`}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{gradeError && "Teste"}</FormHelperText>
          </FormControl>
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

export default CadastrarFuncionario;
