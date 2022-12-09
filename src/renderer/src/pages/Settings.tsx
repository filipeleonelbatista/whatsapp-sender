import DrawerComponent from "../components/DrawerComponent";
import { Box, Typography, TextField, Button } from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function Settings() {

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      start: Yup.number().required(),
      initiate_send: Yup.number().required(),
      check_error: Yup.number().required(),
      send_message: Yup.number().required(),
      finalize_send: Yup.number().required(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      start: 5000,
      initiate_send: 8000,
      check_error: 2000,
      send_message: 1000,
      finalize_send: 5000,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      localStorage.setItem("@config", JSON.stringify(values))
    },
  });

  React.useEffect(() => {
    if (localStorage.getItem("@config") !== null) {
      const config = JSON.parse(localStorage.getItem("@config"))
      formik.setFieldValue('start', config.start)
      formik.setFieldValue('initiate_send', config.initiate_send)
      formik.setFieldValue('check_error', config.check_error)
      formik.setFieldValue('send_message', config.send_message)
      formik.setFieldValue('finalize_send', config.finalize_send)
    } else {
      const config =
      {
        start: 5000,
        initiate_send: 8000,
        check_error: 2000,
        send_message: 1000,
        finalize_send: 5000,
      }
      localStorage.setItem("@config", JSON.stringify(config))
    }
  }, [])

  return (
    <DrawerComponent title="Configurações">
      <Typography variant="h4">Configurações</Typography>
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
    </DrawerComponent>
  )
}