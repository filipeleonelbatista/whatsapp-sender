import { ElectronAPI } from '@electron-toolkit/preload'

interface ApiProps {
  connectToWhatsApp: () => Promise<void>
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: ApiProps
  }
}
