import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  Group,
  PersonAdd,
  CalendarMonth,
  EditCalendar,
} from "@mui/icons-material";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

const DrawerMenu = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  const NavItem = ({
    to,
    text,
    icon: Icon,
  }: {
    to: string;
    text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
  }) => {
    const { pathname } = useLocation();
    return (
      <ListItem>
        <ListItemButton
          selected={!!matchPath(to, pathname)}
          component={NavLink}
          to={to}
          onClick={() => setExpanded(false)}
        >
          {Icon && (
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
          )}
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <>
      <Drawer
        open={expanded}
        variant="permanent"
        onClose={() => setExpanded(false)}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            bgcolor: "background.paper",
            boxSizing: "border-box",
            top: "calc(4rem + 1px)",
            height: "calc(100vh - 5rem - 2px)",
          },
        }}
      >
        <nav>
          <List dense>
            <ListSubheader
              sx={{
                bgcolor: "background.paper",
              }}
            >
              Funcionário
            </ListSubheader>
            <NavItem
              to="/visualizar-batidas"
              text="Visualizar batidas"
              icon={CalendarMonth}
            />
            <NavItem
              to="/registrar-justificativa"
              text="Registrar justificativa"
              icon={EditCalendar}
            />
          </List>
          <List dense>
            <ListSubheader
              sx={{
                bgcolor: "background.paper",
              }}
            >
              Gestão
            </ListSubheader>
            <NavItem
              to="/listar-funcionarios"
              text="Listar funcionários"
              icon={Group}
            />
            <NavItem
              to="/cadastrar-funcionario"
              text="Cadastrar funcionário"
              icon={PersonAdd}
            />
          </List>
        </nav>
      </Drawer>
    </>
  );
};

export default DrawerMenu;
