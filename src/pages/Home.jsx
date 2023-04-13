import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import AcceptTerms from "../components/AcceptTerms";
import ContactSection from "../components/ContactSection";
import Floating from "../components/Floating";
import Footer from "../components/Footer";
import HomeNavigation from "../components/HomeNavigation";
import styles from "../styles/pages/Home.module.css";
import { isStringEmpty } from "../utils/string";
import emailjs from '@emailjs/browser'

function Home() {
  const navigate = useNavigate();

  const [isShow, setIsShow] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [isSendedMessage, setIsSendedMessage] = useState(false);
  const [name, setname] = useState("");
  const [telefone, settelefone] = useState("");
  const [email, setemail] = useState("");

  function handleDownloadApp() {
    console.log("Baixar o app")
    window.open(window.location.href + 'WhatsAppSenderBot.Setup.4.7.0.exe', '_blank')
  }

  function handleToggleModal() {
    const isContacted = localStorage.getItem("contact");

    if (isContacted) {
      setIsShow(false);
      return;
    }

    if (!isClose) {
      if (isSendedMessage) {
        alert(
          "Seu cadastro já foi realizado, aguarde nosso email de contato. Obrigado!"
        );
      } else {
        setIsShow(true);
      }
    } else {
      setIsShow(false);
    }
  }

  function handleMaskPhoneNumber(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }

  const ValidateFields = () => {
    if (isStringEmpty(name)) {
      alert("O campo nome não foi preenchido");
      return true;
    }
    if (telefone.length < 15) {
      if (isStringEmpty(telefone)) {
        alert("O campo Telefone não foi preenchido");
        return true;
      } else {
        alert("O campo Telefone não está completo");
        return true;
      }
    }
    if (isStringEmpty(email)) {
      alert("O campo Email não foi preenchido");
      return true;
    }
  };

  async function handleForm() {
    if (ValidateFields()) return;

    emailjs.send('service_4o2awb7', 'template_tjvp20c', {
      name,
      phone: telefone,
      email,
      message: "Gostaria de receber conteúdos sobre os cuidados nos envios de mensagem em massa."
    }, 'user_y1zamkr7P7dPydkNhdhxi').then((res) => {
      console.log("Sucesso", res)
      alert("Sua mensagem foi enviada com sucesso")
    }, (err) => {
      console.log("ERRO", err)
      alert("Houve um erro ao enviar sua mensagem. Tente o contato pelo Whatsapp ou tente novamente mais tarde!")
    })

    setname("");
    settelefone("");
    setemail("");
    setIsSendedMessage(true);
    setIsClose(true);
    setIsShow(false);

    localStorage.setItem("contact", true);
    return;

  }

  return (
    <div
      id="landing-page"
      onMouseLeave={handleToggleModal}
      className={styles.container}
    >
      {isShow && (
        <div id="modal-cta" className={styles.modalCta}>
          <div className={styles.cardContainer}>
            <button
              onClick={() => {
                setIsClose(true);
                localStorage.setItem("contact", true);
                handleToggleModal();
              }}
              type="button"
              className={styles.closeButton}
            >
              X
            </button>
            <div className={styles.imageContainer}></div>
            <div className={styles.formContainer}>
              <h2>Não vá agora. Preparamos um conteúdo especial</h2>
              <p>
                Deixe seu email e Whatsapp que enviaremos pra você conteúdo
                especial sobre cuidados nos envios de mensagem em massa.
                É de graça e prometemos que não enviaremos Span.
              </p>

              <div>
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="telefone">Whatsapp</label>
                <input
                  type="text"
                  maxLength={15}
                  value={telefone}
                  onChange={(e) =>
                    settelefone(handleMaskPhoneNumber(e.target.value))
                  }
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
              <button onClick={handleForm}>Enviar</button>
            </div>
          </div>
        </div>
      )}
      <HomeNavigation />
      <main>
        {/* CTA */}
        <section id="cta" className={styles.cta}>
          <div className={styles.rowContent}>
            <div className={styles.content}>
              <p className={styles.toptitle}>ENVIE MENSAGENS COM A GENTE 👋</p>
              <h2>Enviar mensagens em massa não será mais um problema</h2>
              <u></u>
              <p className={styles.contentSubtitle}>
                Com o app você consegue enviar mensagens, salvar modelos de mensagens
                e listas, salvar listas de envios para usar em outros momentos e
                mais.
              </p>
              <button onClick={handleDownloadApp}>BAIXAR O APP AGORA</button>
            </div>
            <img
              className={[styles.hideImg, styles.ctaImg]}
              src="./images/landing/mockup-cta-2.png"
              alt=""
            />
          </div>
        </section>

        <div className={styles.ctaCards}>
          <div className={styles.ctaCard}>
            <h3>+139,3 Mi</h3>
            <p>Mensagens enviadas</p>
          </div>
          <div className={styles.ctaCard}>
            <h3>154,9 mil</h3>
            <p>
              Conversas efetivadas
              <br />
              <small>Retorno de mensagens enviadas</small>
            </p>
          </div>
          <div className={styles.ctaCard}>
            <h3>120,00 R$</h3>
            <p>Custo anual baixo</p>
          </div>
        </div>
        {/* CTA */}
        {/* features */}
        <section id="features" className={styles.features}>
          <p>SERVIÇOS</p>
          <h2>Como ajudamos você a enviar mensagens</h2>
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaCheck color="#075e54" />
              </div>
              <h2>Envio de mensagens</h2>
              <p>
                Envie mensagens diretamente e crie listas de envio para os seus contatos
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaCheck color="#075e54" />
              </div>
              <h2>Modelos de mensagens</h2>
              <p>Crie modelos pré definidos de mensagens para enviar quando quiser.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaCheck color="#075e54" />
              </div>
              <h2>Listas de contatos</h2>
              <p>
                Salve e crie novas listas de contatos para usar quando quiser nos envios.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaCheck color="#075e54" />
              </div>
              <h2>Históricos de envios</h2>
              <p>Tenha sempre acesso aos históricos de envios para não perder nenhuma venda.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaCheck color="#075e54" />
              </div>
              <h2>Pague pelo tempo que usar</h2>
              <p>
                Com planos mensais, semestrais e anuais, voce decide quando quer usar o app. sem custos adicionais e sem multas.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaCheck color="#075e54" />
              </div>
              <h2>Sem limites de envios</h2>
              <p>
                Envie mensagens para seus clientes sem se preocupar com limites.
              </p>
            </div>
          </div>
        </section>
        {/* features */}

        {/* testemonials */}
        {/* <section id="testemonials" className={styles.testemonials}>
          <p>DEPOIMENTOS</p>
          <h2>O que os clientes dizem sobre a CadastraPet</h2>
          <div className={styles.testemonialsList}>
            <div className={styles.testemonial}>
              <FaQuoteLeft color="#075e54" />
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
              <FaQuoteLeft color="#075e54" />
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
        <section id="contact" className={styles.contact}>
          <h2>Comece enviar mensagens agora mesmo</h2>
          <button onClick={handleDownloadApp}>Baixar o App</button>
        </section>
        {/* ctaContact */}
        {/* video */}
        <section id="video" className={styles.video}>
          <div className={styles.videoContainer}>
            <p className={styles.titleVideoContainer}>SOBRE NÓS</p>
            <h2>Entenda quem somos e por que existimos</h2>
            <p className={styles.aboutText}>
              A nossa empresa nasceu para pessoas que precisam se comunicar
              com muitos clientes, enviando suas comunicações de forma simples
              usando a tecnologia para alcançar seus objetivos e converter
              mais clientes.
              <br />
              <br />
              Com uma equipe empenhada a encontrar soluções que agregam aos clientes
              trazendo maiores resultados.
            </p>
            <button onClick={handleDownloadApp}>BAIXE O APP AGORA</button>
          </div>
          <div className={styles.videoIframe}>
            <ReactPlayer
              className={styles.videoIframe}
              url="./videos/Cadastrapet.mp4"
              width="100%"
              height="100%"
              controls={true}
            />
          </div>
        </section>
        {/* video */}
        <ContactSection location="Home" />
      </main>
      <Footer />
      <Floating location="tutor" />
      <AcceptTerms />
    </div>
  );
}

export default Home;
