import express, { Request, Response } from 'express';
import cors from 'cors'

import Sender from './Sender'

const sender = new Sender();

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/status', (req: Request, res: Response) => {
  return res.send({
    qr_code: sender.qrCode,
    connected: sender.isConnected
  })
})


app.post('/send', async (req: Request, res: Response) => {
  const { number, message } = req.body;

  try {
    await sender.sendText(number, message)
    return res.status(200).json()
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error
    })
  }
})

app.listen(3000, () => console.log("Servidor iniciado"))