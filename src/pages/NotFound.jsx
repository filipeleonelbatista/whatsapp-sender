import { FaWhatsapp } from "react-icons/fa";
import styles from "../styles/pages/NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FaWhatsapp color="#25d366" /> <span style={{ color: "#25d366" }}>WhatsApp</span><span style={{ color: '#075e54' }}>Sender</span>
        </h2>
        <h1>404</h1>
        <p>Esta página não foi encontrada</p>
      </div>
    </div>
  );
}

export default NotFound;
