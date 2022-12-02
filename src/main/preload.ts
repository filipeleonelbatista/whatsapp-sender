import { contextBridge, ipcRenderer, IpcRendererEvent, nativeTheme } from 'electron';
import { Browser, Builder, By, until } from 'selenium-webdriver';

export type Channels = 'ipc-example';

const log = (message: string) => {
  console.log(message)
  ipcRenderer.send('ipc-example', [message])
}

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

contextBridge.exposeInMainWorld('electron', {
  initiateSendProcess: async (rows: any[], message: string, images: any[]) => {
    log("Iniciando instancia do navegador")
    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    try {
      log("Abrindo Login Whatsapp")
      await driver.get(`https://web.whatsapp.com/`)

      log("Aguardando Validar a página de inicio")
      const result = await driver.wait(until.elementLocated(By.css("h1[data-testid='intro-title']")));
      log("Autenticado")
      await delay(5000);

      if (result) {
        let newRows = []
        for (const contact of rows) {
          log("Abrindo contato")
          await driver.get(`https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(/\D/g, "")}&amp;text&amp;type=phone_number&amp;app_absent=0`)
          await delay(5000);

          try {
            log("Verificando se tem mensagem de erro")
            await driver.wait(until.elementLocated(By.css("div[data-testid='confirm-popup']")), 10000);
            await delay(2000);

            const element = await driver.findElement(By.css('div[data-testid="popup-contents"]'))
            const text = await element.getText()

            log("Houve mensagem de erro")
            log(text)

            await delay(3000);

            newRows.push({
              ...contact,
              statusInfo: text
            })
          } catch (error) {
            log("Procurando input")
            const input = await driver.wait(until.elementLocated(By.css("p.selectable-text.copyable-text")));

            log("Inserindo texto")
            const finalMessage = message.replaceAll("{primeiroNome}", contact.name.split(" ")[0])
              .replaceAll("{nomeCompleto}", contact.name)
              .replaceAll("{telefone}", contact.phone);

            input.click()
            input.sendKeys(finalMessage);

            await delay(3000);

            log("Procurando botão para enviar mensagem")
            const sendButton = await driver.wait(until.elementLocated(By.css("button[data-testid='compose-btn-send']")));
            sendButton.click();

            if (images.length > 0) {
              log("Enviando imagens anexadas")
              for (const image of images) {
                log("Procurando botão clipe")
                const clipButton = await driver.wait(until.elementLocated(By.css("div[data-testid='conversation-clip']")));
                clipButton.click();

                await delay(1500);

                log("Procurando botão anexar imagens")
                const attachButton = await driver.wait(until.elementLocated(By.css("button[aria-label='Fotos e vídeos']")));
                log("Inserindo imagem")
                const inputElement = await attachButton.findElement(By.css(`input`))
                inputElement.sendKeys(image.path)

                await delay(1500);

                log("Procurando botão para enviar imagem")
                const sendImageButton = await driver.wait(until.elementLocated(By.css("span[data-testid='send']")));
                sendImageButton.click();
                await delay(1500);
              }
            }

            await delay(5000);

            newRows.push({
              ...contact,
              status: true,
              statusInfo: "Mensagem enviada!"
            })
          }
        }
        await driver.quit();
        return {
          rows: newRows,
          status: true
        };
      } else {
        await driver.quit();
        return {
          rows: rows,
          status: false
        };
      }
    } catch (error) {
      console.log("Estou aqui", error)
      log("Houve um erro e fechamos o navegador")

      await driver.quit();

      return {
        rows,
        error,
        status: false
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
