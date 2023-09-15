import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardMedia, Container, Grid, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import * as Yup from 'yup';
import AcceptTerms from "../components/AcceptTerms";
import Floating from "../components/Floating";
import Footer from "../components/Footer";
import HomeNavigation from "../components/HomeNavigation";
import { ConversionContextProvider } from "../context/ConversionContext";
import { useResize } from "../hooks/useResize";
import { phone as phoneMask } from "../utils/masks";
import { api, getFaq } from '../services/api';
import { useLoading } from '../hooks/useLoading';
import { useToast } from '../hooks/useToast';

function FaqComponent() {
  const { setIsLoading } = useLoading()
  const { addToast } = useToast();

  const [expanded, setExpanded] = useState(false);
  const [faqList, setFaqList] = useState([]);

  const { size } = useResize();
  const [isShow, setIsShow] = useState(false)

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      phone: Yup.string().required("O campo Celular/Whatsapp é obrigatório").length(15, "Numero digitado incorreto!"),
      email: Yup.string().required("O campo Email é obrigatório").email("Digite um Email válido"),
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },
    validationSchema: formSchema,
    onSubmit: values => {
      handleSubmitForm(values)
    },
  });

  const handleSubmitForm = (formValues) => {
    emailjs.send('service_4o2awb7', 'template_tjvp20c', {
      name: formValues.name,
      phone: formValues.phone,
      email: formValues.email,
      message: "Gostaria de receber conteúdos sobre os cuidados nos envios de mensagem em massa."
    }, 'user_y1zamkr7P7dPydkNhdhxi').then((res) => {
      console.log("Sucesso", res)
      alert("Sua mensagem foi enviada com sucesso")
    }, (err) => {
      console.log("ERRO", err)
      alert("Houve um erro ao enviar sua mensagem. Tente o contato pelo Whatsapp ou tente novamente mais tarde!")
    })

    setIsShow(false);

    localStorage.setItem("contact", true);
  }


  function handleDownloadApp() {
    console.log("Baixar o app")
    window.open(window.location.href + 'WhatsAppSenderBot.Setup.4.8.4.exe', '_blank')
  }

  const loadFaqs = async () => {
    try {
      setIsLoading(true)
      const result = await api.post('', getFaq);
      setFaqList(result.data.data.faqs)

    } catch (error) {
      console.log(error)
      addToast({
        severity: "error",
        message: "Houve um problema ao carregar os faqs da base de dados. Tente novamente mais tarde ou contate pelo WhatsApp."
      })

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFaqs();
  }, [])

  return (
    <Box
      component="div"
      onMouseLeave={() => {
        const isContacted = localStorage.getItem('contact')
        if (isContacted === null || JSON.parse(isContacted) === false) {
          setIsShow(true)
        }
      }}
      sx={{
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: 'auto',
        backgroundColor: '#fff',
        color: '#000',
      }}
    >
      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={isShow}
        onClose={() => {
          setIsShow(false);
          localStorage.setItem("contact", true);
        }}
      >
        <Card
          sx={{
            width: size[0] > 720 ? 870 : '90vw',
            height: '90vh',
            outline: 'none',
            position: 'relative',
          }}
        >
          <IconButton onClick={() => {
            setIsShow(false);
            localStorage.setItem("contact", true);
          }} sx={{ position: 'absolute', top: 8, left: 8, backgroundColor: "#00000033" }}>
            <FaTimes />
          </IconButton>
          <Grid container sx={{ height: '100vh' }}>
            {
              size[0] > 720 && (
                <Grid item xs={6} sx={{ pl: 0, pt: 0, height: '100vh' }}>
                  <CardMedia
                    component="img"
                    src={"./assets/images/screens.png"}
                    sx={{
                      height: '100vh'
                    }}
                    alt="PET"
                  />
                </Grid>
              )
            }
            <Grid item xs={size[0] > 720 ? 6 : 12} sx={{ p: 0, height: '100vh' }}>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'column',
                  gap: 1,
                  overflow: 'auto',
                  alignItems: 'center',
                  py: 2,
                  px: 1,
                }}
              >
                <Typography variant="h5" textAlign="center">
                  Não vá agora. Preparamos um conteúdo especial
                </Typography>
                <Typography variant="body1" textAlign="center">
                  Deixe seu email e Whatsapp que enviaremos pra você conteúdo
                  especial sobre cuidados nos envios de mensagem em massa.
                  É de graça e prometemos que não enviaremos Span.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    maxWidth: 320,
                    width: '100%',
                    flexDirection: 'column',
                    gap: 2,
                    pt: 2
                  }}
                  component="form"
                  onSubmit={formik.handleSubmit}
                >
                  <TextField
                    fullWidth
                    id="modal-name"
                    name="name"
                    label="Nome completo"
                    value={formik.values.name}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    fullWidth
                    id="modal-phone"
                    name="phone"
                    label="Celular/WhatsApp"
                    value={formik.values.phone}
                    error={!!formik.errors.phone}
                    helperText={formik.errors.phone}
                    inputProps={{ maxLength: 15 }}
                    onChange={(event) => {
                      formik.setFieldValue('phone', phoneMask(event.target.value))
                    }}
                  />
                  <TextField
                    fullWidth
                    id="modal-email"
                    name="email"
                    label="Coloque seu melhor email"
                    value={formik.values.email}
                    error={!!formik.errors.email}
                    helperText={formik.errors.email}
                    onChange={formik.handleChange}
                  />
                  <Button type="submit" variant="contained" color="primary" startIcon={<FaWhatsapp />}>Quero receber o conteúdo</Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Modal>
      <HomeNavigation />
      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* CTA */}
        <Box
          sx={{
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 12,
            px: 1,
            backgroundColor: '#dcf8c6'
          }}
        >
          <Container
            sx={{
              display: 'flex',
              flexDirection: size[0] < 720 ? 'column' : 'row',
              alignItems: size[0] < 720 ? 'center' : 'center',
              justifyContent: size[0] < 720 ? 'center' : 'flex-start',
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: size[0] < 720 ? 'center' : 'flex-start',
              width: '100%',
              gap: 2
            }}>
              <Typography variant="body1" color="primary">PERGUNTAS FREQUENTES</Typography>
              <Typography sx={{ maxWidth: 400, fontWeight: 'bold' }} variant="h4">
                Tire suas dúvidas.
              </Typography>
              <u></u>
              <Typography sx={{ maxWidth: 450 }} variant="body1">
                Aqui você encontra as dúvidas mais recorrentes dos usuários.
              </Typography>
              <Button sx={{ maxWidth: 450 }} variant="contained" color="primary" size="large" onClick={handleDownloadApp}>BAIXAR O APP AGORA</Button>
            </Box>
            <CardMedia
              component="img"
              sx={{
                margin: '1.4rem 0',
                width: '50%',
                height: 'auto'
              }}
              src={"./images/landing/mockup-cta-2.png"}
              alt="Phone"
            />
          </Container>
        </Box>
        {/* CTA */}
        <Container sx={{
          width: '100vw',
          maxWidth: '980px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          my: 8,
          px: 2,
          gap: 4,
        }}>
          <Typography variant="body1" color="primary">
            PERGUNTAS FREQUENTES
          </Typography>
          <Typography variant="h2" textAlign="center">
            O que você gostaria de saber?
          </Typography>


          {
            faqList.map(faq => (
              <Accordion
                sx={{
                  width: '100%',
                  maxWidth: '980px',
                  mb: 2
                }}
                key={faq.id}
                expanded={expanded === faq.id}
                onChange={() => {
                  if (expanded === faq.id) {
                    setExpanded(false)
                  } else {
                    setExpanded(faq.id)
                  }
                }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {faq.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{faq.subtitle}</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    width: '100%',
                    maxWidth: '980px',
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      p: 2,
                      '& > ul': {
                        ml: 4
                      },
                      '& > img': {
                        width: "100%",
                        heigth: 'auto',
                        borderRadius: 2,
                        boxShadow: 2,
                        marginY: 2,
                      },
                      '& > video': {
                        width: "100%",
                        heigth: 'auto',
                        borderRadius: 2,
                        boxShadow: 2,
                        marginY: 2,
                      }
                    }}
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: faq.content.html
                    }}>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          }

        </Container>

      </Box>
      <Footer />
      <AcceptTerms />
      <Floating location="Home" />
    </Box >
  );
}

function Faq() {
  return (
    <ConversionContextProvider>
      <FaqComponent />
    </ConversionContextProvider>
  );
}

export default Faq;
