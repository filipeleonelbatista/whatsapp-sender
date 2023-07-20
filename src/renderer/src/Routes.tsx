import { MemoryRouter as Router, Route, Routes as RoutesComponent } from 'react-router-dom'
import Blog from './pages/Blog'
import ContactLists from './pages/ContactLists'
import Extractor from './pages/Extractor'
import Home from './pages/Home'
import Login from './pages/Login'
import Logs from './pages/Logs'
import MessageModels from './pages/MessageModels'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Settings from './pages/Settings'
import './styles/global.css'

export default function Routes(): JSX.Element {
  return (
    <Router>
      <RoutesComponent>
        <Route path="/" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/envio-mensagens" element={<Home />} />
        <Route path="/modelos-de-mensagem" element={<MessageModels />} />
        <Route path="/listas-de-contatos" element={<ContactLists />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/historico-de-envios" element={<Logs />} />
        <Route path="/extrator" element={<Extractor />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </RoutesComponent>
    </Router>
  )
}
