import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  circularProgressClasses,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Box } from '@mui/system'
import { add, differenceInCalendarDays } from 'date-fns'
import { useFormik } from 'formik'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router'
import * as Yup from 'yup'
import { api, filterAssinantesByEmail } from '../services/api'

export default function Login(): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const [QrCode, setQrCode] = React.useState('')
  const [plan, setPlan] = React.useState(0)
  const [licenseExpiration, setLicenseExpiration] = React.useState(false)

  const handleInformPaymentReactivation = async (): Promise<void> => {
    const message = `Olá gostaria de informar o pagamento do WPSender para o email ${
      formik.values.email
    } com o plano ${
      plan === 0
        ? 'Primeiro mês por R$ 10,00'
        : plan === 1
        ? 'Mensal R$ 19,90'
        : plan === 6
        ? 'Semestral de R$ 119,40 por R$ 79,90'
        : plan === 12
        ? 'Anual de R$ 238,80 por R$159,90'
        : ''
    }`

    window.open(
      `https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(
        message
      )}&amp;text&amp;type=phone_number&amp;app_absent=0`,
      '_blank'
    )
    setOpen(false)
    setQrCode('')
  }

  const handleChangeQrCode = async (event: object): Promise<void> => {
    if (event.target.value === 0) {
      setQrCode(
        '00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540520.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062250521eN2bHtVplcyggdJ13l5he6304D991'
      )
    } else if (event.target.value === 1) {
      setQrCode(
        '00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540519.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062210517WhatsappSenderApp6304573D'
      )
    } else if (event.target.value === 6) {
      setQrCode(
        '00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540579.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062240520WhatsappSender6meses63048645'
      )
    } else if (event.target.value === 12) {
      setQrCode(
        '00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b5204000053039865406159.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062250521WhatsappSender12meses6304860D'
      )
    }
    setPlan(Number(event.target.value))
  }

  const [selectedUser, setSelectedUser] = React.useState()
  const [waitingActivation, setWaitingActivation] = React.useState(false)
  const [isLoading, setisLoading] = React.useState(false)
  const navigate = useNavigate()

  const [mode, setMode] = React.useState('light')

  const [showPassword, setShowPassword] = React.useState(false)
  const handleClickShowPassword = (): void => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
  }

  const handleInformPayment = async (): Promise<void> => {
    const message = `Olá sou ${
      formik.values.name
    }, e gostaria de informar o pagamento do WPSender para o email ${
      formik.values.email
    } com o plano ${
      selectedUser.selectedPlan === 0
        ? 'Primeiro mês por R$ 10,00'
        : selectedUser.selectedPlan === 1
        ? 'Mensal R$ 19,90'
        : selectedUser.selectedPlan === 6
        ? 'Semestral de R$ 119,40 por R$ 79,90'
        : selectedUser.selectedPlan === 12
        ? 'Anual de R$ 238,80 por R$159,90'
        : ''
    }`

    window.open(
      `https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(
        message
      )}&amp;text&amp;type=phone_number&amp;app_absent=0`,
      '_blank'
    )
  }

  const handleSubmitForm = async (formValues: object): Promise<void> => {
    try {
      setisLoading(true)
      const filterAssinantesByEmailObject = filterAssinantesByEmail(formValues.email)
      const result = await api.post('', filterAssinantesByEmailObject)

      if (result.data.data.assinantes.length === 0) {
        alert('Usuário não encontrado.')
        return
      }
      if (result.data.data.assinantes[0].senha === formValues.senha) {
        if (
          differenceInCalendarDays(
            add(new Date(result.data.data.assinantes[0].paymentDate), {
              months: result.data.data.assinantes[0].selectedPlan
            }),
            Date.now()
          ) < 1
        ) {
          alert('Sua licença expirou. adiquira uma nova licença e continue usando o aplicativo')
          setLicenseExpiration(true)
          return
        } else {
          if (result.data.data.assinantes[0].isActive) {
            localStorage.setItem('@remember', formValues.remember)
            localStorage.setItem('@user-info', JSON.stringify(result.data.data.assinantes[0]))

            localStorage.getItem('@show-onboarding') === null
              ? navigate('/onboarding')
              : navigate('/envio-mensagens')
          } else {
            alert('Seu acesso não está ativo ainda.')
            setWaitingActivation(true)
            setSelectedUser(result.data.data.assinantes[0])
          }
        }
      } else {
        alert('Usuário ou senha incorretos!')
        return
      }
      console.log()
    } catch (error) {
      console.log('erro', error)
    } finally {
      setisLoading(false)
    }
  }

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().required('Email é obrigatório!').label('Email'),
      senha: Yup.string()
        .required('Senha é obrigatório!')
        .label('Senha')
        .min(8, 'A Senha precisa ter pelo menos 8 caracteres')
        .max(16, 'A Senha precisa ter menos de 16 caracteres'),
      remember: Yup.boolean()
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      senha: '',
      remember: false
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values)
    }
  })

  React.useEffect(() => {
    const userInfo = localStorage.getItem('@user-info')
    const rememberInfo = localStorage.getItem('@remember')
    if (userInfo !== null) {
      if (rememberInfo !== null) {
        if (rememberInfo === 'true') {
          const user = JSON.parse(userInfo)
          handleSubmitForm({ email: user.email, senha: user.senha, remember: true })
        }
      }
    }
  }, [])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const mdTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#128C7E',
        dark: '#075E54',
        light: '#25D366',
        contrastText: '#FFF'
      }
    }
  })

  const mdThemeDark = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#128C7E',
        dark: '#075E54',
        light: '#25D366',
        contrastText: '#FFF'
      }
    }
  })

  React.useEffect(() => {
    const selectedTheme = localStorage.getItem('@dark-theme')

    if (selectedTheme !== null) {
      setMode(selectedTheme)
    } else {
      localStorage.setItem('@dark-theme', prefersDarkMode ? 'dark' : 'light')
      setMode(prefersDarkMode ? 'dark' : 'light')
    }
  }, [])

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

  return (
    <ThemeProvider theme={mode === 'light' ? mdTheme : mdThemeDark}>
      <Modal
        open={open}
        onClose={(): void => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selecione o plano que deseja
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="plans-label">Plano</InputLabel>
            <Select
              labelId="plans-label"
              label="Planos"
              id="plan"
              name="plan"
              value={plan}
              onChange={handleChangeQrCode}
            >
              <MenuItem disabled>Selecione um plano</MenuItem>
              <MenuItem value={1}>Mensal R$ 19,90</MenuItem>
              <MenuItem value={6}>
                Semestral
                <sub style={{ margin: '0 8px' }}>
                  de <s>R$ 119,40</s> por
                </sub>
                R$ 79,90
              </MenuItem>
              <MenuItem value={12}>
                Anual
                <sub style={{ margin: '0 8px' }}>
                  de <s>R$ 238,80</s> por
                </sub>
                R$ 159,90
              </MenuItem>
            </Select>
            <FormHelperText>Selecione o plano que deseja pagar.</FormHelperText>
          </FormControl>

          {plan > 0 && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Efetue o pagamento
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Faça o pagamento via Pix Usando o QrCode a baixo.
              </Typography>
              <Box sx={{ height: 'auto', width: '100%', mt: 2, mb: 2 }}>
                <QRCode
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  value={QrCode}
                />
              </Box>

              <Button
                fullWidth
                onClick={handleInformPaymentReactivation}
                variant="contained"
                color="primary"
              >
                Informar o pagamento
              </Button>
            </>
          )}
        </Box>
      </Modal>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            backgroundColor: '#00000064',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress
            variant="indeterminate"
            disableShrink
            color="primary"
            sx={{
              animationDuration: '550ms',
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round'
              }
            }}
            size={50}
            thickness={6}
          />
        </Box>
      )}
      <Box
        sx={{
          m: 0,
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '15rem',
            backgroundColor:
              mode === 'light' ? mdTheme.palette.primary.main : mdThemeDark.palette.primary.main
          }}
        ></Box>
        <Box sx={{ zIndex: 10, position: 'absolute', top: 0, width: '100%' }}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 8, display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'column' }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              <FaWhatsapp color="25d366" />
              <span style={{ color: '#25d366' }}>
                <b>WhatsApp</b>
              </span>
              <span style={{ color: '#f9f9f9' }}>
                <b>Sender</b>
              </span>
            </Typography>
            <Card
              sx={{
                p: 2,
                maxWidth: 400,
                width: '100%',
                display: 'flex',
                gap: 2,
                flexDirection: 'column'
              }}
            >
              <Typography variant="body1" sx={{ w: '100%', textAlign: 'center' }}>
                Bem vindo novamente
              </Typography>
              <Typography variant="body2" sx={{ w: '100%', textAlign: 'center' }}>
                Digite seu email e senha para entrar no sistema
              </Typography>

              <TextField
                fullWidth
                label="Email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={!!formik.errors.email}
                helperText={formik.errors.email}
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="senha">Senha</InputLabel>
                <OutlinedInput
                  id="senha"
                  name="senha"
                  value={formik.values.senha}
                  onChange={formik.handleChange}
                  error={!!formik.errors.senha}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Senha"
                />
                <FormHelperText>{formik.errors.senha}</FormHelperText>
              </FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={formik.values.remember}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Lembrar de mim"
                />
              </FormGroup>
              <Button type="submit" variant="contained" color="primary">
                Entrar
              </Button>
              <Typography variant="caption" sx={{ w: '100%', textAlign: 'center' }}>
                Gostaria de ter acesso a aplicação?
              </Typography>
              <Button type="button" onClick={(): void => navigate('/cadastrar')}>
                Quero me cadastrar!
              </Button>
              {waitingActivation && (
                <>
                  <Typography variant="caption" sx={{ w: '100%', textAlign: 'center' }}>
                    Já possui cadastro e efetuou o pagamento?
                  </Typography>
                  <Button type="button" variant="contained" onClick={handleInformPayment}>
                    Solicitar ativação
                  </Button>
                </>
              )}
              {licenseExpiration && (
                <>
                  <Typography variant="caption" sx={{ w: '100%', textAlign: 'center' }}>
                    Faça sua renovação clicando no botão abaixo
                  </Typography>
                  <Button type="button" variant="contained" onClick={(): void => setOpen(true)}>
                    Quero renovar
                  </Button>
                </>
              )}
            </Card>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
