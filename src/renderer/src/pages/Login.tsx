import { Button, Card, Checkbox, FormControlLabel, FormGroup, TextField, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = React.useState('light');

  const handleSubmitForm = (formValues) => {

  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório!').label('Nome'),
      phone: Yup.string()
        .required('Whatsapp é obrigatório!')
        .label('WhatsApp')
        .min(14),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  React.useEffect(() => {
    if (localStorage.getItem("@user-info") !== null) {
      const userInfo = JSON.parse(localStorage.getItem("@user-info"))
      console.log(userInfo)
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
          <Box sx={{ mt: 8, display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'column' }}>
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
                id="message"
                name="message"
              />
              <TextField
                fullWidth
                label="Senha"
                id="message"
                name="message"
              />
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Lembrar de mim" />
              </FormGroup>
              <Button variant="contained" color="primary" onClick={() => navigate("/envio-mensagens")}>Entrar</Button>
              <Typography variant='caption' sx={{ w: '100%', textAlign: 'center' }} >
                Gostaria de ter acesso a aplicação?
              </Typography>
              <Button onClick={() => navigate("/cadastrar")}>Quero me cadastrar!</Button>
            </Card>
          </Box>
        </Box>
      </Box >
    </ThemeProvider >
  );
};
