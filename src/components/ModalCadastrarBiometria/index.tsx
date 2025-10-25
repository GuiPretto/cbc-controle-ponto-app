import { Button, Modal, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ArrowBack, Fingerprint } from "@mui/icons-material";
import { useRegisterBiometria } from "src/hooks/useBiometria";
import { useSnackbar } from "src/hooks/useSnackbar";
import { RegisterBiometriaDto } from "electron/services/BiometriaService";

interface ModalCadastrarBiometriaProps {
  idUsuario: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const sxBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  height: "300px",
  backgroundColor: "background.paper",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ModalCadastrarBiometria = ({
  idUsuario,
  open,
  setOpen,
}: ModalCadastrarBiometriaProps) => {
  // TODO: Remover quando for para produção
  const firstUpdate = useRef(true);
  const { showSnackbar } = useSnackbar();
  const [status, setStatus] = useState("Parado");
  const [loadingDispositivo, setLoadingDispositivo] = useState(false);
  const { mutate: registrarMutate } = useRegisterBiometria();
  const isProcessandoRef = useRef(false);

  const handleRegistrar = (template: string) => {
    if (isProcessandoRef.current) return;
    isProcessandoRef.current = true;
    registrarMutate(
      { idUsuario, template },
      {
        onSuccess: () => {
          isProcessandoRef.current = false;
          setOpen(false);
        },
        onError: (err) => {
          isProcessandoRef.current = false;
          showSnackbar(
            err.message === "Error" ? "Sistema fora do ar" : err.message,
            "error"
          );
        },
      }
    );
  };

  const onData = (data: unknown) => {
    if (typeof data === "object" && !isProcessandoRef.current) {
      const dataTipada = data as RegisterBiometriaDto;
      handleRegistrar(dataTipada.template);
    }
  };

  useEffect(() => {
    // TODO: Remover quando for para produção
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
    <Modal open={open} onClose={() => !loadingDispositivo && setOpen(false)}>
      <Stack sx={sxBox}>
        <Typography
          component="h1"
          textAlign={"center"}
          sx={{ width: "100%", fontSize: "1.5rem" }}
        >
          {loadingDispositivo ? "Carregando dispositivo biométrico..." : status}
        </Typography>
        <Stack direction={"row"} justifyContent={"center"}>
          <Fingerprint sx={{ fontSize: "6rem", mt: "1.5rem", mb: "1.5rem" }} />
        </Stack>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => setOpen(false)}
        >
          Voltar
        </Button>
      </Stack>
    </Modal>
  );
};

export default ModalCadastrarBiometria;
