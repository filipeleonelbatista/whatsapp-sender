import { useEffect, useState } from "react";
import styles from "../styles/components/AcceptTerms.module.css";
import Button from "./Button";

const AcceptTerms = () => {
  const [isShow, setIsShow] = useState(false);

  const handleAccept = () => {
    localStorage.setItem("terms", true);
    setIsShow(false);
  };

  useEffect(() => {
    const termsAcepted = localStorage.getItem("terms");
    if (termsAcepted === null) {
      setIsShow(true);
    }
    setIsShow(!termsAcepted === true);
  }, []);

  if (!isShow) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <small>
          Nós utilizamos cookies e outras tecnologias semelhantes para melhorar
          sua experiência em nossos serviços e recomendar conteúdos de seu
          interesse. Ao utilizar nossos serviços você concorda com tal
          monitoramento. Conheça melhor nossos{" "}
          <b>
            <a
              href="https://cadastrapet.com.br/termos-e-condicoes"
              rel="noreferrer noopener"
              target="_blank"
            >
              Termos e Condições
            </a>
          </b>{" "}
          e{" "}
          <b>
            <a
              href="https://cadastrapet.com.br/politicas-de-privacidade"
              rel="noreferrer noopener"
              target="_blank"
            >
              Políticas de Privacidade.
            </a>
          </b>
        </small>
        <Button onClick={handleAccept}>Concordo</Button>
      </div>
    </div>
  );
};

export default AcceptTerms;
