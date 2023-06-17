import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { add, differenceInCalendarDays } from "date-fns";
import { useFormik } from 'formik';
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import * as Yup from 'yup';
import DrawerComponent from "../components/DrawerComponent";

export default function Settings() {
  const [user, setUser] = useState()
  const [open, setOpen] = useState(false);
  const [QrCode, setQrCode] = useState('');
  const [plan, setPlan] = useState(0);

  const handleInformPayment = async () => {
    const message = `Olá sou ${user?.nome}, e gostaria de informar o pagamento do WPSender para o email ${user?.email} com o plano ${plan === 1 ? 'Mensal R$ 10,00' : plan === 2 ? 'Semestral de R$ 60,00 por R$ 50,00' : plan === 3 ? 'Anual de R$ 120,00 por R$ 100,00' : ''}`

    window.open(`https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(message)}&amp;text&amp;type=phone_number&amp;app_absent=0`, "_blank")
    setOpen(false)
    setQrCode('')
  }

  const handleChangeQrCode = async (event) => {
    if (Number(event.target.value) === 1) {
      setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540510.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062160512NUbJF4xOYcz56304C81C')
    } else if (Number(event.target.value) === 6) {
      setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540550.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062070503***63041DE2')
    } else if (Number(event.target.value) === 12) {
      setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b5204000053039865406100.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062070503***630469E3')
    }

    setPlan(Number(event.target.value))
  }

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

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      start: Yup.number().required(),
      initiate_send: Yup.number().required(),
      check_error: Yup.number().required(),
      send_message: Yup.number().required(),
      send_attachment: Yup.number().required(),
      finalize_send: Yup.number().required(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      start: 5000,
      initiate_send: 8000,
      check_error: 2000,
      send_message: 3000,
      send_attachment: 3000,
      finalize_send: 5000,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      localStorage.removeItem("@config")
      localStorage.setItem("@config", JSON.stringify(values))
    },
  });

  React.useEffect(() => {
    const userInfo = localStorage.getItem("@user-info")
    if (userInfo !== null) {
      setUser(JSON.parse(userInfo))
    }
    if (localStorage.getItem("@config") !== null) {
      const config = JSON.parse(localStorage.getItem("@config"))
      formik.setFieldValue('start', config.start ?? 5000)
      formik.setFieldValue('initiate_send', config.initiate_send ?? 8000)
      formik.setFieldValue('check_error', config.check_error ?? 2000)
      formik.setFieldValue('send_message', config.send_message ?? 3000)
      formik.setFieldValue('send_attachment', config.send_attachment ?? 3000)
      formik.setFieldValue('finalize_send', config.finalize_send ?? 5000)
    } else {
      const config =
      {
        start: 5000,
        initiate_send: 8000,
        check_error: 2000,
        send_message: 3000,
        send_attachment: 3000,
        finalize_send: 5000,
      }
      localStorage.setItem("@config", JSON.stringify(config))
    }
  }, [])

  return (
    <DrawerComponent title="Configurações">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
              <MenuItem value={0} disabled>Selecione um plano</MenuItem>
              <MenuItem value={1}>Mensal R$ 10,00</MenuItem>
              <MenuItem value={6}>Semestral<sub style={{ margin: '0 8px' }}>de <s>R$ 60,00</s> por</sub>R$ 50,00</MenuItem>
              <MenuItem value={12}>Anual<sub style={{ margin: '0 8px' }}>de <s>R$ 120,00</s> por</sub>R$ 100,00</MenuItem>
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
              <Box sx={{ height: "auto", width: "100%", mt: 2, mb: 2 }}>
                <QRCode
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={QrCode}
                />
              </Box>

              <Button fullWidth onClick={handleInformPayment} variant="contained" color="primary">Informar o pagamento</Button>
            </>
          )}
        </Box>
      </Modal>
      <Typography variant="h4">Configurações</Typography>
      <Typography variant="body1">
        Informações sobre a ativação
      </Typography>
      <Typography variant="body1">
        Ativado para {user?.nome}(<a href={`mailto:${user?.email}`} >{user?.email}</a>) Válido até dia {' '}
        <span style={differenceInCalendarDays(add(new Date(user?.paymentDate), { months: user?.selectedPlan }), Date.now()) < 15 ? { color: 'red', fontWeight: 'bold' } : { fontWeight: 'bold' }}>
          {add(new Date(user?.paymentDate), { months: user?.selectedPlan }).toLocaleString('pt-BR')}
        </span>
      </Typography>
      { }
      {
        differenceInCalendarDays(add(new Date(user?.paymentDate), { months: user?.selectedPlan }), Date.now()) < 15 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              Sua licença está prestes a expirar, adiquira já uma nova licensa e evite ficar sem enviar mensagens.
            </Typography>
            <Button type="button" variant="contained" color="primary" onClick={() => setOpen(true)}>Renovar licença</Button>
          </Box>
        )
      }
      <Typography variant="body1">
        Configuração do aplicativo
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Tempos de espera
        </Typography>
        <Typography variant="body2" sx={{ mb: 4 }}>
          Tempos de espera devem ser inseridos em milisegundos (1000 ms = 1s)
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            label="Aguardar Validar a página de inicio"
            id="start"
            name="start"
            value={formik.values.start}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.start}
            helperText="Tempo de espera para carregar a aplicação após validar o QrCode"
          />
          <TextField
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            label="Aguardar Após abrir o contato"
            id="initiate_send"
            name="initiate_send"
            value={formik.values.initiate_send}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.initiate_send}
            helperText="Tempo de espera para carregar a aplicação após abrir um contato"
          />
          <TextField
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            label="Verificar se houve erro"
            id="check_error"
            name="check_error"
            value={formik.values.check_error}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.check_error}
            helperText="Tempo de espera para carregar a mensagem de erro."
          />
          <TextField
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            label="Envio de mensagem"
            id="send_message"
            name="send_message"
            value={formik.values.send_message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.send_message}
            helperText="Tempo de espera Entre os envios de mensagem."
          />
          <TextField
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            label="Envio de anexo"
            id="send_attachment"
            name="send_attachment"
            value={formik.values.send_attachment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.send_attachment}
            helperText="Tempo de espera Após enviar um anexo."
          />
          <TextField
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            label="Envio de última mensagem"
            id="finalize_send"
            name="finalize_send"
            value={formik.values.finalize_send}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.finalize_send}
            helperText="Tempo de espera após o envio da ultima mensagem."
          />

          <Button
            type="submit"
            sx={{ width: '100%', mt: 4, mb: 4 }}
            variant="contained"
          >
            Salvar
          </Button>
        </form>
      </Box>
    </DrawerComponent >
  )
}