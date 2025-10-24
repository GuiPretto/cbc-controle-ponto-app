import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginCard, SignInContainer } from "../Login/styles";
import ColorModeIconDropdown from "src/components/ColorModeIconDropdown";
import { Button, Stack, Typography } from "@mui/material";
import { ArrowBack, Fingerprint } from "@mui/icons-material";
import { useRegisterBatida } from "src/hooks/useBatida";
import { RegisterBatidaDto } from "electron/services/BatidaService";
import { useSnackbar } from "src/hooks/useSnackbar";
import DigitalClock from "src/components/DigitalClock";
import { red } from "@mui/material/colors";

import { Usuario } from "electron/services/UsuarioService";

const Captura = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const firstUpdate = useRef(true);
  const [status, setStatus] = useState("Parado");
  const [loadingDispositivo, setLoadingDispositivo] = useState(false);
  const { mutate: registrarMutate } = useRegisterBatida();
  const isProcessandoRef = useRef(false);
  const [usuarioInfo, setUsuarioInfo] = useState<Usuario | undefined>(
    undefined
  );
  const [iconStatus, setIconStatus] = useState<"success" | "error" | undefined>(
    undefined
  );

  const handleRegistrar = (template: string) => {
    if (isProcessandoRef.current) return;
    isProcessandoRef.current = true;
    registrarMutate(
      { template },
      {
        onSuccess: (e) => {
          showSnackbar("Batida registrada!", "success");
          setUsuarioInfo(e);
          setIconStatus("success");
          setTimeout(() => {
            isProcessandoRef.current = false;
            setUsuarioInfo(undefined);
            setIconStatus(undefined);
          }, 4000);
        },
        onError: (err) => {
          showSnackbar(
            err.message === "Error" ? "Sistema fora do ar" : err.message,
            "error"
          );
          setIconStatus("error");
          setTimeout(() => {
            isProcessandoRef.current = false;
            setUsuarioInfo(undefined);
            setIconStatus(undefined);
          }, 4000);
        },
      }
    );
  };

  const onData = (data: unknown) => {
    if (typeof data === "object" && !isProcessandoRef.current) {
      const dataTipada = data as RegisterBatidaDto;
      handleRegistrar(dataTipada.template);
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    async function start() {
      setLoadingDispositivo(true);
      const res = await window.api.fingerprint.start();
      if (res?.success) setStatus("Aguardando digital...");
      else setStatus("Erro ao iniciar");
      setLoadingDispositivo(false);
    }
    start();
    window.api.fingerprint.onData(onData);
    return () => {
      window.api.fingerprint.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SignInContainer>
      <ColorModeIconDropdown
        sx={{ position: "fixed", top: "1rem", right: "1rem" }}
      />
      <LoginCard variant="outlined">
        <DigitalClock />
        {usuarioInfo ? (
          <>
            <Typography
              component="h1"
              textAlign={"center"}
              sx={{ width: "100%", fontSize: "1.5rem" }}
            >
              {usuarioInfo.nome}
            </Typography>
            <Typography
              component="h1"
              textAlign={"center"}
              sx={{ width: "100%", fontSize: "1.25rem" }}
            >
              {usuarioInfo.cpf}
            </Typography>
          </>
        ) : (
          <Typography
            component="h1"
            textAlign={"center"}
            sx={{ width: "100%", fontSize: "1.5rem" }}
          >
            {loadingDispositivo
              ? "Carregando dispositivo biométrico..."
              : status}
          </Typography>
        )}
        <Stack direction={"row"} justifyContent={"center"}>
          <Fingerprint
            sx={{
              fontSize: "4rem",
              mt: "1.5rem",
              mb: "1.5rem",
              color: iconStatus === "error" ? red[500] : undefined,
            }}
            color={iconStatus === "success" ? "success" : undefined}
          />
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
