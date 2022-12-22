import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, Card, Checkbox, CircularProgress, circularProgressClasses, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser'
import { api, createAssinante } from '../services/api';
import QRCode from 'react-qr-code';

export default function Register() {

  const [isLoading, setisLoading] = React.useState(false);
  const navigate = useNavigate();
  const [mode, setMode] = React.useState('light');
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [QrCode, setQrCode] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: (theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    border: 'none',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  const handleSubmitForm = async (formValues) => {
    if (!formValues.accept_terms) {
      alert("Para acessar é necessário aceitar os Termos e Condições do app!");
      return;
    }
    if (formValues.plan === 0) {
      alert("Você precisa definir o plano que deseja adiquirir!");
      return;
    }
    const data = {
      nome: formValues.name,
      email: formValues.email,
      senha: formValues.password,
      selected_plan: formValues.plan,
      request_access_date: new Date(Date.now()).toISOString(),
      payment_date: null,
      is_active: false
    }

    try {
      setisLoading(true)

      if (process.env.NODE_ENV === 'production') {
        emailjs.send('service_4o2awb7', 'template_uc48uh8', {
          ...data,
          plano: data.selected_plan === 1 ? 'Mensal R$ 10,00' : data.selected_plan === 2 ? 'Semestral de R$ 60,00 por R$ 50,00' : data.selected_plan === 3 ? 'Anual de R$ 120,00 por R$ 100,00' : '',

        }, 'user_y1zamkr7P7dPydkNhdhxi').then((res) => {
          console.log("Sucesso", res)
          // alert("Sua mensagem foi enviada com sucesso")
        }, (err) => {
          console.log("ERRO", err)
          // alert("Houve um erro ao enviar sua mensagem. Tente o contato pelo Whatsapp ou tente novamente mais tarde!")
        })
      }

      const { nome, email, senha, selected_plan, request_access_date, payment_date, is_active } = data;
      const mutationcreateAssinante = createAssinante(nome, email, senha, request_access_date, selected_plan, is_active, payment_date)
      await api.post('', mutationcreateAssinante)

      if (formValues.plan === 1) {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540510.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062160512NUbJF4xOYcz56304C81C')
      } else if (formValues.plan === 2) {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540550.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062070503***63041DE2')
      } else if (formValues.plan === 3) {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b5204000053039865406100.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062070503***630469E3')
      }

      setOpen(true)
    }
    catch (err) {
      console.log('ERROR DURING AXIOS REQUEST', err);
      setisLoading(false)

      if (err?.response?.data?.errors[0]?.message === 'value is not unique for the field "email"') {
        alert("Email ja cadastrado");
        return;
      } else {
        alert("Houve um problema ao enviar sua solicitação, tente novamente mais tarde!")
      }

    } finally {
      setisLoading(false)
    }
  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório!').label('Nome'),
      email: Yup.string().required('Email é obrigatório!').label('Email'),
      password: Yup.string()
        .required('Senha é obrigatório!')
        .label('Senha')
        .min(8, "A Senha precisa ter pelo menos 8 caracteres")
        .max(16, "A Senha precisa ter menos de 16 caracteres"),
      confirm_password: Yup.string().when('password', {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          'O campo Confirmar senha precisa ser igual ao da Senha'
        )
      }).required('Confirmar senha é obrigatório!')
        .label('Confirmar senha')
        .min(8, "O Campo Confirmar Senha precisa ter pelo menos 8 caracteres")
        .max(16, "O Campo Confirmar Senha precisa ter menos de 16 caracteres"),
      plan: Yup.number().required('Selecionar plano é obrigatório!').label('Plano'),
      accept_terms: Yup.boolean().required('É necessário aceitar os termos e condições!'),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      plan: null,
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

  const handleInformPayment = async () => {
    const message = `Olá sou ${formik.values.name}, e gostaria de informar o pagamento do WPSender para o email ${formik.values.email} com o plano ${formik.values.plan === 1 ? 'Mensal R$ 10,00' : formik.values.plan === 2 ? 'Semestral de R$ 60,00 por R$ 50,00' : formik.values.plan === 3 ? 'Anual de R$ 120,00 por R$ 100,00' : ''}`

    window.open(`https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(message)}&amp;text&amp;type=phone_number&amp;app_absent=0`, "_blank")
    setOpen(false)
    setQrCode('')
    navigate("/")
  }

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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Efetue o pagamento
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Faça o pagamento via Pix Usando o QrCode a baixo.
          </Typography>
          <Box sx={{ height: "auto", width: "100%", mt: 2, mb: 2 }}>
            <QRCode
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={QrCode}
            />
          </Box>

          <Button fullWidth onClick={handleInformPayment} variant="contained" color="primary">Informar o pagamento</Button>
        </Box>
      </Modal>
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
            <Card sx={{ p: 2, mb: 8, maxWidth: 400, width: '100%', }}>
              <form onSubmit={formik.handleSubmit} style={{ width: "100%", display: 'flex', gap: '16px', flexDirection: 'column' }}>
                <Typography variant='body1' sx={{ w: '100%', textAlign: 'center' }} >
                  Que bom que você tem interesse
                </Typography>
                <Typography variant='body2' sx={{ w: '100%', textAlign: 'center' }} >
                  Para continuar basta realizar o cadastro e efetuar o pagamento. Em seguida basta informar o pagamento clicando no botão a baixo.
                </Typography>
                <TextField
                  fullWidth
                  label="Nome"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={!!formik.errors.name}
                  helperText={formik.errors.name}
                />
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
                  <InputLabel htmlFor="password">Senha</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={!!formik.errors.password}
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
                  <FormHelperText>{formik.errors.password}</FormHelperText>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="confirm-password">Confirmar Senha</InputLabel>
                  <OutlinedInput
                    id="confirm_password"
                    name="confirm_password"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    error={!!formik.errors.confirm_password}
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
                  <FormHelperText>{formik.errors.confirm_password}</FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="accept-terms-label">Plano</InputLabel>
                  <Select
                    labelId="accept-terms-label"
                    label="Planos"
                    id="plan"
                    name="plan"
                    value={formik.values.plan}
                    onChange={formik.handleChange}
                    error={!!formik.errors.plan}
                  >
                    <MenuItem value={0} disabled>Selecione um plano</MenuItem>
                    <MenuItem value={1}>Mensal R$ 10,00</MenuItem>
                    <MenuItem value={2}>Semestral<sub style={{ margin: '0 8px' }}>de <s>R$ 60,00</s> por</sub>R$ 50,00</MenuItem>
                    <MenuItem value={3}>Anual<sub style={{ margin: '0 8px' }}>de <s>R$ 120,00</s> por</sub>R$ 100,00</MenuItem>
                  </Select>
                  <FormHelperText>Selecione o plano que deseja pagar. {formik.errors.plan}</FormHelperText>
                </FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="accept_terms"
                        name="accept_terms"
                        checked={formik.values.accept_terms}
                        onChange={formik.handleChange}
                      />
                    }
                    label={
                      <Typography>
                        Aceito os <a href="https://desenvolvedordeaplicativos.com.br/termos-e-condicoes" target="_blank" >Termos e Condições de serviço</a>
                      </Typography>
                    }
                  />
                </FormGroup>
                <Button type="submit" variant="contained" color="primary">Solicitar codigo Pix</Button>
                <Typography variant='caption' sx={{ w: '100%', textAlign: 'center' }} >
                  Já tem login?
                </Typography>
                <Button type="button" onClick={() => navigate("/")}>Entrar no sistema!</Button>

              </form>
            </Card>
          </Box>
        </Box>
      </Box >
    </ThemeProvider >
  );
};