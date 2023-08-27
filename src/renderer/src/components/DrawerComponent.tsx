import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Avatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  Modal,
  Button,
  Menu,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import StoriesIcon from "./StoriesIcon";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { add, differenceInCalendarDays } from "date-fns";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ContactsIcon from "@mui/icons-material/Contacts";
import { api, getVersions } from "../services/api";
import { BsCloudDownload } from "react-icons/bs";
import { BiBot } from "react-icons/bi";
import { VERSION } from "../constants/application";
import IAComponent from "./IAComponent";
import useCurrentTheme from "../hooks/useCurrentTheme";

function Copyright() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://desenvolvedordeaplicativos.com.br/">
          Desenvolvedor de aplicativos
        </Link>{" "}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface DrawerComponent {
  title?: string;
  children?: React.ReactNode;
}

function DrawerComponent({ title, children }: DrawerComponent) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, currentTheme } = useCurrentTheme();
  const currentVersion = VERSION;

  const [user, setUser] = React.useState();

  const [open, setOpen] = React.useState(false);
  const [modalUpdate, setModalUpdate] = React.useState(false);
  const [updateInfo, setUpdateInfo] = React.useState(null);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    border: "none",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenModalUpdate = async () => {
    setModalUpdate(true);
  };

  const checkVersion = async () => {
    const response = (await api.post("", getVersions)) as any;

    const applicationVersionIndex =
      response.data.data.applicationVersions.findIndex((version: any) => {
        return version.versionNumber === currentVersion;
      });

    if (applicationVersionIndex > 0) {
      setUpdateInfo(response.data.data.applicationVersions[0]);
    }
  };

  const [anchorAi, setAnchorAi] = React.useState(null);

  const openAiMenu = Boolean(anchorAi);

  const handleClick = (event) => {
    setAnchorAi(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorAi(null);
  };

  React.useEffect(() => {
    const userInfo = localStorage.getItem("@user-info");
    if (userInfo !== null) {
      setUser(JSON.parse(userInfo));
    }
    checkVersion();
  }, []);

  const handleNavigate = (text) => {
    return navigate(text);
  };

  return (
    <>
      <Modal
        open={modalUpdate}
        onClose={() => setModalUpdate(false)}
        aria-labelledby="modal-update-title"
        aria-describedby="modal-update-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Uma nova versão está disponível para baixar
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Veja as novidades
          </Typography>
          <Typography
            component="div"
            sx={{
              "& > img": {
                width: "100%",
                heigth: "auto",
                borderRadius: 2,
                boxShadow: 2,
              },
            }}
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: updateInfo?.infos?.html,
            }}
          ></Typography>
          <Button
            variant={"contained"}
            fullWidth
            startIcon={<BsCloudDownload />}
            target="_blank"
            component="a"
            href={updateInfo?.versionUrl}
          >
            Baixe já a nova versão
          </Button>
        </Box>
      </Modal>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <Tooltip title="Expandir Menu">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            {differenceInCalendarDays(
              add(new Date(user?.paymentDate), { months: user?.selectedPlan }),
              Date.now(),
            ) < 15 && (
              <Typography>
                Licença expira em{" "}
                {differenceInCalendarDays(
                  add(new Date(user?.paymentDate), {
                    months: user?.selectedPlan,
                  }),
                  Date.now(),
                )}{" "}
                dias
              </Typography>
            )}

            {/* <Tooltip title="Iniciar conversa com IA">
              <IconButton sx={{ mx: 2 }} onClick={handleClick} color="inherit">
                <BiBot />
              </IconButton>
            </Tooltip>

            <Menu
              id="ai-menu"
              anchorEl={anchorAi}
              open={openAiMenu}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'ai-button',
              }}
            >
              <IAComponent />
            </Menu> */}

            <Typography variant="caption">Ver. {currentVersion}</Typography>
            <Tooltip title="Definir Modo Escuro/Claro">
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  toggleTheme();
                }}
                color="inherit"
              >
                {currentTheme === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Tooltip>
            {!!updateInfo && (
              <Tooltip title="Nova versão disponível">
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={handleOpenModalUpdate}
                  color="inherit"
                >
                  <BsCloudDownload />
                </IconButton>
              </Tooltip>
            )}
            {false && (
              <Tooltip title="Perfil">
                <IconButton onClick={() => handleNavigate("/perfil")}>
                  <Avatar
                    alt="Filipe"
                    src="https://github.com/filipeleonelbatista.png"
                  />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "flex-start",
                width: "100%",
                pl: 2,
              }}
            >
              <WhatsAppIcon />
              <Typography>WP Sender Bot</Typography>
            </Box>
            <Tooltip title="Recolher Menu">
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Divider />
          <List component="nav">
            <Tooltip placement="right" title="Envio de mensagens">
              <ListItemButton
                selected={location.pathname === "/envio-mensagens"}
                onClick={() => handleNavigate("/envio-mensagens")}
              >
                <ListItemIcon>
                  <MarkUnreadChatAltIcon />
                </ListItemIcon>
                <ListItemText primary="Envio de mensagens" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Modelos de mensagens">
              <ListItemButton
                selected={location.pathname === "/modelos-de-mensagem"}
                onClick={() => handleNavigate("/modelos-de-mensagem")}
              >
                <ListItemIcon>
                  <MessageIcon />
                </ListItemIcon>
                <ListItemText primary="Modelos" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Listas de envio">
              <ListItemButton
                selected={location.pathname === "/listas-de-contatos"}
                onClick={() => handleNavigate("/listas-de-contatos")}
              >
                <ListItemIcon>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Listas de envios" />
              </ListItemButton>
            </Tooltip>
            {/* <Tooltip placement="right" title="Extrator de contatos">
              <ListItemButton selected={location.pathname === "/extrator"} onClick={() => handleNavigate("/extrator")}>
                <ListItemIcon>
                  <ContactsIcon />
                </ListItemIcon>
                <ListItemText primary="Extrator de contatoss" />
              </ListItemButton>
            </Tooltip> */}
            {false && (
              <>
                <Tooltip placement="right" title="Perfil">
                  <ListItemButton
                    selected={location.pathname === "/perfil"}
                    onClick={() => handleNavigate("/perfil")}
                  >
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Perfil" />
                  </ListItemButton>
                </Tooltip>
                <Divider sx={{ my: 1 }} />
              </>
            )}
            {user && user?.selectedPlan > 1 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Tooltip placement="right" title="Blog">
                  <ListItemButton
                    selected={location.pathname === "/blog"}
                    onClick={() => handleNavigate("/blog")}
                  >
                    <ListItemIcon>
                      <NewspaperIcon />
                    </ListItemIcon>
                    <ListItemText primary="Blog" />
                  </ListItemButton>
                </Tooltip>
              </>
            )}
            <Divider sx={{ my: 1 }} />
            <Tooltip placement="right" title="Configurações">
              <ListItemButton
                selected={location.pathname === "/configuracoes"}
                onClick={() => handleNavigate("/configuracoes")}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Histórico de envios">
              <ListItemButton
                selected={location.pathname === "/historico-de-envios"}
                onClick={() => handleNavigate("/historico-de-envios")}
              >
                <ListItemIcon>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Histórico de envios" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Sair">
              <ListItemButton
                selected={location.pathname === "/"}
                onClick={() => {
                  if (window.confirm("Deseja realmente sair do sistema?")) {
                    localStorage.removeItem("@user-info");
                    handleNavigate("/");
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </Tooltip>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                w: "100%",
                borderRadius: 2,
                p: 4,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#FFF"
                    : theme.palette.grey[800],
              }}
            >
              {children}
            </Box>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default DrawerComponent;
