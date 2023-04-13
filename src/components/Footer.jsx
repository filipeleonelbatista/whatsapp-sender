import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/components/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FaWhatsapp /> WhatsAppSender
        </h2>
        <p>&copy; {new Date(Date.now()).getFullYear()} - <FaWhatsapp /> WhatsAppSender</p>
        <p>Todos os direitos reservados</p>
      </div>
      <div className={styles.socialNetworks}>
        <a href="https://instagram.com/envio.de.mensagens">
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
}
