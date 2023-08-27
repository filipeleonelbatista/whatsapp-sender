import emailjs from "@emailjs/browser";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { VERSION } from "../constants/application";
import useLoader from "../hooks/useLoader";
import useToast from "../hooks/useToast";
import { api, createAssinante, getVersions } from "../services/api";

export default function Register() {
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [QrCode, setQrCode] = React.useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    border: "none",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  const handleSubmitForm = async (formValues) => {
    if (!formValues.accept_terms) {
      addToast({
        severity: "error",
        message:
          "Para acessar é necessário aceitar os Termos e Condições do app!",
      });
      return;
    }
    if (formValues.plan === 0) {
      addToast({
        severity: "error",
        message: "Você precisa definir o plano que deseja adiquirir!",
      });
      return;
    }
    const data = {
      nome: formValues.name,
      email: formValues.email,
      senha: formValues.password,
      selected_plan: formValues.plan,
      request_access_date: new Date(Date.now()).toISOString(),
      payment_date: null,
      is_active: false,
    };

    const versionResponse = (await api.post("", getVersions)) as any;

    const applicationVersionIndex =
      versionResponse.data.data.applicationVersions.findIndex(
        (version: any) => {
          return version.versionNumber === VERSION;
        },
      );

    if (applicationVersionIndex > 0) {
      addToast({
        severity: "error",
        message:
          "A versão do seu aplicativo está desatualizada. Caso queira prosseguir, baixe a nova versão.",
      });
      window.open(
        versionResponse.data.data.applicationVersions[0].versionUrl,
        "_blank",
      );
      return;
    }

    try {
      setIsLoading(true);

      emailjs
        .send(
          "service_4o2awb7",
          "template_uc48uh8",
          {
            ...data,
            plano:
              data.selected_plan === "0"
                ? "Primeiro Mês por R$ 10,00"
                : data.selected_plan === "1"
                ? "Mensal R$ 19,90"
                : data.selected_plan === "6"
                ? "Semestral de R$ 119,40 por R$ 79,90"
                : data.selected_plan === "12"
                ? "Anual de R$ 238,80 por R$ 159,90"
                : "",
          },
          "user_y1zamkr7P7dPydkNhdhxi",
        )
        .then(
          (res) => {
            console.log("Sucesso", res);
          },
          (err) => {
            console.log("emailjs error", err);
          },
        );

      const {
        nome,
        email,
        senha,
        selected_plan,
        request_access_date,
        payment_date,
        is_active,
      } = data;
      const mutationcreateAssinante = createAssinante(
        nome,
        email,
        senha,
        request_access_date,
        selected_plan,
        is_active,
        payment_date,
      );
      await api.post("", mutationcreateAssinante);

      if (formValues.plan === 0) {
        setQrCode(
          "00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540520.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062250521eN2bHtVplcyggdJ13l5he6304D991",
        );
      } else if (formValues.plan === 1) {
        setQrCode(
          "00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540519.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062210517WhatsappSenderApp6304573D",
        );
      } else if (formValues.plan === 6) {
        setQrCode(
          "00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540579.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062240520WhatsappSender6meses63048645",
        );
      } else if (formValues.plan === 12) {
        setQrCode(
          "00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b5204000053039865406159.905802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062250521WhatsappSender12meses6304860D",
        );
      }

      setOpen(true);
    } catch (err) {
      console.log("ERROR DURING AXIOS REQUEST", err);
      setIsLoading(false);

      if (
        err?.response?.data?.errors[0]?.message ===
        'value is not unique for the field "email"'
      ) {
        addToast({
          severity: "error",
          message: "Email ja cadastrado",
        });
        return;
      } else {
        addToast({
          severity: "error",
          message:
            "Houve um problema ao enviar sua solicitação, tente novamente mais tarde!",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("Nome é obrigatório!").label("Nome"),
      email: Yup.string().required("Email é obrigatório!").label("Email"),
      password: Yup.string()
        .required("Senha é obrigatório!")
        .label("Senha")
        .min(8, "A Senha precisa ter pelo menos 8 caracteres")
        .max(16, "A Senha precisa ter menos de 16 caracteres"),
      confirm_password: Yup.string()
        .when("password", {
          is: (val) => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref("password")],
            "O campo Confirmar senha precisa ser igual ao da Senha",
          ),
        })
        .required("Confirmar senha é obrigatório!")
        .label("Confirmar senha")
        .min(8, "O Campo Confirmar Senha precisa ter pelo menos 8 caracteres")
        .max(16, "O Campo Confirmar Senha precisa ter menos de 16 caracteres"),
      plan: Yup.number()
        .required("Selecionar plano é obrigatório!")
        .label("Plano"),
      accept_terms: Yup.boolean().required(
        "É necessário aceitar os termos e condições!",
      ),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      plan: 0,
      accept_terms: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleInformPayment = async () => {
    const message = `Olá sou ${
      formik.values.name
    }, e gostaria de informar o pagamento do WPSender para o email ${
      formik.values.email
    } com o plano ${
      formik.values.plan === "0"
        ? "Primeiro mês por R$ 10,00"
        : formik.values.plan === "1"
        ? "Mensal R$ 19,90"
        : formik.values.plan === "6"
        ? "Semestral de R$ 119,40 por R$ 79,90"
        : formik.values.plan === "12"
        ? "Anual de R$ 238,80 por R$159,90"
        : ""
    }`;

    window.open(
      `https://web.whatsapp.com/send/?phone=%2B5551992736445}&text=${encodeURI(
        message,
      )}&amp;text&amp;type=phone_number&amp;app_absent=0`,
      "_blank",
    );
    setOpen(false);
    setQrCode("");
    navigate("/");
  };

  return (
    <>
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

          <Button
            fullWidth
            onClick={handleInformPayment}
            variant="contained"
            color="primary"
          >
            Informar o pagamento
          </Button>
        </Box>
      </Modal>
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
            <Typography
              variant="h4"
              sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}
            >
              <FaWhatsapp color="#25d366" />
              <span style={{ color: "#25d366" }}>
                <b>WhatsApp</b>
              </span>
              <span style={{ color: "#f9f9f9" }}>
                <b>Sender</b>
              </span>
            </Typography>
            <Card sx={{ p: 2, mb: 8, maxWidth: 400, width: "100%" }}>
              <form
                onSubmit={formik.handleSubmit}
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "16px",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ w: "100%", textAlign: "center" }}
                >
                  Que bom que você tem interesse
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ w: "100%", textAlign: "center" }}
                >
                  Para continuar basta realizar o cadastro e efetuar o
                  pagamento. Em seguida basta informar o pagamento clicando no
                  botão a baixo.
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
                    type={showPassword ? "text" : "password"}
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
                  <InputLabel htmlFor="confirm-password">
                    Confirmar Senha
                  </InputLabel>
                  <OutlinedInput
                    id="confirm_password"
                    name="confirm_password"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    error={!!formik.errors.confirm_password}
                    type={showConfirmPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirmar Senha"
                  />
                  <FormHelperText>
                    {formik.errors.confirm_password}
                  </FormHelperText>
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
                    <MenuItem disabled>Selecione um plano</MenuItem>
                    <MenuItem value={0}>Primeiro Mês por R$ 10,00</MenuItem>
                    <MenuItem value={1}>Mensal R$ 19,90</MenuItem>
                    <MenuItem value={6}>
                      Semestral
                      <sub style={{ margin: "0 8px" }}>
                        de <s>R$ 119,40</s> por
                      </sub>
                      R$ 79,90
                    </MenuItem>
                    <MenuItem value={12}>
                      Anual
                      <sub style={{ margin: "0 8px" }}>
                        de <s>R$ 238,80</s> por
                      </sub>
                      R$ 159,90
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Selecione o plano que deseja pagar. {formik.errors.plan}
                  </FormHelperText>
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
                        Aceito os{" "}
                        <a
                          href="https://filipeleonelbatista.vercel.app/termos-e-condicoes"
                          target="_blank"
                        >
                          Termos e Condições de serviço
                        </a>
                      </Typography>
                    }
                  />
                </FormGroup>
                <Button type="submit" variant="contained" color="primary">
                  Solicitar codigo Pix
                </Button>
                <Typography
                  variant="caption"
                  sx={{ w: "100%", textAlign: "center" }}
                >
                  Já tem login?
                </Typography>
                <Button type="button" onClick={() => navigate("/")}>
                  Entrar no sistema!
                </Button>
              </form>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}
