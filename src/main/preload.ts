import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import fs from "fs";
import path from "path";
import { Browser, Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

import * as remote from "@electron/remote";

export type Channels = "ipc-example";

interface Contact {
  name: string;
  phone: string;
  var1: string;
  var2: string;
  var3: string;
}

interface TimerConfiguration {
  start: number;
  initiate_send: number;
  check_error: number;
  send_message: number;
  send_attachment: number;
  finalize_send: number;
  new_whatsapp_send_button: boolean;
}

interface ExtractionObject {
  id: string;
  name: string;
  phone: string;
}

const log = (message: string) => {
  console.log(message);
  ipcRenderer.send("ipc-example", [message]);
};

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const chromeDriverPath = "C:\\whatsappsenderchromedriver\\chromedriver.exe";

let GlobalDriver: any;

function criarPastaNoDiretorioDeInstalacao(nomeDaPasta: string) {
  const diretorioDeInstalacao = remote.app.getAppPath();

  const caminhoDaPasta = path.join(
    diretorioDeInstalacao,
    "instances",
    nomeDaPasta,
  );

  if (!fs.existsSync(caminhoDaPasta)) {
    fs.mkdirSync(caminhoDaPasta);
  }

  return caminhoDaPasta;
}

const createInstanceOfWhatsApp = async (instanceInfo: {
  id: string;
  name: string;
  createdAt: number;
}) => {
  const destinationPath = criarPastaNoDiretorioDeInstalacao(instanceInfo.id);

  const options = new chrome.Options();
  options.addArguments(`--user-data-dir=${destinationPath}`);

  const instancedDriver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
    .build();

  log("Abrindo Login Whatsapp");
  await instancedDriver.get(`https://web.whatsapp.com/`);

  log("Aguardando Validar a página de inicio");
  await instancedDriver.wait(
    until.elementLocated(By.css("span[data-icon='lock-small']")),
    2 * 60 * 1000,
  );
  log("Autenticado");
  await delay(3000);

  instancedDriver.quit();
};

const testInstance = async (id: string) => {
  const diretorioDeInstalacao = remote.app.getAppPath();

  const destinationPath = path.join(diretorioDeInstalacao, "instances", id);

  const options = new chrome.Options();
  options.addArguments(`--user-data-dir=${destinationPath}`);

  const instancedDriver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
    .build();

  log("Abrindo Login Whatsapp");
  await instancedDriver.get(`https://web.whatsapp.com/`);

  log("Aguardando Validar a página de inicio");
  await instancedDriver.wait(
    until.elementLocated(By.css("span[data-icon='lock-small']")),
    60 * 1000,
  );
  log("Autenticado");
  await delay(3000);

  instancedDriver.quit();
};

contextBridge.exposeInMainWorld("electron", {
  testInstance: testInstance,
  createInstanceOfWhatsApp: createInstanceOfWhatsApp,
  createGlobalInstanceOfDriver: async () => {
    GlobalDriver = new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(new chrome.Options())
      .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
      .build();
  },
  loginWhatsapp: async (config: TimerConfiguration) => {
    log("Abrindo Login Whatsapp");
    await GlobalDriver.get(`https://web.whatsapp.com/`);

    log("Aguardando Validar a página de inicio");
    await GlobalDriver.wait(
      until.elementLocated(By.css("span[data-icon='lock-small']")),
      config.start,
    );
    log("Autenticado");
    await delay(config.start);
  },
  closeGlobalInstanceOfDriver: async () => {
    await GlobalDriver.quit();
  },
  sendMessage: async (
    contact: Contact,
    message: string,
    attachments: any[],
    config: TimerConfiguration,
  ) => {
    try {
      let finalMessage = message
        .replaceAll("{primeiroNome}", contact.name.split(" ")[0])
        .replaceAll("{nomeCompleto}", contact.name)
        .replaceAll("{telefone}", contact.phone)
        .replaceAll("{var1}", contact.var1)
        .replaceAll("{var2}", contact.var2)
        .replaceAll("{var3}", contact.var3);

      await GlobalDriver.get(
        `https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(
          /\D/g,
          "",
        )}&text=${encodeURI(finalMessage)
          .replace(/&/g, "%26")
          .replace(
            /\+/g,
            "%2B",
          )}&amp;text&amp;type=phone_number&amp;app_absent=0`,
      );

      await delay(config.initiate_send);
      log("Verificando se tem mensagem de erro");
      await GlobalDriver.wait(
        until.elementLocated(By.css("div[role='dialog']")),
        config.check_error,
      );

      const element = await GlobalDriver.findElement(
        By.css("div[role='dialog'] div div div"),
      );
      const text = await element.getText();

      log("Houve mensagem de erro");
      log(text);

      await delay(config.finalize_send);

      return {
        status: false,
        error: text,
      };
    } catch (error) {
      log("Procurando botão para enviar mensagem");
      await delay(config.send_message);
      const sendButton = await GlobalDriver.wait(
        until.elementLocated(By.css("span[data-icon='send']")),
        config.send_message,
      );

      sendButton.click();

      if (attachments.length > 0) {
        log("Enviando arquivos");

        const tiposImagemSuportados = [
          "jpeg",
          "jpg",
          "png",
          "gif",
          "bmp",
          "tiff",
          "webp",
        ];
        const tiposVideoSuportados = [
          "mp4",
          "mov",
          "avi",
          "3gp",
          "wmv",
          "mkv",
          "mp3",
          "ogg",
          "wav",
          "wma",
        ];

        for (const file of attachments) {
          log("Procurando novo botão drop up");
          const attachMenuPlus = await GlobalDriver.wait(
            until.elementLocated(By.css("span[data-icon='attach-menu-plus']")),
            config.send_message,
          );
          attachMenuPlus.click();

          await delay(config.send_message);

          const isImageOrVideo =
            tiposImagemSuportados.includes(
              file.name.split(".").pop().toLowerCase(),
            ) ||
            tiposVideoSuportados.includes(
              file.name.split(".").pop().toLowerCase(),
            );

          const selectButtonByTypes = isImageOrVideo
            ? "input[accept*='image/*'][accept*='video/mp4'][accept*='video/3gpp'][accept*='video/quicktime']"
            : "input[accept*='*']";

          log("Procurando input de anexar por tipo");
          const attachInput = await GlobalDriver.wait(
            until.elementLocated(By.css(selectButtonByTypes)),
            config.send_message,
          );

          log("Inserindo anexo");
          attachInput.sendKeys(file.path);

          log("Procurando botão para enviar anexo");
          const sendImageButton = await GlobalDriver.wait(
            until.elementLocated(By.css("span[data-icon='send']")),
            config.send_message,
          );
          sendImageButton.click();

          await delay(config.send_attachment);
        }
      }
      log("Finalizei o envio");
      await delay(config.send_message);
      return {
        status: true,
        error: "false",
      };
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
