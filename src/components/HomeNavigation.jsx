import emailjs from '@emailjs/browser';
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from "react";
import { FaBars, FaDownload, FaWhatsapp } from "react-icons/fa";
import QRCode from 'react-qr-code';
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { api, createAssinante } from '../services/api';
import styles from "../styles/components/HomeNavigation.module.css";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Input from "./Input";
import Modal from "./Modal";
import Select from "./Select";

export default function HomeNavigation() {
  const [open, setOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleIsShowMenu = () => {
    setIsShow(!isShow);
  };

  function handleDownloadApp() {
    console.log("Baixar o app")
    window.open(window.location.href + 'WhatsAppSenderBot.Setup.4.7.1.exe', '_blank')
  }

  const [offset, setOffset] = useState(0);

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
      emailjs.send('service_4o2awb7', 'template_uc48uh8', {
        ...data,
        plano: data.selected_plan === '1' ? 'Mensal R$ 10,00' : data.selected_plan === '6' ? 'Semestral de R$ 60,00 por R$ 50,00' : data.selected_plan === '12' ? 'Anual de R$ 120,00 por R$ 100,00' : '',

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

      if (formValues.plan === '1') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540510.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062160512NUbJF4xOYcz56304C81C')
      } else if (formValues.plan === '6') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b520400005303986540550.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062070503***63041DE2')
      } else if (formValues.plan === '12') {
        setQrCode('00020126580014BR.GOV.BCB.PIX0136f1bfe5be-67eb-42ad-8928-f71e02e1c99b5204000053039865406100.005802BR5924Filipe de Leonel Batista6009SAO PAULO61080540900062070503***630469E3')
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
    const message = `Olá sou ${formik.values.name}, e gostaria de informar o pagamento do WPSender para o email ${formik.values.email} com o plano ${formik.values.plan === '1' ? 'Mensal R$ 10,00' : formik.values.plan === '6' ? 'Semestral de R$ 60,00 por R$ 50,00' : formik.values.plan === '12' ? 'Anual de R$ 120,00 por R$ 100,00' : ''}`
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

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Modal open={open} onClose={() => {
        setOpen(false)
        setQrCode('')
        formik.resetForm()
      }} >
        <div style={{
          width: '100%',
          display: "flex",
          flexDirection: "column",
          alignItems: 'center',
        }}>
          {
            qrCode !== '' ? (
              <>
                <h2>Efetue o pagamento</h2>
                <p style={{ textAlign: 'center' }}>
                  <small>
                    Faça o pagamento via Pix Usando o QrCode a baixo.
                  </small>
                </p>
                <div style={{ height: "auto", width: "100%", margin: "2.4rem 0", maxWidth: "350px" }}>
                  <QRCode
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrCode}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleInformPayment}
                  style={{ width: "100%", margin: '0.8rem 0' }}
                >
                  Informar o pagamento
                </Button>
                <p>
                  <small>
                    Já informou? então baixe o App
                  </small>
                </p>
                <Button onClick={() => {
                  setOpen(false)
                  setQrCode('')
                  formik.resetForm()
                  handleDownloadApp()
                }}
                  type="button"
                  style={{ width: "100%", margin: '0.8rem 0' }}
                  transparent>
                  <FaDownload />
                  Baixe o app
                </Button>
              </>
            ) : (
              <>
                <h2>Que bom que você tem interesse</h2>
                <p style={{ textAlign: 'center' }}>
                  <small>
                    Para continuar basta realizar o cadastro e efetuar o pagamento.<br />
                    Em seguida basta informar o pagamento clicando no botão a baixo.
                  </small>
                </p>
                <form
                  onSubmit={formik.handleSubmit}
                  style={{
                    width: "100%", display: "flex",
                    flexDirection: "column",
                    alignItems: 'center',
                  }}>
                  <Input
                    required
                    style={{ width: "100%" }}
                    id="name"
                    name="name"
                    label="Nome"
                    placeholder="Digite seu nome completo"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                  />
                  <Input
                    required
                    style={{ width: "100%" }}
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Digite seu melhor email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!formik.errors.email}
                    helperText={formik.errors.email}
                  />
                  <Input
                    required
                    style={{ width: "100%" }}
                    id="password"
                    name="password"
                    label="Senha"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={!!formik.errors.password}
                    helperText={formik.errors.password}
                  />
                  <Input
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
                  <Select
                    required
                    style={{ width: "100%" }}
                    options={[
                      { value: '', key: "Selecione um plano" },
                      { value: '1', key: "Mensal R$ 10,00" },
                      { value: '6', key: "Semestral de R$ 60,00 por R$ 50,00" },
                      { value: '12', key: "Anual de R$ 120,00 por R$ 100,00" },
                    ]}
                    id="plan"
                    name="plan"
                    label="Selecione seu plano"
                    value={formik.values.plan}
                    onChange={formik.handleChange}
                    error={!!formik.errors.plan}
                    helperText={formik.errors.plan}
                  />

                  <Checkbox
                    id="accept_terms"
                    name="accept_terms"
                    label={<p>Aceito os <a href="https://desenvolvedordeaplicativos.com.br/termos-e-condicoes" target="_blank" >Termos e Condições de serviço</a></p>}
                    checked={formik.values.accept_terms}
                    onChange={formik.handleChange}
                  />

                  <Button type="submit" style={{ width: "100%", margin: '0.8rem 0' }}>Solicitar Código Pix</Button>
                  <p>
                    <small>
                      Já é cadastrado?
                    </small>
                  </p>
                  <Button onClick={() => {
                    setOpen(false)
                    setQrCode('')
                    formik.resetForm()
                    handleDownloadApp()
                  }}
                    type="button"
                    style={{ width: "100%", margin: '0.8rem 0' }}
                    transparent>
                    <FaDownload />
                    Baixe o app
                  </Button>
                </form>
              </>
            )
          }
        </div>
      </Modal>
      <header
        className={`${styles.header} ${offset > 50 ? styles.headerFloating : ""
          }`}
      >
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FaWhatsapp color="#25d366" /> <span style={{ color: "#25d366" }}>WhatsApp</span><span style={{ color: '#075e54' }}>Sender</span>
        </h2>
        <div className={styles.container}>
          <div className={styles.navItems}>
            <button onClick={() => setOpen(true)} className={styles.navItem}>
              Cadastre-se agora!
            </button>
            {/* <Link to={'/blog'} className={styles.navItem}>
              Blog
            </Link> */}
            <button onClick={handleDownloadApp} className={styles.navItemDestaque}>
              <FaDownload />
              Baixar App
            </button>
          </div>

          <button className={styles.roundedButton} onClick={handleIsShowMenu}>
            <FaBars size={18} />
          </button>
          {isShow && (
            <div className={styles.menuItems}>
              <button className={styles.menuItem}>
                Cadastre-se agora!
              </button>
              {/* <button className={styles.menuItem}>
                Blog
              </button> */}
              <button onClick={handleDownloadApp} className={styles.menuItem}>
                <FaDownload />
                Baixar App
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
