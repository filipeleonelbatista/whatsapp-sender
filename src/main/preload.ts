import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Browser, Builder, By, until, Key } from 'selenium-webdriver';
import fs from 'fs'

export type Channels = 'ipc-example';

interface Contact {
  name: string;
  phone: string;
  var1: string;
  var2: string;
  var3: string;
}

interface TimerConfiguration {
  start: number,
  initiate_send: number,
  check_error: number,
  send_message: number,
  finalize_send: number,
}

interface ExtractionObject {
  id: string;
  name: string;
  phone: string;
}

const log = (message: string) => {
  console.log(message)
  ipcRenderer.send('ipc-example', [message])
}

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

let GlobalDriver: any;

contextBridge.exposeInMainWorld('electron', {
  checkFilePath: (path: string) => {
    return fs.existsSync(path)
  },
  extractContacts: async (group_name: string, config: TimerConfiguration) => {
    let contacts_extracted: ExtractionObject[] = []

    log("Iniciando instancia do navegador")
    const initiated_at = Date.now()
    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    log("Abrindo Login Whatsapp")
    await driver.get(`https://web.whatsapp.com/`)

    try {
      log("Aguardando Validar a página de inicio")
      const result = await driver.wait(until.elementLocated(By.css("h1[data-testid='intro-title']")));

      log("Autenticado")
      await delay(config.start);

      log("Procurando grupo")
      const group = await driver.wait(until.elementLocated(By.css(`span[title='${group_name}']`)));

      log("Abrindo o grupo")
      group.click()

      log("Clicando em informações")
      const groupInfoTitle = await driver.wait(until.elementLocated(By.css("span[data-testid='conversation-info-header-chat-title']")));
      groupInfoTitle.click();


      log("Obtendo total de participantes")
      const participants = await driver.wait(until.elementLocated(By.css("div[data-testid='section-participants'] span[class='x2dsD _1lF7t bze30y65 a4ywakfo']")));
      const pq = await participants.getAttribute("value")
      console.log("participants", participants)
      log(`Aqui está o total de participantes ${pq}`)

    } catch (error) {

    }



    return contacts_extracted
  },
  createGlobalInstanceOfDriver: async () => {
    GlobalDriver = new Builder().forBrowser(Browser.CHROME).build();
  },
  loginWhatsapp: async (config: TimerConfiguration) => {
    log("Abrindo Login Whatsapp")
    await GlobalDriver.get(`https://web.whatsapp.com/`)

    log("Aguardando Validar a página de inicio")
    await GlobalDriver.wait(until.elementLocated(By.css("h1[data-testid='intro-title']")));
    log("Autenticado")
    await delay(config.start);
  },
  closeGlobalInstanceOfDriver: async () => {
    await GlobalDriver.quit();
  },
  sendMessage: async (contact: Contact, message: string, attachments: File[], config: TimerConfiguration) => {
    try {
      let finalMessage = message.replaceAll("{primeiroNome}", contact.name.split(" ")[0])
        .replaceAll("{nomeCompleto}", contact.name)
        .replaceAll("{telefone}", contact.phone)
        .replaceAll("{var1}", contact.var1)
        .replaceAll("{var2}", contact.var2)
        .replaceAll("{var3}", contact.var3)

      await GlobalDriver.get(`https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(/\D/g, "")}&text=${encodeURI(finalMessage)}&amp;text&amp;type=phone_number&amp;app_absent=0`)

      await delay(config.initiate_send);
      log("Verificando se tem mensagem de erro")
      await GlobalDriver.wait(until.elementLocated(By.css("div[data-testid='confirm-popup']")), 10000);
      await delay(config.check_error);

      const element = await GlobalDriver.findElement(By.css('div[data-testid="popup-contents"]'))
      const text = await element.getText()

      log("Houve mensagem de erro")
      log(text)

      await delay(config.finalize_send);

      return {
        status: false,
        error: text,
      }
    } catch (error) {

      log("Procurando botão para enviar mensagem")
      await delay(config.send_message);
      const sendButton = await GlobalDriver.wait(until.elementLocated(By.css("button[data-testid='compose-btn-send']")));
      await delay(300);
      sendButton.click();

      if (attachments.length > 0) {
        log("Enviando arquivos")
        for (const file of attachments) {
          log("Procurando botão clip")
          const clipButton = await GlobalDriver.wait(until.elementLocated(By.css("div[data-testid='conversation-clip']")));
          clipButton.click();

          await delay(config.send_message);

          const selectButtonByTypes = (file.type === 'image/png' || file.type === 'image/jpg') ? "button[aria-label='Fotos e vídeos']" : "button[aria-label='Documento']"

          log("Procurando botão de anexar o tipo")
          const attachButton = await GlobalDriver.wait(until.elementLocated(By.css(selectButtonByTypes)));
          log("Inserindo anexo")
          const inputElement = await attachButton.findElement(By.css(`input`))
          inputElement.sendKeys(file.path)

          await delay(config.send_message);

          log("Procurando botão para enviar anexo")
          const sendImageButton = await GlobalDriver.wait(until.elementLocated(By.css("span[data-testid='send']")));
          sendImageButton.click();
          await delay(config.send_message);
        }
      }
      log("Finalizei o envio")
      await delay(config.send_message);
      return {
        status: true,
        error: 'false'
      }
    }
  },
  initiateSendProcess: async (rows: any[], message: string, images: any[], isNewLineReturnCharacter: boolean, config: TimerConfiguration) => {
    log("Iniciando instancia do navegador")
    const initiated_at = Date.now()

    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    try {
      log("Abrindo Login Whatsapp")
      await driver.get(`https://web.whatsapp.com/`)

      log("Aguardando Validar a página de inicio")
      const result = await driver.wait(until.elementLocated(By.css("h1[data-testid='intro-title']")));
      log("Autenticado")
      await delay(config.start);

      if (result) {
        let newRows = []
        for (const contact of rows) {
          log("Abrindo contato")
          if (!isNewLineReturnCharacter) {
            let finalMessage = message.replaceAll("{primeiroNome}", contact.name.split(" ")[0])
              .replaceAll("{nomeCompleto}", contact.name)
              .replaceAll("{telefone}", contact.phone)
              .replaceAll("{var1}", contact.var1)
              .replaceAll("{var2}", contact.var2)
              .replaceAll("{var3}", contact.var3)

            await driver.get(`https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(/\D/g, "")}&text=${encodeURI(finalMessage)}&amp;text&amp;type=phone_number&amp;app_absent=0`)
          } else {
            await driver.get(`https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(/\D/g, "")}&amp;text&amp;type=phone_number&amp;app_absent=0`)
          }
          await delay(config.initiate_send);

          try {
            log("Verificando se tem mensagem de erro")
            await driver.wait(until.elementLocated(By.css("div[data-testid='confirm-popup']")), 10000);
            await delay(config.check_error);

            const element = await driver.findElement(By.css('div[data-testid="popup-contents"]'))
            const text = await element.getText()

            log("Houve mensagem de erro")
            log(text)

            await delay(config.finalize_send);

            newRows.push({
              ...contact,
              statusInfo: text
            })
          } catch (error) {

            if (!isNewLineReturnCharacter) {
              log("Procurando botão para enviar mensagem")
              await delay(config.send_message);
              const sendButton = await driver.wait(until.elementLocated(By.css("button[data-testid='compose-btn-send']")));
              sendButton.click();
            } else {
              log("Procurando input")
              const input = await driver.wait(until.elementLocated(By.css("p.selectable-text.copyable-text")));

              log("Inserindo texto")
              let finalMessage = message.replaceAll("{primeiroNome}", contact.name.split(" ")[0])
                .replaceAll("{nomeCompleto}", contact.name)
                .replaceAll("{telefone}", contact.phone)
                .replaceAll("{var1}", contact.var1)
                .replaceAll("{var2}", contact.var2)
                .replaceAll("{var3}", contact.var3)

              input.click()

              const finalMessageArray = finalMessage.split("\n")

              for (const message of finalMessageArray) {
                input.sendKeys(message);
                await delay(config.send_message);
                input.sendKeys(isNewLineReturnCharacter ? Key.ENTER : Key.chord(Key.SHIFT, Key.ENTER));
                await delay(config.send_message);
              }
            }

            if (images.length > 0) {
              log("Enviando imagens anexadas")
              for (const image of images) {
                log("Procurando botão clipe")
                const clipButton = await driver.wait(until.elementLocated(By.css("div[data-testid='conversation-clip']")));
                clipButton.click();

                await delay(config.send_message);

                log("Procurando botão anexar imagens")
                const attachButton = await driver.wait(until.elementLocated(By.css("button[aria-label='Fotos e vídeos']")));
                log("Inserindo imagem")
                const inputElement = await attachButton.findElement(By.css(`input`))
                inputElement.sendKeys(image.path)

                await delay(config.send_message);

                log("Procurando botão para enviar imagem")
                const sendImageButton = await driver.wait(until.elementLocated(By.css("span[data-testid='send']")));
                sendImageButton.click();
                await delay(config.send_message);
              }
            }

            newRows.push({
              ...contact,
              status: true,
              statusInfo: "Mensagem enviada!"
            })
          }
        }

        await delay(config.finalize_send);

        await driver.quit();
        return {
          rows: newRows,
          message,
          status: true,
          initiated_at,
          finalized_at: Date.now()
        };
      } else {
        await driver.quit();
        return {
          rows: rows,
          message,
          error: "Não foi possivel autenticar",
          status: false,
          initiated_at,
          finalized_at: Date.now()
        };
      }
    } catch (error) {
      console.log("Estou aqui", error)
      log("Houve um erro e fechamos o navegador")

      await driver.quit();

      return {
        rows,
        error,
        message,
        status: false,
        initiated_at,
        finalized_at: Date.now()
      }
    }
  },
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
