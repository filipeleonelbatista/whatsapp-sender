import { create, SocketState, Whatsapp } from 'venom-bot'
import parsePhoneNumber, {
  isValidPhoneNumber
} from 'libphonenumber-js'

export type QrCode = {
  base64Qr: string;
  asciiQR: string;
  attempts: number;
}

class Sender {
  private client: Whatsapp;
  private connected: boolean;
  private qr: QrCode;

  get isConnected(): boolean {
    return this.connected
  }

  get qrCode(): QrCode {
    return this.qr
  }

  constructor() {
    this.initialize()
  }

  async sendText(to: string, body: string) {

    if (!isValidPhoneNumber(to, "BR")) {
      throw new Error("this number is not valid")
    }

    let phoneNumber = parsePhoneNumber(to, "BR")
      ?.format("E.164")
      ?.replace("+", "") as string;

    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`

    console.log("phoneNumber", phoneNumber)

    return await this.client.sendText(phoneNumber, body)
  }

  private initialize() {
    const qr = (base64Qr: string, asciiQR: string, attempts: number) => {
      this.qr = { base64Qr, asciiQR, attempts }
    }
    const status = (statusSession: string) => {
      this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(statusSession)
    }
    const start = (client: Whatsapp) => {
      this.client = client

      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED
      })
    }

    create('ws-sender-dev', qr, status, { autoClose: 0, headless: false, debug: true })
      .then((client) => start(client))
      .catch((error) => console.error(error))
  }

}

export default Sender;