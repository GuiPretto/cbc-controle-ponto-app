import { Box, Divider, Typography } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Box
        component={"footer"}
        sx={{
          bgcolor: "background.paper",
          position: "fixed",
          width: "100%",
          height: "1rem",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Divider sx={{ position: "fixed", width: "100%", bottom: "1rem" }} />
        <Typography color="inherit" align="center" fontSize={".625rem"}>
          © 2025 CBC - CONSTRUTORA BATISTA CAVALCANTE LTDA. Todos os direitos
          reservados. | Desenvolvido por GC Inovações LTDA | v1.0.0
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
