import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import MenuIcon from '@mui/icons-material/Menu';
import MessageIcon from '@mui/icons-material/Message';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Avatar, ListItemButton, ListItemIcon, ListItemText, Tooltip, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import StoriesIcon from './StoriesIcon';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { add, differenceInCalendarDays } from 'date-fns';
import NewspaperIcon from '@mui/icons-material/Newspaper';

function Copyright() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://desenvolvedordeaplicativos.com.br/">
          Desenvolvedor de aplicativos
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#128C7E',
      dark: '#075E54',
      light: '#25D366',
      contrastText: "#FFF"
    }
  }
});

const mdThemeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#128C7E',
      dark: '#075E54',
      light: '#25D366',
      contrastText: "#FFF"
    }
  }
});

interface DrawerComponent {
  title?: string;
  children?: React.ReactNode;
}

function DrawerComponent({ title, children }: DrawerComponent) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState('light');
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const userInfo = localStorage.getItem("@user-info")
    if (userInfo !== null) {
      setUser(JSON.parse(userInfo))
    }
    if (localStorage.getItem("@dark-theme") !== null) {
      const selectedTheme = localStorage.getItem("@dark-theme")
      console.log("Entrei aqui", selectedTheme)
      setMode(selectedTheme)
    } else {
      localStorage.setItem("@dark-theme", prefersDarkMode ? 'dark' : 'light')
      setMode(prefersDarkMode ? 'dark' : 'light')
    }
  }, [])

  const handleNavigate = (text) => {
    return navigate(text)
  }

  return (
    <ThemeProvider theme={mode === 'light' ? mdTheme : mdThemeDark}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >

            <Tooltip title="Expandir Menu">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
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
            {
              differenceInCalendarDays(add(new Date(user?.paymentDate), { months: user?.selectedPlan }), Date.now()) < 15 && (
                <Typography>
                  Licença expira em {differenceInCalendarDays(add(new Date(user?.paymentDate), { months: user?.selectedPlan }), Date.now())} dias
                </Typography>
              )
            }
            <Tooltip title="Definir Modo Escuro/Claro">
              <IconButton sx={{ ml: 1 }} onClick={() => {
                setMode(mode === "dark" ? 'light' : 'dark')
                localStorage.setItem("@dark-theme", mode === "dark" ? 'light' : 'dark')
              }} color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {false && (
              <Tooltip title="Perfil">
                <IconButton onClick={() => handleNavigate("/perfil")}>
                  <Avatar alt="Filipe" src="https://github.com/filipeleonelbatista.png" />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: "flex-start", width: "100%", pl: 2 }}>
              <WhatsAppIcon />
              <Typography>
                WP Sender Bot
              </Typography>
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
              <ListItemButton selected={location.pathname === "/envio-mensagens"} onClick={() => handleNavigate("/envio-mensagens")}>
                <ListItemIcon>
                  <MarkUnreadChatAltIcon />
                </ListItemIcon>
                <ListItemText primary="Envio de mensagens" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Modelos de mensagens">
              <ListItemButton selected={location.pathname === "/modelos-de-mensagem"} onClick={() => handleNavigate("/modelos-de-mensagem")}>
                <ListItemIcon>
                  <MessageIcon />
                </ListItemIcon>
                <ListItemText primary="Modelos" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Listas de envio">
              <ListItemButton selected={location.pathname === "/listas-de-contatos"} onClick={() => handleNavigate("/listas-de-contatos")}>
                <ListItemIcon>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Listas de envios" />
              </ListItemButton>
            </Tooltip>
            {false && (
              <>
                <Tooltip placement="right" title="Perfil">
                  <ListItemButton selected={location.pathname === "/perfil"} onClick={() => handleNavigate("/perfil")}>
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Perfil" />
                  </ListItemButton>
                </Tooltip>
                <Divider sx={{ my: 1 }} />
              </>
            )}
            <Divider sx={{ my: 1 }} />
            <Tooltip placement="right" title="Blog">
              <ListItemButton selected={location.pathname === "/blog"} onClick={() => handleNavigate("/blog")}>
                <ListItemIcon>
                  <NewspaperIcon />
                </ListItemIcon>
                <ListItemText primary="Blog" />
              </ListItemButton>
            </Tooltip>
            <Divider sx={{ my: 1 }} />
            <Tooltip placement="right" title="Configurações">
              <ListItemButton selected={location.pathname === "/configuracoes"} onClick={() => handleNavigate("/configuracoes")}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Histórico de envios">
              <ListItemButton selected={location.pathname === "/historico-de-envios"} onClick={() => handleNavigate("/historico-de-envios")}>
                <ListItemIcon>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Histórico de envios" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Sair">
              <ListItemButton selected={location.pathname === "/"} onClick={() => {
                localStorage.removeItem("@user-info")
                handleNavigate("/")
              }}>
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
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                w: '100%', borderRadius: 2, p: 4, backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
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
    </ThemeProvider>
  );
}

export default DrawerComponent;
