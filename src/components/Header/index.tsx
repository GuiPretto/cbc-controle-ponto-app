import {
  AppBar,
  Box,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountMenu from "./AccountMenu";
import DrawerMenu from "./DrawerMenu";
import ColorModeIconDropdown from "../ColorModeIconDropdown";
import CbcLogo from "../../assets/logo-cbc.svg";

import { useState } from "react";

const Header = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <AppBar color="inherit" position="fixed" sx={{ boxShadow: "none" }}>
        <Toolbar
          sx={{
            backgroundColor: "inherit",
            mx: { xs: -0.75, sm: -1 },
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"1rem"}
          >
            <img src={CbcLogo} width={36} height={36} />
            <Typography fontSize={"1rem"} fontWeight={600} fontFamily={"Nexa"}>
              CBC - Sistema de Controle de Ponto
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction={"row"} spacing={1}>
            <ColorModeIconDropdown />
            <AccountMenu />
          </Stack>
        </Toolbar>
        <Divider />
      </AppBar>
      <DrawerMenu expanded={expanded} setExpanded={setExpanded} />
    </>
  );
};

export default Header;
