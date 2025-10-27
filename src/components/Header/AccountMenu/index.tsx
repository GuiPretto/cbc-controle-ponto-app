import { AccountCircle, Logout } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import ModalPerfilUsuario from "src/components/ModalPerfilUsuario";
import { useAuth } from "src/hooks/useAuth";

const AccountMenu = () => {
  const { logout: authLogout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSair = async () => {
    try {
      await authLogout();
    } catch (err) {
      console.error("Login IPC error:", err);
    }
  };

  const handlePerfil = () => {
    handleClose();
    setModalPerfilOpen(true);
  };

  return (
    <>
      <IconButton
        id="menu-appbar"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        size="small"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handlePerfil}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSair}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
      <ModalPerfilUsuario open={modalPerfilOpen} setOpen={setModalPerfilOpen} />
    </>
  );
};

export default AccountMenu;
