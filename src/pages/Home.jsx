import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { BsStar } from 'react-icons/bs';
import { FaCheck, FaTimes, FaWhatsapp } from "react-icons/fa";
import ReactPlayer from "react-player";
import * as Yup from 'yup';
import AcceptTerms from "../components/AcceptTerms";
import ContactSection from "../components/ContactSection";
import Floating from "../components/Floating";
import Footer from "../components/Footer";
import HomeNavigation from "../components/HomeNavigation";
import { ConversionContextProvider } from "../context/ConversionContext";
import { useResize } from "../hooks/useResize";
import { phone as phoneMask } from "../utils/masks";

function HomeComponent() {
  const tiers = [
    {
      title: 'Mensal',
      price: '10',
      description: [
        'Envios ilimitados',
        'Importar lista de contatos',
        'Modelos de mensagens',
        'Libere agora via PIX',
      ],
      buttonText: 'Quero este!',
      buttonVariant: 'outlined',
    },
    {
      title: 'Semestral',
      subheader: 'Mais Comprado',
      price: '50',
      description: [
        'Desconto de 10R$ comparado ao mensal',
        'Envios ilimitados',
        'Importar lista de contatos',
        'Modelos de mensagens',
        'Libere agora via PIX',
      ],
      buttonText: 'Quero este!',
      buttonVariant: 'contained',
    },
    {
      title: 'Anual',
      price: '100',
      description: [
        'Desconto de 20R$ comparado ao mensal',
        'Envios ilimitados',
        'Importar lista de contatos',
        'Modelos de mensagens',
        'Libere agora via PIX',
      ],
      buttonText: 'Quero este!',
      buttonVariant: 'outlined',
    },
  ];

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
    window.open(window.location.href + 'WhatsAppSenderBot.Setup.4.7.0.exe', '_blank')
  }

  const handleCadastrar = () => { }

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
              alignItems: size[0] < 720 ? 'center' : 'flex-start',
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
              <Typography variant="body1" color="primary">ENVIE MENSAGENS COM A GENTE 👋</Typography>
              <Typography sx={{ maxWidth: 400, fontWeight: 'bold' }} variant="h4">
                Enviar mensagens em massa não será mais um problema
              </Typography>
              <u></u>
              <Typography sx={{ maxWidth: 450 }} variant="body1">
                Com o app você consegue enviar mensagens, salvar modelos de mensagens e listas, salvar listas de envios para usar em outros momentos e mais.
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

        <Container
          sx={{
            maxWidth: size[0] < 720 ? '80%' : '980px',
            width: '100%',
            paddingBlock: 4,
            marginInline: 'auto',
            backgroundColor: '#FFF',
            border: '1px solid #CCC',
            borderRadius: 2,

            display: 'flex',
            flexDirection: size[0] < 720 ? 'column' : 'row',
            justifyContent: size[0] < 720 ? 'center' : 'space-evenly',
            alignItems: size[0] < 720 ? 'center' : 'flex-start',
            gap: 3,
            mt: -12,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h2">+139,3 Mi</Typography>
            <Typography variant="body2" color="primary">Mensagens enviadas</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h2">154,9 mil</Typography>
            <Typography variant="body2" color="primary" textAlign={"center"}>
              Conversas efetivadas
              <br />
              <small>Retorno de mensagens enviadas</small>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h2">120,00 R$</Typography>
            <Typography variant="body2" color="primary">
              Custo anual baixo
            </Typography>
          </Box>
        </Container>
        {/* CTA */}
        {/* features */}
        <Box sx={{
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
            SERVIÇOS
          </Typography>
          <Typography variant="h2" textAlign="center">
            Como ajudamos você a enviar mensagens
          </Typography>
          <Grid container spacing={2}>
            <Grid item sx={4}>
              <Card sx={{
                width: 300,
                height: 250,
                p: 2.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
              }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#25d366',
                    borderRadius: '50%',
                  }}
                >
                  <FaCheck color="#075e54" />
                </Box>
                <Typography variant="h5"><b>Envio de mensagens</b></Typography>
                <Typography variant="body1">
                  Envie mensagens diretamente e crie listas de envio para os seus contatos
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card sx={{
                width: 300,
                height: 250,
                p: 2.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
              }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#25d366',
                    borderRadius: '50%',
                  }}
                >
                  <FaCheck color="#075e54" />
                </Box>
                <Typography variant="h5"><b>Modelos de mensagens</b></Typography>
                <Typography variant="body1">
                  Crie modelos pré definidos de mensagens para enviar quando quiser.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card sx={{
                width: 300,
                height: 250,
                p: 2.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
              }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#25d366',
                    borderRadius: '50%',
                  }}
                >
                  <FaCheck color="#075e54" />
                </Box>
                <Typography variant="h5"><b>Listas de contatos</b></Typography>
                <Typography variant="body1">
                  Salve e crie novas listas de contatos para usar quando quiser nos envios.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card sx={{
                width: 300,
                height: 250,
                p: 2.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
              }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#25d366',
                    borderRadius: '50%',
                  }}
                >
                  <FaCheck color="#075e54" />
                </Box>
                <Typography variant="h5"><b>Históricos de envios</b></Typography>
                <Typography variant="body1">
                  Tenha sempre acesso aos históricos de envios para não perder nenhuma venda.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card sx={{
                width: 300,
                height: 250,
                p: 2.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
              }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#25d366',
                    borderRadius: '50%',
                  }}
                >
                  <FaCheck color="#075e54" />
                </Box>
                <Typography variant="h5"><b>Pague pelo tempo que usar</b></Typography>
                <Typography variant="body1">
                  Com planos mensais, semestrais e anuais, voce decide quando quer usar o app. sem custos adicionais e sem multas.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card sx={{
                width: 300,
                height: 250,
                p: 2.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
              }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#25d366',
                    borderRadius: '50%',
                  }}
                >
                  <FaCheck color="#075e54" />
                </Box>
                <Typography variant="h5"><b>Sem limites de envios</b></Typography>
                <Typography variant="body1">
                  Envie mensagens para seus clientes sem se preocupar com limites.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* features */}

        {/* testemonials */}
        {/* <section id="testemonials" className={styles.testemonials}>
          <p>DEPOIMENTOS</p>
          <h2>O que os clientes dizem sobre a CadastraPet</h2>
          <div className={styles.testemonialsList}>
            <div className={styles.testemonial}>
              <FaQuoteLeft color="#566dea" />
              <p>
                Tenha históricos médicos, de vacinação e de medicação completo
                do seu pet em qualquer lugar.
              </p>
              <div className={styles.userInfo}>
                <img src="./images/favicon.png" alt="imagem do usuario" />
                <p>Nome</p>
              </div>
            </div>
            <div className={styles.testemonial}>
              <FaQuoteLeft color="#566dea" />
              <p>
                Tenha históricos médicos, de vacinação e de medicação completo
                do seu pet em qualquer lugar.
              </p>
              <div className={styles.userInfo}>
                <img src="./images/favicon.png" alt="imagem do usuario" />
                <p>Nome</p>
              </div>
            </div>
          </div>
        </section> */}
        {/* testemonials */}
        {/* ctaContact */}
        <Container>
          <Box
            sx={{
              width: "100%",
              p: 8,
              backgroundColor: '#25d366',
              borderRadius: 4,
              boxShadow: 3,
              display: 'flex',
              flexDirection: size[0] > 720 ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: size[0] > 720 ? 'space-between' : 'center',
              gap: 2,
            }}
          >
            <Typography variant="h3" color="white" textAlign={size[0] > 720 ? 'left' : "center"} maxWidth={500}>
              Comece a enviar mensagens agora mesmo
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#FFF',
                color: '#25d366',
                '&:hover': {
                  bgcolor: '#ccc',
                  color: '#25d366'
                }
              }}
              onClick={handleDownloadApp}>Baixar o App</Button>
          </Box>
        </Container>
        {/* ctaContact */}
        {/* Preço */}
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
          <Typography
            variant="body1"
            align="center"
            color="primary"
            gutterBottom
            marginY={4}
          >
            PREÇOS
          </Typography>

          <Typography variant="h5" align="center" color="text.secondary" component="p">
            O que você vai pagar para poder enviar mensagens em massa para seus contatos,
            salvar listas de envio, criar modelos de mensagens para agilizar seu dia.
            Pague pelo tempo que quer usar e nada mais.
          </Typography>
        </Container>
        {/* End hero unit */}
        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            {tiers.map((tier) => (
              // Enterprise card is full width at sm breakpoint
              <Grid
                item
                key={tier.title}
                xs={12}
                sm={tier.title === 'Enterprise' ? 12 : 6}
                md={4}
              >
                <Card>
                  <CardHeader
                    title={tier.title}
                    subheader={tier.subheader}
                    titleTypographyProps={{ align: 'center', color: "#FFF", fontWeight: "bold" }}
                    action={tier.title === 'Semestral' ? <BsStar size={24} color={"#DDD"} /> : null}
                    subheaderTypographyProps={{
                      align: 'center',
                      color: "#FFF"
                    }}
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                          ? theme.palette.primary.dark
                          : theme.palette.grey[700],
                    }}
                  />
                  <CardContent sx={{ py: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                      }}
                    >
                      <Typography component="h2" variant="h3" color="text.primary">
                        R${tier.price}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {tier.title === 'Mensal' && "/mês"}
                        {tier.title === 'Semestral' && "/Sem"}
                        {tier.title === 'Anual' && "/Ano"}
                      </Typography>
                    </Box>
                    <ul>
                      {tier.description.map((line) => (
                        <Typography
                          component="li"
                          variant="subtitle1"
                          fontWeight={"bold"}
                          align="center"
                          key={line}
                          sx={{
                            listStyle: 'none',
                          }}
                        >
                          {line}
                        </Typography>
                      ))}
                    </ul>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth variant={tier.buttonVariant} onClick={() => {
                      document.getElementById("cadastre").click()
                    }}>
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Fim do preço */}
        {/* video */}
        <Container
          sx={{
            display: 'flex',
            flexDirection: size[0] < 720 ? 'column-reverse' : 'row',
            gap: 3,
            textAlign: size[0] > 720 ? 'start' : 'center',
            alignItems: 'center',
            my: 4,
            py: 4,

          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: size[0] < 720 ? 'center' : 'flex-start',
            }}
          >
            <Typography variant="body1" color="primary"><b>SOBRE NÓS</b></Typography>
            <Typography variant="h4">Entenda quem somos e por que existimos</Typography>
            <Typography variant="body2">
              A nossa empresa nasceu para pessoas que precisam se comunicar
              com muitos clientes, enviando suas comunicações de forma
              simples usando a tecnologia para alcançar seus objetivos e
              converter mais clientes.
              <br />
              <br />
              Com uma equipe empenhada a encontrar soluções que agregam aos
              clientes trazendo maiores resultados.
            </Typography>
            <Button variant="contained" color="primary" size="large" onClick={handleDownloadApp}>Baixe o App Agora</Button>
          </Box>
          <Box
            sx={{
              maxWidth: size[0] < 720 ? '90vw' : '50vw',
              width: '100%',
              height: 'auto',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <ReactPlayer
              style={{
                maxWidth: size[0] < 720 ? '90vw' : '50vw',
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              url="./videos/Cadastrapet.mp4"
              width="100%"
              height="100%"
              controls={true}
            />
          </Box>
        </Container>
        {/* video */}
        <ContactSection location="Home" />
      </Box>
      <Footer />
      <AcceptTerms />
      <Floating location="Home" />
    </Box >
  );
}

function Home() {
  return (
    <ConversionContextProvider>
      <HomeComponent />
    </ConversionContextProvider>
  );
}

export default Home;
