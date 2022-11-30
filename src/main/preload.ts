import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import puppeteer from 'puppeteer';

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
  initiateSendProcess: async (rows: any[], message: string) => {

    log("Iniciando instancia do navegador")
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox',  '--disable-setuid-sandbox', '--no-sandbox', '--disable-dev-shm-usage', '--start-maximized', '--window-size=1200,700'],
      defaultViewport: {
        width: 1200,
        height: 700
      }
    });

    try {
      const [page] = await browser.pages();
      log("Abrindo Login Whatsapp")

      await page.goto(`https://web.whatsapp.com/`, { waitUntil: 'networkidle2' })

      log("Aguardando Validar a página de inicio")
      const result = await page.waitForSelector("h1[data-testid='intro-title']", { visible: true, timeout: 0 })

      log("Inicio aberto")

      if (result) {
        let newRows = []
        for (const contact of rows) {
          log("Abrindo contato")
          await page.goto(`https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(/\D/g, "")}&amp;text&amp;type=phone_number&amp;app_absent=0`)

          log("Verificando se tem mensagem de erro")
          const hasPopUpMessage = await page.waitForSelector("div[data-testid='confirm-popup']", { visible: true, timeout: 30000 })

          if (hasPopUpMessage) {
            const element = await page.$('div[data-testid="popup-contents"]');
            const text = await page.evaluate(element => element.textContent, element);

            log("Houve mensagem de erro")
            log(text)

            await delay(3000);

            newRows.push({
              ...contact,
              statusInfo: text
            })
          } else {
            log("Procurando input")
            await page.waitForSelector("p.selectable-text.copyable-text", { visible: true, timeout: 1000000 })

            log("Inserindo texto")

            const finalMessage = message.replaceAll("{primeiroNome}", contact.name.split(" ")[0])
              .replaceAll("{nomeCompleto}", contact.name)
              .replaceAll("{telefone}", contact.phone)

            await delay(3000);

            await page.type("p.selectable-text.copyable-text", finalMessage)

            await delay(3000);

            log("Procurando botão")
            await page.waitForSelector("button[data-testid='compose-btn-send']", { visible: true, timeout: 1000000 })
            log("Clicando em enviar")

            await page.click("button[data-testid='compose-btn-send']");
            await delay(5000)

            newRows.push({
              ...contact,
              status: true,
              statusInfo: "Mensagem enviada!"
            })

            log("Confirmando recarregamento da página")
            await page.keyboard.press('Enter');
          }
        }

        page.close()
        browser.close()
        browser.process()?.kill('SIGKILL');

        return {
          rows: newRows,
          status: true
        };

      } else {

        page.close()
        browser.close()
        browser.process()?.kill('SIGKILL');

        return {
          rows,
          status: false
        }
      }

    } catch (error) {
      console.log("Estou aqui", error)
      log("Houve um erro e fechamos o navegador")

      browser.close()
      browser.process()?.kill('SIGKILL');

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
