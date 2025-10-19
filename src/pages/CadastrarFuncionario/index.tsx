import {
  Box,
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useGrades } from "src/hooks/useGrade";

const CadastrarFuncionario = () => {
  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState(false);
  const [cpf, setCpf] = useState("");
  const [idGrade, setIdGrade] = useState<number>();
  const { data: grades } = useGrades();

  const handleCadastrar = () => {
    setNomeError(false);
    if (!nome) {
      setNomeError(true);
    }
  };

  return (
    <Box p={"2rem"}>
      <Typography variant="h4" sx={{ mb: "1rem" }}>
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
        <Stack sx={{ mt: "1.5rem" }}>
          <FormControl>
            <InputLabel id="grade-select">Grade</InputLabel>
            <Select
              value={idGrade}
              onChange={(e) => setIdGrade(e.target.value)}
              name="grade"
              label="Grade"
              labelId="grade-select"
              fullWidth
            >
              {grades?.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {`${g.horarioEntradaInicial} - ${g.horarioSaidaInicial} - ${g.horarioEntradaFinal} - ${g.horarioSaidaFinal}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={"row"} sx={{ mt: "1.5rem" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" onClick={handleCadastrar}>
            Salvar
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  );
};

export default CadastrarFuncionario;
