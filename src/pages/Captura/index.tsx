import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginCard, SignInContainer } from "../Login/styles";
import ColorModeIconDropdown from "src/components/ColorModeIconDropdown";
import { Button, Stack, Typography } from "@mui/material";
import { ArrowBack, Fingerprint } from "@mui/icons-material";

const Captura = () => {
  const navigate = useNavigate();
  const firstUpdate = useRef(true);
  const [last, setLast] = useState<unknown>(null);
  const [status, setStatus] = useState("Parado");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    async function start() {
      setLoading(true);
      const res = await window.api.fingerprint.start();
      console.log("teste");
      if (res?.success) setStatus("Aguardando digital...");
      else setStatus("Erro ao iniciar");
      setLoading(false);
    }
    start();

    const onData = (data: unknown) => {
      console.log("Recebi digital:", data);
      setLast(data);
    };
    const onError = (err: unknown) => {
      console.error("Erro fingerprint:", err);
    };
    window.api.fingerprint.onData(onData);
    window.api.fingerprint.onError(onError);

    return () => {
      window.api.fingerprint.stop();
    };
  }, []);

  return (
    <SignInContainer>
      <ColorModeIconDropdown
        sx={{ position: "fixed", top: "1rem", right: "1rem" }}
      />
      <LoginCard variant="outlined">
        <Typography
          component="h1"
          variant="h3"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {loading ? "Carregando dispositivo biométrico..." : status}
        </Typography>
        <Stack direction={"row"} justifyContent={"center"}>
          <Fingerprint sx={{ fontSize: "6rem", mt: "1.5rem", mb: "1.5rem" }} />
        </Stack>
        <Stack direction={"row"}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/login")}
          >
            Voltar
          </Button>
        </Stack>
      </LoginCard>
    </SignInContainer>
  );
};

export default Captura;
