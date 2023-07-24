import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

import { Boom } from '@hapi/boom'
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'

export async function connectToWhatsApp(): Promise<void> {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    console.log('FILIPE AQUI', typeof makeWASocket, Object.keys(makeWASocket))

    const sock = makeWASocket.makeWASocket({
      auth: state,
      // can provide additional config here
      printQRInTerminal: true
    })
    console.log('PASSEI AQUI')
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log(
          'connection closed due to ',
          lastDisconnect?.error,
          ', reconnecting ',
          shouldReconnect
        )
        // reconnect if not logged out
        if (shouldReconnect) {
          connectToWhatsApp()
        }
      } else if (connection === 'open') {
        console.log('opened connection')
      }
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async (m) => {
      console.log(JSON.stringify(m, undefined, 2))

      console.log('replying to', m.messages[0].key.remoteJid)
      await sock.sendMessage(m.messages[0].key.remoteJid!, {
        text: 'Hello there!'
      })
    })
  } catch (e) {
    console.log(e)
  }
}

connectToWhatsApp()

const api = {}

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
