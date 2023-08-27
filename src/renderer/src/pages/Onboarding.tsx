import { Button, Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { FaWhatsapp, FaWindows } from "react-icons/fa";
import { useNavigate } from "react-router";

import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckmarkIcon from "@mui/icons-material/Check";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  circularProgressClasses,
  InputAdornment,
  Slide,
  TextField,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageChrome from "../assets/chrome.png";
import ImageChromeDriver from "../assets/chromedriver.png";
import ImageLista from "../assets/lista.png";
import ImageNovoCaminho from "../assets/novocaminho.png";
import ImageSistema from "../assets/sistema.png";
import ImageVariaveis from "../assets/variaveis.png";

import celular from "../utils/masks";

export default function Onboarding() {
  const navigate = useNavigate();
  const [stepPosition, setStepPosition] = React.useState(0);
  const [isLoading, setisLoading] = React.useState(false);

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState({
    message: "",
    title: "",
    severity: "error",
  });

  const handleClick = () => {
    setOpenSnackBar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  React.useEffect(() => {
    localStorage.setItem("@onboarding-step", JSON.stringify(stepPosition));
  }, [stepPosition]);

  const finishConfig = async () => {
    localStorage.setItem("@show-onboarding", JSON.stringify(true));
    localStorage.setItem("@onboarding-step", "0");
    navigate("/envio-mensagens");
  };

  const [config, setConfig] = React.useState({
    start: 5000,
    initiate_send: 8000,
    check_error: 2000,
    send_message: 3000,
    send_attachment: 3000,
    finalize_send: 5000,
  });

  const handleSubmitForm = async (formValues: any) => {
    const message = "Estou enviando um teste do meu app WhatsApp Sender Bot";
    const contact = {
      id: "1",
      name: formValues.name,
      phone: formValues.phone,
      var1: "",
      var2: "",
      var3: "",
      statusInfo: "",
      status: false,
    };

    try {
      await window.electron.createGlobalInstanceOfDriver();

      await window.electron.loginWhatsapp(config);
      const request = await window.electron.sendMessage(
        contact,
        message,
        [],
        config,
      );

      await window.electron.closeGlobalInstanceOfDriver();

      if (!request.status) {
        setSnackbarMessage({
          message: `Ao tentar enviar a mensagem para ${contact.name} telefone ${contact.phone}, o erro ${request.error} `,
          title: "Problemas no envio",
          severity: "error",
        });

        handleClick();
      }
    } catch (error) {
      if (String(error).includes("ChromeDriver could not be found")) {
        setSnackbarMessage({
          message: `O Chromedriver não está instalado ou configurado. Faça a instalação corretamente ou\nContate o administrador.`,
          title: "Tivemos um problema",
          severity: "error",
        });
      } else {
        setSnackbarMessage({
          message: `Houve um erro ao tentar enviar as mensagens. \nContate o administrador. \n\n${error}`,
          title: "Tivemos um problema",
          severity: "error",
        });
      }
    }
  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("Nome é obrigatório!").label("Nome"),
      phone: Yup.string()
        .required("Whatsapp é obrigatório!")
        .label("WhatsApp")
        .min(14),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const formSchemaConfig = React.useMemo(() => {
    return Yup.object().shape({
      start: Yup.number().required(),
      initiate_send: Yup.number().required(),
      check_error: Yup.number().required(),
      send_message: Yup.number().required(),
      send_attachment: Yup.number().required(),
      finalize_send: Yup.number().required(),
    });
  }, []);

  const formikConfig = useFormik({
    initialValues: {
      start: 5000,
      initiate_send: 8000,
      check_error: 2000,
      send_message: 3000,
      send_attachment: 3000,
      finalize_send: 5000,
    },
    validationSchema: formSchemaConfig,
    onSubmit: (values) => {
      localStorage.removeItem("@config");
      localStorage.setItem("@config", JSON.stringify(values));
      setConfig(values);
    },
  });

  React.useEffect(() => {
    if (localStorage.getItem("@onboarding-step") !== null) {
      setStepPosition(JSON.parse(localStorage.getItem("@onboarding-step")));
    }
    if (localStorage.getItem("@config") !== null) {
      const config = JSON.parse(localStorage.getItem("@config"));
      formikConfig.setFieldValue("start", config.start ?? 5000);
      formikConfig.setFieldValue("initiate_send", config.initiate_send ?? 8000);
      formikConfig.setFieldValue("check_error", config.check_error ?? 2000);
      formikConfig.setFieldValue("send_message", config.send_message ?? 3000);
      formikConfig.setFieldValue(
        "send_attachment",
        config.send_attachment ?? 3000,
      );
      formikConfig.setFieldValue("finalize_send", config.finalize_send ?? 5000);
    } else {
      const config = {
        start: 5000,
        initiate_send: 8000,
        check_error: 2000,
        send_message: 3000,
        send_attachment: 3000,
        finalize_send: 5000,
      };
      localStorage.setItem("@config", JSON.stringify(config));
    }
  }, []);

  const handleNext = () => {
    if (stepPosition + 1 > steps.length - 1) return;

    setStepPosition(stepPosition + 1);
  };

  const handlePrevious = () => {
    if (stepPosition - 1 < 0) return;
    setStepPosition(stepPosition - 1);
  };

  const steps = [
    {
      id: 1,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Que bom ter você aqui
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Vamos começar com esta etapa de configuração do app, caso queira
            pular esta etapa e ir direto ao aplicativo pode clicar no botão a
            baixo para prosseguir.
          </Typography>
          <Typography variant="h5" my={2}>
            Para prosseguir certifique-se que:
          </Typography>
          <List dense={true}>
            <ListItem>
              <ListItemIcon>
                <CheckmarkIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                secondary={"Tenha o Navegador Google Chrome Instalado"}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckmarkIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                secondary={"Tenha o WhatsApp instalado no smartphone"}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckmarkIcon color="primary" />
              </ListItemIcon>
              <ListItemText secondary={"Conexão com a internet ativa"} />
            </ListItem>
          </List>

          <Typography variant="body2" textAlign="center" mt={2}>
            Vamos te guiar por todo o processo e se precisar de ajuda pode nos
            chamar no WhatsApp
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          {/* <Button variant="outlined" onClick={handlePrevious} sx={{ marginTop: 2}} fullWidth>Voltar</Button> */}
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Vamos começar
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Para iniciar basta instalar o Google Chrome
          </Typography>
          <Button
            component="a"
            href="https://www.google.pt/intl/pt-PT/chrome"
            variant="contained"
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Baixar o Google Chrome
          </Button>

          <CardMedia
            sx={{
              marginTop: 2,
            }}
            component="img"
            height="194"
            width={"100%"}
            image={ImageChrome}
            alt="Instalação do Chrome"
          />

          <Typography variant="body2" textAlign="center" mt={2}>
            Caso este passo esteja finalizado basta clicar em proximo.
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Instalando o driver
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            O Proximo passo é instalar o Driver do Google Chrome que é
            encontrado no site a baixo:
          </Typography>
          <Button
            component="a"
            href="https://chromedriver.chromium.org/downloads"
            variant="contained"
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Baixar o Driver do Google Chrome
          </Button>

          <CardMedia
            sx={{
              marginTop: 2,
            }}
            component="img"
            height="194"
            width={"100%"}
            image={ImageChromeDriver}
            alt="Instalação do Chrome"
          />

          <Typography variant="body2" textAlign="center" mt={2}>
            Copie o conteúdo do arquivo baixado para uma nova pasta em
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              C:/whatsappsenderchromedriver
            </Box>
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Configurando o ambiente
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Agora vamos configurar o ambiente. Esse passo pode ser muito
            complexo. Lembre-se de que se precisar de ajuda pode chamar a
            qualquer momento.
          </Typography>

          <Typography variant="body2" textAlign="center" mt={2}>
            Pressione o botão
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              <FaWindows size={10} color={"#333"} />
            </Box>
            (Logo do Windows) e em seguida digite
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Variáveis de Ambiente
            </Box>
            e aperte
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Enter
            </Box>
          </Typography>

          <CardMedia
            sx={{
              marginTop: 2,
            }}
            component="img"
            height="250"
            width={"100%"}
            image={ImageVariaveis}
            alt="Variáveis de ambiente"
          />

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Configurando o ambiente
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Estamos configurando o ambiente. Esse passo pode ser muito complexo.
            Lembre-se de que se precisar de ajuda pode chamar a qualquer
            momento.
          </Typography>

          <Typography variant="body2" textAlign="center" mt={2}>
            Clique no botão
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Variáveis de Ambiente...
            </Box>
          </Typography>

          <CardMedia
            sx={{
              marginTop: 2,
            }}
            component="img"
            height="100%"
            width={"100%"}
            image={ImageSistema}
            alt="Variáveis de ambiente"
          />

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Configurando o ambiente
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Estamos configurando o ambiente. Esse passo pode ser muito complexo.
            Lembre-se de que se precisar de ajuda pode chamar a qualquer
            momento.
          </Typography>

          <Typography variant="body2" textAlign="center" mt={2}>
            Na sessão onde diz
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Variáveis do sistema
            </Box>
            encontre a linha da variável
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Path
            </Box>
            Clique na linha para selecionar e após clique no botão
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Editar...
            </Box>
            Em baixo desta sessão
          </Typography>

          <CardMedia
            sx={{
              marginTop: 2,
            }}
            component="img"
            height="100%"
            width={"100%"}
            image={ImageLista}
            alt="Variáveis de ambiente"
          />

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Configurando o ambiente
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Estamos configurando o ambiente. Esse passo pode ser muito complexo.
            Lembre-se de que se precisar de ajuda pode chamar a qualquer
            momento.
          </Typography>

          <Typography variant="body2" textAlign="center" mt={2}>
            Clique em
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Novo
            </Box>
            e adicione o caminho
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              C:/whatsappsenderchromedriver
            </Box>
            que você baixou nos passos anteriores.
          </Typography>

          <CardMedia
            sx={{
              marginTop: 2,
            }}
            component="img"
            height="100%"
            width={"100%"}
            image={ImageNovoCaminho}
            alt="Variáveis de ambiente"
          />
          <Typography variant="body2" textAlign="center" mt={2}>
            Clique em
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Ok
            </Box>
            depois em
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Ok
            </Box>
            novamente e por fim em
            <Box
              component="code"
              sx={{
                margin: "2px 8px ",
                padding: "2px 8px ",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#333",
                backgroundColor: "#F5f5f5",
              }}
            >
              Ok
            </Box>
            para fechar as janelas. Com isso o ambiente deve estar comfigurado.
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Pronto
          </Typography>
          <Typography variant="caption" lineHeight={1} textAlign="left">
            Talvez seja necessário reiniciar o computador. Mas antes vamos fazer
            um teste.
          </Typography>

          <Typography variant="body2" textAlign="center" mt={2} mb={2}>
            Digite um nome e um telefone para testarmos o envio de mensagens
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nome"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="WhatsApp"
              id="phone"
              name="phone"
              inputProps={{ maxLength: 15 }}
              value={formik.values.phone}
              onChange={(e) => {
                e.target.value = celular(e.target.value);
                formik.handleChange(e);
              }}
              onBlur={(e) => {
                e.target.value = celular(e.target.value);
                formik.handleBlur(e);
              }}
              error={!!formik.errors.phone}
              helperText={formik.errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained">
              Enviar mensagem teste
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2} mb={2}>
            Confirme se a mensagem foi enviada. Se tudo estiver correto vamos
            prosseguir.
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Pronto
          </Typography>
          <Typography variant="body2" textAlign="center" mt={2} mb={4}>
            Agora caso não tenha enviado a mensagem, verifique os intervalos de
            tempo entre as ações do app. e clique em voltar a baixo para testar
            o envio novamente.
          </Typography>

          <Box
            component="form"
            onSubmit={formikConfig.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              type="number"
              sx={{ mb: 1 }}
              label="Aguardar Validar a página de inicio"
              id="start"
              name="start"
              value={formikConfig.values.start}
              onChange={formikConfig.handleChange}
              onBlur={formikConfig.handleBlur}
              error={!!formikConfig.errors.start}
              helperText="Tempo de espera para carregar a aplicação após validar o QrCode"
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mb: 1 }}
              label="Aguardar Após abrir o contato"
              id="initiate_send"
              name="initiate_send"
              value={formikConfig.values.initiate_send}
              onChange={formikConfig.handleChange}
              onBlur={formikConfig.handleBlur}
              error={!!formikConfig.errors.initiate_send}
              helperText="Tempo de espera para carregar a aplicação após abrir um contato"
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mb: 1 }}
              label="Verificar se houve erro"
              id="check_error"
              name="check_error"
              value={formikConfig.values.check_error}
              onChange={formikConfig.handleChange}
              onBlur={formikConfig.handleBlur}
              error={!!formikConfig.errors.check_error}
              helperText="Tempo de espera para carregar a mensagem de erro."
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mb: 1 }}
              label="Envio de mensagem"
              id="send_message"
              name="send_message"
              value={formikConfig.values.send_message}
              onChange={formikConfig.handleChange}
              onBlur={formikConfig.handleBlur}
              error={!!formikConfig.errors.send_message}
              helperText="Tempo de espera Entre os envios de mensagem."
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mb: 1 }}
              label="Envio de anexo"
              id="send_attachment"
              name="send_attachment"
              value={formikConfig.values.send_attachment}
              onChange={formikConfig.handleChange}
              onBlur={formikConfig.handleBlur}
              error={!!formikConfig.errors.send_attachment}
              helperText="Tempo de espera Após enviar um anexo."
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mb: 1 }}
              label="Envio de última mensagem"
              id="finalize_send"
              name="finalize_send"
              value={formikConfig.values.finalize_send}
              onChange={formikConfig.handleChange}
              onBlur={formikConfig.handleBlur}
              error={!!formikConfig.errors.finalize_send}
              helperText="Tempo de espera após o envio da ultima mensagem."
            />

            <Button type="submit" sx={{ width: "100%" }} variant="contained">
              Salvar tempos
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Próximo
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
    {
      id: 2,
      component: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "100%",
          }}
        >
          <Typography variant="h5" mb={2}>
            Pronto
          </Typography>
          <Typography variant="body2" textAlign="center" mt={2} mb={4}>
            Aproveite o envio automatizado de mensagens e acelere seu negócio! E
            lembre, sempre que precisar pode chamar no nosso whatsapp.
          </Typography>

          <Button
            variant="contained"
            onClick={finishConfig}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Finalizar Configuração
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Snackbar
        sx={{ mt: 8 }}
        open={openSnackBar}
        autoHideDuration={snackbarMessage.severity === "error" ? 30000 : 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarMessage.severity}
          sx={{ maxWidth: "400px", width: "100%" }}
        >
          <AlertTitle>{snackbarMessage.title}</AlertTitle>
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            zIndex: 10000,
            backgroundColor: "#00000064",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="indeterminate"
            disableShrink
            color="primary"
            sx={{
              animationDuration: "550ms",
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: "round",
              },
            }}
            size={50}
            thickness={6}
          />
        </Box>
      )}
      <Box
        sx={{
          m: 0,
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            width: "100%",
            height: "15rem",
            backgroundColor: (theme) => theme.palette.primary.main,
          }}
        ></Box>
        <Box sx={{ zIndex: 10, position: "absolute", top: 0, width: "100%" }}>
          <Box
            sx={{
              mt: 8,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              <FaWhatsapp color="25d366" />
              <span style={{ color: "#25d366" }}>
                <b>WhatsApp</b>
              </span>
              <span style={{ color: "#f9f9f9" }}>
                <b>Sender</b>
              </span>
            </Typography>
            <Card
              sx={{
                p: 2,
                maxWidth: 400,
                width: "100%",
                display: "flex",
                gap: 2,
                flexDirection: "column",
              }}
            >
              {steps[stepPosition].component}
            </Card>
            <Button variant="text" onClick={finishConfig}>
              Pular
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
