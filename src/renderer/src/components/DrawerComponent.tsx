import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import LogoutIcon from '@mui/icons-material/Logout'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt'
import MenuIcon from '@mui/icons-material/Menu'
import MessageIcon from '@mui/icons-material/Message'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
  Avatar,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Tooltip
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useCurrentTheme } from '@renderer/hooks/useCurrentTheme'
import { add, differenceInCalendarDays } from 'date-fns'
import * as React from 'react'
import { BiBot } from 'react-icons/bi'
import { BsCloudDownload } from 'react-icons/bs'
import { useLocation, useNavigate } from 'react-router-dom'
import { VERSION } from '../constants/application'
import { api, getVersions } from '../services/api'
import IAComponent from './IAComponent'

function Copyright(): JSX.Element {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://filipeleonelbatista.vercel.app/" target="_blank">
          Desenvolvedor de aplicativos
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  )
}

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

interface DrawerComponent {
  title?: string
  children?: React.ReactNode
}

function DrawerComponent({ title, children }: DrawerComponent): JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleMode } = useCurrentTheme()

  const currentVersion = VERSION

  const [user, setUser] = React.useState()

  const [open, setOpen] = React.useState(false)
  const [modalUpdate, setModalUpdate] = React.useState(false)
  const [updateInfo, setUpdateInfo] = React.useState(null)

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: (theme) =>
      theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    border: 'none',
    borderRadius: 4,
    boxShadow: 24,
    p: 4
  }

  const toggleDrawer = (): void => {
    setOpen(!open)
  }

  const handleOpenModalUpdate = async (): Promise<void> => {
    setModalUpdate(true)
  }

  const checkVersion = async (): Promise<void> => {
    const response = (await api.post('', getVersions)) as object

    const applicationVersionIndex = response.data.data.applicationVersions.findIndex(
      (version: object): boolean => {
        return version.versionNumber === currentVersion
      }
    )

    if (applicationVersionIndex > 0) {
      setUpdateInfo(response.data.data.applicationVersions[0])
    }
  }

  const [anchorAi, setAnchorAi] = React.useState(null)

  const openAiMenu = Boolean(anchorAi)

  const handleClick = (event: object): void => {
    setAnchorAi(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorAi(null)
  }

  React.useEffect(() => {
    const userInfo = localStorage.getItem('@user-info')
    if (userInfo !== null) {
      setUser(JSON.parse(userInfo))
    }
    checkVersion()
  }, [])

  const handleNavigate = (text: string): void => {
    return navigate(text)
  }

  return (
    <>
      <Modal
        open={modalUpdate}
        onClose={(): void => setModalUpdate(false)}
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
              '& > img': {
                width: '100%',
                heigth: 'auto',
                borderRadius: 2,
                boxShadow: 2
              }
            }}
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: updateInfo?.infos?.html
            }}
          ></Typography>
          <Button
            variant={'contained'}
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
      <Box sx={{ display: 'flex' }}>
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px'
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
                  ...(open && { display: 'none' })
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {differenceInCalendarDays(
              add(new Date(user?.paymentDate), { months: user?.selectedPlan }),
              Date.now()
            ) < 15 && (
              <Typography sx={{ mx: 2 }}>
                Licença expira em{' '}
                {differenceInCalendarDays(
                  add(new Date(user?.paymentDate), { months: user?.selectedPlan }),
                  Date.now()
                )}{' '}
                dias
              </Typography>
            )}

            <Tooltip title="Iniciar conversa com IA">
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
                'aria-labelledby': 'ai-button'
              }}
            >
              <IAComponent />
            </Menu>

            <Typography variant="caption">Ver. {currentVersion}</Typography>
            <Tooltip title="Definir Modo Escuro/Claro">
              <IconButton
                sx={{ ml: 1 }}
                onClick={(): void => {
                  toggleMode()
                  localStorage.setItem('@dark-theme', mode === 'dark' ? 'light' : 'dark')
                }}
                color="inherit"
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {!!updateInfo && (
              <Tooltip title="Nova versão disponível">
                <IconButton sx={{ mx: 2 }} onClick={handleOpenModalUpdate} color="inherit">
                  <BsCloudDownload />
                </IconButton>
              </Tooltip>
            )}
            {false && (
              <Tooltip title="Perfil">
                <IconButton sx={{ mx: 2 }} onClick={(): void => handleNavigate('/perfil')}>
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
              px: [1]
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'flex-start',
                width: '100%',
                pl: 2
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
                selected={location.pathname === '/envio-mensagens'}
                onClick={(): void => handleNavigate('/envio-mensagens')}
              >
                <ListItemIcon>
                  <MarkUnreadChatAltIcon />
                </ListItemIcon>
                <ListItemText primary="Envio de mensagens" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Modelos de mensagens">
              <ListItemButton
                selected={location.pathname === '/modelos-de-mensagem'}
                onClick={(): void => handleNavigate('/modelos-de-mensagem')}
              >
                <ListItemIcon>
                  <MessageIcon />
                </ListItemIcon>
                <ListItemText primary="Modelos" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Listas de envio">
              <ListItemButton
                selected={location.pathname === '/listas-de-contatos'}
                onClick={(): void => handleNavigate('/listas-de-contatos')}
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
                    selected={location.pathname === '/perfil'}
                    onClick={(): void => handleNavigate('/perfil')}
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
                    selected={location.pathname === '/blog'}
                    onClick={(): void => handleNavigate('/blog')}
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
                selected={location.pathname === '/configuracoes'}
                onClick={(): void => handleNavigate('/configuracoes')}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Histórico de envios">
              <ListItemButton
                selected={location.pathname === '/historico-de-envios'}
                onClick={(): void => handleNavigate('/historico-de-envios')}
              >
                <ListItemIcon>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Histórico de envios" />
              </ListItemButton>
            </Tooltip>
            <Tooltip placement="right" title="Sair">
              <ListItemButton
                selected={location.pathname === '/'}
                onClick={(): void => {
                  if (window.confirm('Deseja realmente sair do sistema?')) {
                    localStorage.removeItem('@user-info')
                    handleNavigate('/')
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
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto'
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                w: '100%',
                borderRadius: 2,
                p: 4,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light' ? '#FFF' : theme.palette.grey[800]
              }}
            >
              {children}
            </Box>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </>
  )
}

export default DrawerComponent
