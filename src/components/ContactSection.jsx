import { Box, Button, Container, Link, TextField, Typography } from "@mui/material";
import { useFormik } from 'formik';
import React, { useMemo } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import * as Yup from 'yup';
import { useConversion } from "../hooks/useConversion";
import { useLoading } from "../hooks/useLoading";
import { useResize } from "../hooks/useResize";
import { useToast } from "../hooks/useToast";
import { phone as phoneMask } from "../utils/masks";
import emailjs from '@emailjs/browser'

export default function ContactSection({ location = "" }) {
  const { conversion } = useConversion();
  const { size } = useResize();
  const { addToast } = useToast();
  const { setIsLoading } = useLoading();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      phone: Yup.string().required("O campo Whatsapp é obrigatório").length(15, "Numero digitado incorreto!"),
      email: Yup.string().required("O campo Email é obrigatório").email("Digite um email válido!"),
      message: Yup.string().required("O campo Mensagem é obrigatório"),
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
    validationSchema: formSchema,
    onSubmit: values => {
      handleSubmitForm(values)
    },
  });

  async function handleSubmitForm(formValues) {

    emailjs.send('service_4o2awb7', 'template_tjvp20c', {
      name: formValues.name,
      phone: formValues.phone,
      email: formValues.email,
      message: formValues.message
    }, 'user_y1zamkr7P7dPydkNhdhxi').then((res) => {
      console.log("Sucesso", res)
      addToast({
        message: "Mensagem enviada com sucesso!",
        severity: 'success'
      })
      formik.resetForm();
    }, (err) => {
      console.log("ERRO", err)
      addToast({
        message: "Houve um problema ao tentar enviar a mensagem. Tente novamente mais tarde!",
        severity: 'error'
      })
    })
  }

  return (
    <Box
      sx={{
        width: '100vw',
        backgroundColor: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
      }}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: size[0] < 720 ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          my: 8
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" color="#212529">Entre em contato com a gente</Typography>
          <Typography variant="body1" color="#212529">Ficou com duvidas ou quer conversar mais?</Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2 }} variant="body1" color="#212529">
            <FaMapMarkerAlt color="#128c7e" size={24} /> <b>Gravataí-RS</b>
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2 }} variant="body1" color="#212529">
            <FaEnvelope color="#128c7e" size={24} />{" "}
            <b>
              <Link color="#212529" underline="none" target="_blank" rel="noopener noreferrer" href="mailto:filipe.x2016@gmail.com">
                Email do desenvolvedor
              </Link>
            </b>
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: '480px',
            width: '100%',
            borderRadius: 2,
            py: 6,
            px: 4,
            backgroundColor: '#dcf8c6',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
          }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }} variant="h5" color="#212529">
            <FaEnvelope color="#128c7e" size={24} /> <b>Preencha o formulário</b>
          </Typography>
          <TextField
            fullWidth
            inputProps={{
              sx: {
                backgroundColor: '#FFF'
              }
            }}
            id="contact-name"
            name="name"
            label="Seu Nome"
            placeholder={"Digite seu nome completo"}
            value={formik.values.name}
            helperText={formik.errors.name}
            error={!!formik.errors.name}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            inputProps={{
              maxLength: 15,
              sx: {
                backgroundColor: '#FFF'
              }
            }}
            id="contact-phone"
            name="phone"
            label="Seu WhatsApp"
            placeholder={"(51) 00000-0000"}
            value={formik.values.phone}
            helperText={formik.errors.phone}
            error={!!formik.errors.phone}
            onChange={(event) => {
              formik.setFieldValue('phone', phoneMask(event.target.value))
            }}
          />
          <TextField
            fullWidth
            inputProps={{
              sx: {
                backgroundColor: '#FFF'
              }
            }}
            id="contact-email"
            name="email"
            label="Seu melhor email"
            placeholder={"seunome@meuemail.com"}
            value={formik.values.email}
            helperText={formik.errors.email}
            error={!!formik.errors.email}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            sx={{ backgroundColor: "#FFF" }}
            multiline
            id="message"
            name="message"
            label="Mensagem"
            placeholder="Queria saber sobre..."
            value={formik.values.message}
            helperText={formik.errors.message}
            error={!!formik.errors.message}
            onChange={formik.handleChange}
            rows={6}
          />
          <Button variant="contained" color="primary" type="submit">Enviar Mensagem</Button>
        </Box>
      </Container>
    </Box>
  );
}
