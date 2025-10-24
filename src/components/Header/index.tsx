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
          {/* <NavLink
            to={"/"}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          > */}
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"1rem"}
          >
            <img
              src="../../../public/logo-cbc-icon.png"
              width={36}
              height={36}
            />
            <Typography fontSize={"1rem"} fontWeight={600} fontFamily={"Nexa"}>
              CBC - Sistema de Controle de Ponto
            </Typography>
          </Stack>
          {/* </NavLink> */}
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
