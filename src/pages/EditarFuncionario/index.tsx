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
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useGrades } from "src/hooks/useGrade";
import { useSnackbar } from "src/hooks/useSnackbar";
import { useGetUsuario, useUpdateUsuario } from "src/hooks/useUsuario";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditarFuncionario = () => {
  const navigate = useNavigate();
  const { id: idUsuarioString } = useParams<{ id: string }>();
  const idUsuario = idUsuarioString ? parseInt(idUsuarioString) : undefined;
  const { data: usuario } = useGetUsuario(idUsuario);
  const { showSnackbar } = useSnackbar();
  const [nome, setNome] = useState(usuario?.nome);
  const [nomeError, setNomeError] = useState(false);
  const [cpf, setCpf] = useState(usuario?.cpf);
  const [cpfError, setCpfError] = useState(false);
  const [email, setEmail] = useState(usuario?.email);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [grade, setGrade] = useState<number | string | undefined>(
    usuario?.idGrade
  );
  const [gradeError, setGradeError] = useState(false);
  const { data: grades } = useGrades();
  const { mutate: updateMutate, isPending: isAtualizando } = useUpdateUsuario();

  const handleAtualizar = () => {
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

    updateMutate(
      {
        id: idUsuario,
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
          showSnackbar("Funcionário atualizado com sucesso!", "success");
          navigate(`/listar-funcionarios/${idUsuario}`);
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
        Editar funcionário
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
            <FormHelperText>
              {gradeError && "Grade é obrigatória"}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/listar-funcionarios/${idUsuario}`)}
            // disabled={isCadastrando}
          >
            Voltar
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            onClick={handleAtualizar}
            disabled={isAtualizando}
          >
            {isAtualizando ? "Atualizando..." : "Atualizar"}
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  );
};

export default EditarFuncionario;
