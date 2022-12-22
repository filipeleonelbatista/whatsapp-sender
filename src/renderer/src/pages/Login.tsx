import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, Card, Checkbox, CircularProgress, circularProgressClasses, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { api, filterAssinantesByEmail } from '../services/api';

export default function Login() {
  const [selectedUser, setSelectedUser] = React.useState();
  const [waitingActivation, setWaitingActivation] = React.useState(false);
  const [isLoading, setisLoading] = React.useState(false);
  const navigate = useNavigate();

  const [mode, setMode] = React.useState('light');

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleInformPayment = async () => {
    const message = `Olá sou ${selectedUser.nome}, e gostaria de informar o pagamento do WPSender para o email ${selectedUser.email} com o plano ${selectedUser.selectedPlan === 1 ? 'Mensal R$ 10,00' : selectedUser.selectedPlan === 2 ? 'Semestral de R$ 60,00 por R$ 50,00' : selectedUser.selectedPlan === 3 ? 'Anual de R$ 120,00 por R$ 100,00' : ''}`

    window.open(`https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(message)}&amp;text&amp;type=phone_number&amp;app_absent=0`, "_blank")
  }

  const handleSubmitForm = async (formValues) => {
    try {
      setisLoading(true)
      const filterAssinantesByEmailObject = filterAssinantesByEmail(formValues.email)
      const result = await api.post("", filterAssinantesByEmailObject)

      if (result.data.data.assinantes.length === 0) {
        alert("Usuário não encontrado.");
        return;
      }
      if (result.data.data.assinantes[0].senha === formValues.senha) {
        if (result.data.data.assinantes[0].isActive) {
          if (formValues.remember) {
            localStorage.setItem("@user-info", JSON.stringify(result.data.data.assinantes[0]))
          }
          navigate('/envio-mensagens')
        } else {
          alert("Seu acesso não está ativo ainda.")
          setWaitingActivation(true)
          setSelectedUser(result.data.data.assinantes[0])
        }
      } else {
        alert("Usuário ou senha incorretos!")
        return;
      }
      console.log()

    } catch (error) {

    }
    finally {
      setisLoading(false)
    }
  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().required('Email é obrigatório!').label('Email'),
      senha: Yup.string()
        .required('Senha é obrigatório!')
        .label('Senha')
        .min(8, "A Senha precisa ter pelo menos 8 caracteres")
        .max(16, "A Senha precisa ter menos de 16 caracteres"),
      remember: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      senha: '',
      remember: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  React.useEffect(() => {
    const userInfo = localStorage.getItem("@user-info")
    if (userInfo !== null) {
      const user = JSON.parse(userInfo)
      handleSubmitForm({ email: user.email, senha: user.senha, remember: true })
    }
  }, [])


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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

  React.useEffect(() => {
    const selectedTheme = localStorage.getItem("@dark-theme")

    if (selectedTheme !== null) {
      setMode(selectedTheme)
    } else {
      localStorage.setItem("@dark-theme", prefersDarkMode ? 'dark' : 'light')
      setMode(prefersDarkMode ? 'dark' : 'light')
    }
  }, [])

  return (
    <ThemeProvider theme={mode === 'light' ? mdTheme : mdThemeDark}>
      {
        isLoading && (
          <Box sx={{
            position: 'absolute',
            width: "100vw",
            height: '100vh',
            zIndex: 10000,
            backgroundColor: "#00000064",
            overflow: "hidden",
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center"
          }}>
            <CircularProgress
              variant="indeterminate"
              disableShrink
              color='primary'
              sx={{
                animationDuration: '550ms',
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'round',
                },
              }}
              size={50}
              thickness={6}
            />
          </Box>
        )
      }
      <Box sx={{
        m: 0,
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}>
        <Box sx={{ zIndex: 1, position: 'absolute', top: 0, width: '100%', height: '15rem', backgroundColor: mode === 'light' ? mdTheme.palette.primary.main : mdThemeDark.palette.primary.main }}></Box>
        <Box sx={{ zIndex: 10, position: 'absolute', top: 0, width: '100%' }}>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 8, display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'column' }}>
            <Typography variant='h4' sx={{ mb: 2 }}>
              <FaWhatsapp color="25d366" />
              <span style={{ color: '#25d366' }}><b>WhatsApp</b></span>
              <span style={{ color: '#f9f9f9' }}><b>Sender</b></span>
            </Typography>
            <Card sx={{ p: 2, maxWidth: 400, width: '100%', display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Typography variant='body1' sx={{ w: '100%', textAlign: 'center' }} >
                Bem vindo novamente
              </Typography>
              <Typography variant='body2' sx={{ w: '100%', textAlign: 'center' }} >
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
              <Button type='submit' variant="contained" color="primary">Entrar</Button>
              <Typography variant='caption' sx={{ w: '100%', textAlign: 'center' }} >
                Gostaria de ter acesso a aplicação?
              </Typography>
              <Button type="button" onClick={() => navigate("/cadastrar")}>Quero me cadastrar!</Button>
              {
                waitingActivation && (
                  <>
                    <Typography variant='caption' sx={{ w: '100%', textAlign: 'center' }} >
                      Já possui cadastro e efetuou o pagamento?
                    </Typography>
                    <Button type="button" onClick={handleInformPayment}>Solicitar ativação</Button>
                  </>
                )
              }
            </Card>
          </Box>
        </Box>
      </Box >
    </ThemeProvider >
  );
};
