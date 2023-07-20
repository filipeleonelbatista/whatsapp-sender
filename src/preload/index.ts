import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import fs from 'fs'
import { Browser, Builder, By, Key, until } from 'selenium-webdriver'

interface Contact {
  name: string
  phone: string
  var1: string
  var2: string
  var3: string
}

interface TimerConfiguration {
  start: number
  initiate_send: number
  check_error: number
  send_message: number
  send_attachment: number
  finalize_send: number
  new_whatsapp_send_button: boolean
}

interface ExtractionObject {
  id: string
  name: string
  phone: string
}

const log = (message: string): void => {
  console.log(message)
}

function delay(time: number): Promise<unknown> {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

let GlobalDriver: object

// Custom APIs for renderer
const api = {
  checkFilePath: (path: string): boolean => {
    return fs.existsSync(path)
  },
  extractContacts: async (
    group_name: string,
    config: TimerConfiguration
  ): Promise<ExtractionObject> => {
    const contacts_extracted: ExtractionObject[] = []

    log('Iniciando instancia do navegador')
    const driver = await new Builder().forBrowser(Browser.CHROME).build()

    log('Abrindo Login Whatsapp')
    await driver.get(`https://web.whatsapp.com/`)

    try {
      log('Aguardando Validar a página de inicio')
      await driver.wait(until.elementLocated(By.css("h1[data-testid='intro-title']")))

      log('Autenticado')
      await delay(config.start)

      log('Procurando grupo')
      const group = await driver.wait(until.elementLocated(By.css(`span[title='${group_name}']`)))

      log('Abrindo o grupo')
      group.click()

      log('Clicando em informações')
      const groupInfoTitle = await driver.wait(
        until.elementLocated(By.css("span[data-testid='conversation-info-header-chat-title']"))
      )
      groupInfoTitle.click()

      log('Obtendo total de participantes')
      const participants = await driver.wait(
        until.elementLocated(
          By.css(
            "div[data-testid='section-participants'] span[class='x2dsD _1lF7t bze30y65 a4ywakfo']"
          )
        )
      )
      const pq = await participants.getAttribute('value')
      console.log('participants', participants)
      log(`Aqui está o total de participantes ${pq}`)
    } catch (error) {
      console.log('error', error)
    }

    return contacts_extracted
  },
  createGlobalInstanceOfDriver: async (): Promise<void> => {
    GlobalDriver = new Builder().forBrowser(Browser.CHROME).build()
  },
  loginWhatsapp: async (config: TimerConfiguration): Promise<void> => {
    log('Abrindo Login Whatsapp')
    await GlobalDriver.get(`https://web.whatsapp.com/`)

    log('Aguardando Validar a página de inicio')
    await GlobalDriver.wait(until.elementLocated(By.css("h1[data-testid='intro-title']")))
    log('Autenticado')
    await delay(config.start)
  },
  closeGlobalInstanceOfDriver: async (): Promise<void> => {
    await GlobalDriver.quit()
  },
  sendMessage: async (
    contact: Contact,
    message: string,
    attachments: Array<object>,
    config: TimerConfiguration
  ): Promise<{
    status: boolean
    error: string
  }> => {
    try {
      const finalMessage = message
        .replaceAll('{primeiroNome}', contact.name.split(' ')[0])
        .replaceAll('{nomeCompleto}', contact.name)
        .replaceAll('{telefone}', contact.phone)
        .replaceAll('{var1}', contact.var1)
        .replaceAll('{var2}', contact.var2)
        .replaceAll('{var3}', contact.var3)

      await GlobalDriver.get(
        `https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(
          /\D/g,
          ''
        )}&text=${encodeURI(finalMessage)
          .replace(/&/g, '%26')
          .replace(/\+/g, '%2B')}&amp;text&amp;type=phone_number&amp;app_absent=0`
      )

      await delay(config.initiate_send)
      log('Verificando se tem mensagem de erro')
      await GlobalDriver.wait(
        until.elementLocated(By.css("div[data-testid='confirm-popup']")),
        10000
      )
      await delay(config.check_error)

      const element = await GlobalDriver.findElement(By.css('div[data-testid="popup-contents"]'))
      const text = await element.getText()

      log('Houve mensagem de erro')
      log(text)

      await delay(config.finalize_send)

      return {
        status: false,
        error: text
      }
    } catch (error) {
      log('Procurando botão para enviar mensagem')
      await delay(config.send_message)
      const sendButton = await GlobalDriver.wait(
        until.elementLocated(By.css("button[data-testid='compose-btn-send']"))
      )
      await delay(config.send_message)
      sendButton.click()

      if (attachments.length > 0) {
        log('Enviando arquivos')

        const tiposImagemSuportados = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp']
        const tiposVideoSuportados = ['mp4', 'mov', 'avi', '3gp', 'wmv', 'mkv']

        for (const file of attachments) {
          if (config.new_whatsapp_send_button) {
            log('Procurando novo botão drop up')
            const attachMenuPlus = await GlobalDriver.wait(
              until.elementLocated(By.css("span[data-testid='attach-menu-plus']"))
            )
            attachMenuPlus.click()

            await delay(config.send_message)

            const isImageOrVideo =
              tiposImagemSuportados.includes(file.name.split('.').pop().toLowerCase()) ||
              tiposVideoSuportados.includes(file.name.split('.').pop().toLowerCase())

            const selectButtonByTypes = isImageOrVideo
              ? "li[data-testid='mi-attach-media']"
              : "li[data-testid='mi-attach-document']"

            log(
              `BOTÃO SELECIONADO: ${selectButtonByTypes}, é imagem ou video? ${file.isImageOrVideo}`
            )
            log('Procurando botão de anexar o tipo')
            const attachButton = await GlobalDriver.wait(
              until.elementLocated(By.css(selectButtonByTypes))
            )

            log('Inserindo anexo')
            const inputElement = await attachButton.findElement(By.css(`input`))
            inputElement.sendKeys(file.path)
          } else {
            log('Procurando botão clip')
            const clipButton = await GlobalDriver.wait(
              until.elementLocated(By.css("div[data-testid='conversation-clip']"))
            )
            clipButton.click()

            await delay(config.send_message)

            const isImageOrVideo =
              tiposImagemSuportados.includes(file.name.split('.').pop().toLowerCase()) ||
              tiposVideoSuportados.includes(file.name.split('.').pop().toLowerCase())
            console.log('TO AQUI', isImageOrVideo, file)
            const selectButtonByTypes = isImageOrVideo
              ? "button[aria-label='Fotos e vídeos']"
              : "button[aria-label='Documento']"

            log(
              `BOTÃO SELECIONADO: ${selectButtonByTypes}, é imagem ou video? ${file.isImageOrVideo}`
            )
            log('Procurando botão de anexar o tipo')
            const attachButton = await GlobalDriver.wait(
              until.elementLocated(By.css(selectButtonByTypes))
            )
            log('Inserindo anexo')
            const inputElement = await attachButton.findElement(By.css(`input`))
            inputElement.sendKeys(file.path)
          }

          await delay(config.send_message)

          log('Procurando botão para enviar anexo')
          const sendImageButton = await GlobalDriver.wait(
            until.elementLocated(By.css("span[data-testid='send']"))
          )
          sendImageButton.click()
          await delay(config.send_attachment)
        }
      }
      log('Finalizei o envio')
      await delay(config.send_message)
      return {
        status: true,
        error: 'false'
      }
    }
  },
  initiateSendProcess: async (
    rows: Array<object>,
    message: string,
    images: Array<object>,
    isNewLineReturnCharacter: boolean,
    config: TimerConfiguration
  ): Promise<object> => {
    log('Iniciando instancia do navegador')
    const initiated_at = Date.now()

    const driver = await new Builder().forBrowser(Browser.CHROME).build()

    try {
      log('Abrindo Login Whatsapp')
      await driver.get(`https://web.whatsapp.com/`)

      log('Aguardando Validar a página de inicio')
      const result = await driver.wait(
        until.elementLocated(By.css("h1[data-testid='intro-title']"))
      )
      log('Autenticado')
      await delay(config.start)

      if (result) {
        const newRows = []
        for (const contact of rows) {
          log('Abrindo contato')
          if (!isNewLineReturnCharacter) {
            const finalMessage = message
              .replaceAll('{primeiroNome}', contact.name.split(' ')[0])
              .replaceAll('{nomeCompleto}', contact.name)
              .replaceAll('{telefone}', contact.phone)
              .replaceAll('{var1}', contact.var1)
              .replaceAll('{var2}', contact.var2)
              .replaceAll('{var3}', contact.var3)

            await driver.get(
              `https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(
                /\D/g,
                ''
              )}&text=${encodeURI(finalMessage)}&amp;text&amp;type=phone_number&amp;app_absent=0`
            )
          } else {
            await driver.get(
              `https://web.whatsapp.com/send/?phone=%2B55${contact.phone.replace(
                /\D/g,
                ''
              )}&amp;text&amp;type=phone_number&amp;app_absent=0`
            )
          }
          await delay(config.initiate_send)

          try {
            log('Verificando se tem mensagem de erro')
            await driver.wait(
              until.elementLocated(By.css("div[data-testid='confirm-popup']")),
              10000
            )
            await delay(config.check_error)

            const element = await driver.findElement(By.css('div[data-testid="popup-contents"]'))
            const text = await element.getText()

            log('Houve mensagem de erro')
            log(text)

            await delay(config.finalize_send)

            newRows.push({
              ...contact,
              statusInfo: text
            })
          } catch (error) {
            if (!isNewLineReturnCharacter) {
              log('Procurando botão para enviar mensagem')
              await delay(config.send_message)
              const sendButton = await driver.wait(
                until.elementLocated(By.css("button[data-testid='compose-btn-send']"))
              )
              sendButton.click()
            } else {
              log('Procurando input')
              const input = await driver.wait(
                until.elementLocated(By.css('p.selectable-text.copyable-text'))
              )

              log('Inserindo texto')
              const finalMessage = message
                .replaceAll('{primeiroNome}', contact.name.split(' ')[0])
                .replaceAll('{nomeCompleto}', contact.name)
                .replaceAll('{telefone}', contact.phone)
                .replaceAll('{var1}', contact.var1)
                .replaceAll('{var2}', contact.var2)
                .replaceAll('{var3}', contact.var3)

              input.click()

              const finalMessageArray = finalMessage.split('\n')

              for (const message of finalMessageArray) {
                input.sendKeys(message)
                await delay(config.send_message)
                input.sendKeys(
                  isNewLineReturnCharacter ? Key.ENTER : Key.chord(Key.SHIFT, Key.ENTER)
                )
                await delay(config.send_message)
              }
            }

            if (images.length > 0) {
              log('Enviando imagens anexadas')
              for (const image of images) {
                log('Procurando botão clipe')
                const clipButton = await driver.wait(
                  until.elementLocated(By.css("div[data-testid='conversation-clip']"))
                )
                clipButton.click()

                await delay(config.send_message)

                log('Procurando botão anexar imagens')
                const attachButton = await driver.wait(
                  until.elementLocated(By.css("button[aria-label='Fotos e vídeos']"))
                )
                log('Inserindo imagem')
                const inputElement = await attachButton.findElement(By.css(`input`))
                inputElement.sendKeys(image.path)

                await delay(config.send_message)

                log('Procurando botão para enviar imagem')
                const sendImageButton = await driver.wait(
                  until.elementLocated(By.css("span[data-testid='send']"))
                )
                sendImageButton.click()
                await delay(config.send_message)
              }
            }

            newRows.push({
              ...contact,
              status: true,
              statusInfo: 'Mensagem enviada!'
            })
          }
        }

        await delay(config.finalize_send)

        await driver.quit()
        return {
          rows: newRows,
          message,
          status: true,
          initiated_at,
          finalized_at: Date.now()
        }
      } else {
        await driver.quit()
        return {
          rows: rows,
          message,
          error: 'Não foi possivel autenticar',
          status: false,
          initiated_at,
          finalized_at: Date.now()
        }
      }
    } catch (error) {
      console.log('Estou aqui', error)
      log('Houve um erro e fechamos o navegador')

      await driver.quit()

      return {
        rows,
        error,
        message,
        status: false,
        initiated_at,
        finalized_at: Date.now()
      }
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
