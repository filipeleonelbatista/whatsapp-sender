import emailjs from '@emailjs/browser';
import { Button, Card, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from 'formik';
import { useMemo, useState } from "react";
import { FaBars, FaDownload, FaQrcode, FaWhatsapp } from "react-icons/fa";
import QRCode from 'react-qr-code';
import * as Yup from 'yup';
import { useResize } from "../hooks/useResize";
import { api, createAssinante } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HomeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const plansArray = [
    { value: '', key: "Selecione um plano" },
    { value: '0', key: "Primeiro mês por R$ 10,00" },
    { value: '1', key: "Mensal R$ 19,90" },
    { value: '6', key: "Semestral de R$ 119,40 por R$ 79,90" },
    { value: '12', key: "Anual de R$ 238,80 por R$ 159,90" },
  ]
  const [open, setOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleIsShowMenu = () => {
    setIsShow(!isShow);
  };

  function handleDownloadApp() {
    console.log("Baixar o app")
    window.open(window.location.href + 'WhatsAppSenderBot.Setup.4.8.4.exe', '_blank')
  }

  const handleSubmitForm = async (formValues) => {
    if (!formValues.accept_terms) {
      alert("Para acessar é necessário aceitar os Termos e Condições do app!");
      return;
    }
    if (formValues.plan === '') {
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
      emailjs.send('service_4o2awb7', 'template_uc48uh8', {
        ...data,
        plano: data.selected_plan === '0' ? 'Primeiro Mês por R$ 10,00'
          : data.selected_plan === '1' ? 'Mensal R$ 19,90'
            : data.selected_plan === '6' ? 'Semestral de R$ 119,40 por R$ 79,90'
              : data.selected_plan === '12' ? 'Anual de R$ 238,80 por R$ 159,90' : '',

      }, 'user_y1zamkr7P7dPydkNhdhxi').then((res) => {
        console.log("Sucesso", res)
        // alert("Sua mensagem foi enviada com sucesso")
      }, (err) => {
        console.log("ERRO", err)
        // alert("Houve um erro ao enviar sua mensagem. Tente o contato pelo Whatsapp ou tente novamente mais tarde!")
      })

      const { nome, email, senha, selected_plan, request_access_date, payment_date, is_active } = data;
      const mutationcreateAssinante = createAssinante(nome, email, senha, request_access_date, selected_plan, is_active, payment_date)
      await api.post('', mutationcreateAssinante)

      if (formValues.plan === '0') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540520.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062250521eN2bHtVplcyggdJ13l5he6304D991')
      } else if (formValues.plan === '1') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540519.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062210517WhatsappSenderApp6304573D')
      } else if (formValues.plan === '6') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540579.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062240520WhatsappSender6meses63048645')
      } else if (formValues.plan === '12') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b5204000053039865406159.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062250521WhatsappSender12meses6304860D')
      }

    }
    catch (err) {
      console.log('ERROR DURING AXIOS REQUEST', err);

      if (err?.response?.data?.errors[0]?.message === 'value is not unique for the field "email"') {
        alert("Email ja cadastrado");
        return;
      } else {
        alert("Houve um problema ao enviar sua solicitação, tente novamente mais tarde!")
      }

    }
  };

  const handleInformPayment = async () => {
    const message = `Olá sou ${formik.values.name}, e gostaria de informar o pagamento do WPSender para o email ${formik.values.email} com o plano ${formik.values.plan === '0' ? 'Primeiro mês por R$ 10,00' : formik.values.plan === '1' ? 'Mensal R$ 19,90' : formik.values.plan === '6' ? 'Semestral de R$ 119,40 por R$ 79,90' : formik.values.plan === '12' ? 'Anual de R$ 238,80 por R$159,90' : ''}`
    window.open(`https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(message)}&amp;text&amp;type=phone_number&amp;app_absent=0`, "_blank")
  }

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório!').label('Nome'),
      email: Yup.string().email("Precisa ser um email válido").required('Email é obrigatório!').label('Email'),
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
      plan: Yup.string().required('Selecionar plano é obrigatório!').label('Plano'),
      accept_terms: Yup.boolean().required('É necessário aceitar os termos e condições!'),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      plan: '',
      accept_terms: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const { size } = useResize();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Modal open={open}
        sx={{
          display: "flex",
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClose={() => {
          setOpen(false)
          setQrCode('')
          formik.resetForm()
        }}>
        <Card style={{
          minWidth: 450,
          maxHeight: '90%',
          padding: "20px",
          gap: '20px',
          display: "flex",
          flexDirection: "column",
          alignItems: 'center',
          overflow: 'auto'
        }}>
          {
            qrCode !== '' ? (
              <>
                <Typography variant='h5'>Efetue o pagamento</Typography>
                <Typography variant="body2" textAlign={"center"}>
                  Faça o pagamento via Pix Usando o QrCode a baixo.
                </Typography>
                <div style={{ height: "auto", width: "100%", margin: "0.5rem 0", maxWidth: "350px" }}>
                  <QRCode
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrCode}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleInformPayment}
                  variant={"outlined"}
                  fullWidth
                >
                  Informar o pagamento
                </Button>
                <Typography variant="body2">
                  Já informou? então baixe o App
                </Typography>
                <Button
                  type="button"
                  variant={"contained"}
                  fullWidth
                  onClick={() => {
                    setOpen(false)
                    setQrCode('')
                    formik.resetForm()
                    handleDownloadApp()
                  }}
                >
                  <FaDownload />
                  Baixe o app
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5">Que bom que você tem interesse</Typography>
                <Typography variant="body2" textAlign={"center"}>
                  Para continuar basta realizar o cadastro e efetuar o pagamento.<br />
                  Em seguida basta informar o pagamento clicando no botão a baixo.
                </Typography>
                <form
                  onSubmit={formik.handleSubmit}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    name="name"
                    label="Nome"
                    placeholder="Digite seu nome completo"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                  />
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Digite seu melhor email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!formik.errors.email}
                    helperText={formik.errors.email}
                  />
                  <TextField
                    required
                    fullWidth
                    id="password"
                    name="password"
                    label="Senha"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={!!formik.errors.password}
                    helperText={formik.errors.password}
                  />
                  <TextField
                    required
                    style={{ width: "100%" }}
                    id="confirm_password"
                    name="confirm_password"
                    label="Confirmar Senha"
                    type="password"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    error={!!formik.errors.confirm_password}
                    helperText={formik.errors.confirm_password}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Selecione seu plano</InputLabel>
                    <Select
                      required
                      fullWidth
                      id="plan"
                      name="plan"
                      label="Selecione seu plano"
                      value={formik.values.plan}
                      onChange={formik.handleChange}
                      error={!!formik.errors.plan}
                      helperText={formik.errors.plan}
                    >
                      {
                        plansArray.map((item, index) => <MenuItem key={index} value={item.value}>{item.key}</MenuItem>)
                      }
                    </Select>
                  </FormControl>

                  <FormGroup>
                    <FormControlLabel control={
                      <Checkbox
                        id="accept_terms"
                        name="accept_terms"
                        checked={formik.values.accept_terms}
                        onChange={formik.handleChange}
                      />
                    }
                      label={<Typography variant='body2'>Aceito os <a href="https://filipeleonelbatista.vercel.app/termos-e-condicoes" target="_blank" >Termos e Condições de serviço</a></Typography>}
                    />
                  </FormGroup>


                  <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    startIcon={<FaQrcode size={18} />}
                  >
                    Solicitar Código Pix
                  </Button>

                  <Typography variant="body2">
                    Já é cadastrado?
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<FaDownload size={18} />}
                    onClick={() => {
                      setOpen(false)
                      setQrCode('')
                      formik.resetForm()
                      handleDownloadApp()
                    }}
                  >
                    Baixar App
                  </Button>
                </form>
              </>
            )
          }
        </Card>
      </Modal >
      <Box
        sx={{
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          py: 2.8,
          px: 4,
          backgroundColor: '#dcf8c6',
          zIndex: 100,
        }}
      >
        <Typography component={"h1"} sx={{ fontWeight: "bold", fontSize: 24, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FaWhatsapp color="#25d366" size={28} /> <p><span style={{ color: "#25d366" }}>WhatsApp</span><span style={{ color: '#075e54' }}>Sender</span></p>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {
            size[0] < 720 ? (
              <>
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ width: 48, height: 48 }}
                  aria-controls={openMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                >
                  <FaBars />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMenu}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    onClick={() => navigate("/perguntas-frequentes")}
                  >
                    Perguntas frequentes
                  </MenuItem>
                  <MenuItem id={"cadastre"} onClick={() => setOpen(true)}>
                    Cadastre-se agora!
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleDownloadApp}>
                    <ListItemIcon>
                      <FaDownload />
                    </ListItemIcon>
                    Baixar App
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Button
                  variant={location.pathname === "/perguntas-frequentes" ? "outlined" : "text"}
                  color="primary"
                  onClick={() => navigate("/perguntas-frequentes")}
                >
                  Perguntas Frequentes
                </Button>
                <Button
                  id={"cadastre"}
                  color="primary"
                  onClick={() => setOpen(true)}
                >
                  Cadastre-se agora!
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FaDownload size={18} />}
                  onClick={handleDownloadApp}
                >
                  Baixar App
                </Button>
              </Box>
            )
          }
        </Box>
      </Box>
    </>
  );
}
