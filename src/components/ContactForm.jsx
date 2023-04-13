import React from "react";
import { useState } from "react";
import { useConversion } from "../hooks/useConversion";
import styles from "../styles/components/ContactForm.module.css";
import Button from "./Button";
import Input from "./Input";
import Textarea from "./Textarea";

export default function ContactForm({ location = "" }) {
  const { conversion } = useConversion();
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState("");
  const [errormsg, seterrormsg] = useState("");

  function ValidateFields() {
    if (name === "") {
      seterrormsg("Nome não foi digitado!");
      return false;
    }
    if (phone === "") {
      seterrormsg("Número não foi digitado!");
      return false;
    }
    if (phone.length < 15) {
      seterrormsg("O Formato do numero digitado está incorreto!");
      return false;
    }
    if (email === "") {
      seterrormsg("Email não foi digitado!");
      return false;
    }
    if (message === "") {
      seterrormsg("Email não foi digitado!");
      return false;
    }
    return true;
  }

  async function handleSendMessage() {
    if (!ValidateFields()) return;

    let myIp;

    await fetch("https://api.ipify.org/?format=json")
      .then((results) => results.json())
      .then((data) => {
        myIp = data.ip;
      });

    const isConversionSaved = await conversion(
      name,
      email,
      `Form de Contato - ${location}`,
      phone,
      myIp,
      window.location.href,
      message
    );

    if (!isConversionSaved)
      seterrormsg(
        "Houve um problema ao enviar sua mensagem! Tente novamente mais tarde"
      );

    seterrormsg("");
    setname("");
    setphone("");
    setemail("");
    setmessage("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Entre em contato</h2>
        <p>
          Ficou com duvidas ou quer conversar mais?
          <br />
          Use o formulário a baixo para enviar mensagens para nós
        </p>
        <div className={styles.form}>
          {errormsg !== "" && <p className={styles.errorMessage}>{errormsg}</p>}
          <Input
            id={"name"}
            label={"Nome"}
            placeholder={"Digite seu nome"}
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <Input
            id={"phone"}
            label={"Telefone"}
            placeholder={"(00) 00000-0000"}
            value={phone}
            onChange={(e) => setphone(e.target.value)}
          />
          <Input
            id={"email"}
            label={"Email"}
            placeholder={"doguinho@petmail.com"}
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <Textarea
            id={"message"}
            label={"Mensagem"}
            placeholder={"Queria saber sobre..."}
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            rows={4}
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </div>
    </div>
  );
}
