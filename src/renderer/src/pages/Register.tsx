import { Button, Card, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState('light');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const handleSubmitForm = (formValues) => {

  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().required('Email é obrigatório!').label('Email'),
      password: Yup.string().required('Senha é obrigatório!').label('Senha').min(8).max(16),
      confirm_password: Yup.string().required('Senha é obrigatório!').label('Senha').min(8).max(16),
      accept_terms: Yup.boolean().required('É necessário aceitar os termos e condições!'),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      confirm_password: '',
      accept_terms: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

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
            <Typography variant='h4' sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <FaWhatsapp color="#25d366" />
              <span style={{ color: '#25d366' }}><b>WhatsApp</b></span>
              <span style={{ color: '#f9f9f9' }}><b>Sender</b></span>
            </Typography>
            <Card sx={{ p: 2, mb: 8, maxWidth: 400, width: '100%', display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Typography variant='body1' sx={{ w: '100%', textAlign: 'center' }} >
                Que bom que você tem interesse
              </Typography>
              <Typography variant='body2' sx={{ w: '100%', textAlign: 'center' }} >
                Para continuar basta realizar o cadastro e efetuar o pagamento. Em seguida basta informar o pagamento clicando no botão a baixo.
              </Typography>
              <TextField
                fullWidth
                label="Email"
                id="message"
                name="message"
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Senha</InputLabel>
                <OutlinedInput
                  id="password"
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
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="confirm-password">Confirmar Senha</InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmar Senha"
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Plano</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Planos"
                >
                  <MenuItem value={0} disabled>Selecione um plano</MenuItem>
                  <MenuItem value={1}>Mensal R$ 10,00</MenuItem>
                  <MenuItem value={2}>Semestral R$ 60,00 - R$ 10,00 (Desconto)</MenuItem>
                  <MenuItem value={3}>Anual R$ 120,00 - R$ 20,00 (Desconto)</MenuItem>
                </Select>
                <FormHelperText>Selecione o plano que deseja pagar</FormHelperText>
              </FormControl>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label={<Typography>Aceito os <a href="https://desenvolvedordeaplicativos.com.br/termos-e-condicoes" target="_blank" >Termos e Condições de serviço</a></Typography>} />
              </FormGroup>
              <Button variant="contained" color="primary">Solicitar codigo Pix</Button>
              <Typography variant='caption' sx={{ w: '100%', textAlign: 'center' }} >
                Já tem login?
              </Typography>
              <Button onClick={() => navigate("/")}>Entrar no sistema!</Button>
            </Card>
          </Box>
        </Box>
      </Box >
    </ThemeProvider >
  );
};
