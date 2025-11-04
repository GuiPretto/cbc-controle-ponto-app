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
import { useAuth } from "src/hooks/useAuth";

const DrawerMenu = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  const { role } = useAuth();
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
          {["ADMIN", "MASTER"].includes(role) && (
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
              <NavItem
                to="/listar-grades"
                text="Listar grades"
                icon={CalendarMonth}
              />
              <NavItem
                to="/cadastrar-grade"
                text="Cadastrar grade"
                icon={EditCalendar}
              />
            </List>
          )}
          {["ADMIN", "USER"].includes(role) && (
            <List dense>
              <ListSubheader
                sx={{
                  bgcolor: "background.paper",
                }}
              >
                Funcionário
              </ListSubheader>
              <NavItem
                to="/visualizar-frequencia"
                text="Visualizar frequência"
                icon={CalendarMonth}
              />
              <NavItem
                to="/registrar-justificativa"
                text="Registrar justificativa"
                icon={EditCalendar}
              />
            </List>
          )}
        </nav>
      </Drawer>
    </>
  );
};

export default DrawerMenu;
