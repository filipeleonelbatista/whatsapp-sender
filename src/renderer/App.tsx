import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import ContactLists from './src/pages/ContactLists';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Logs from './src/pages/Logs';
import MessageModels from './src/pages/MessageModels';
import Profile from './src/pages/Profile';
import Register from './src/pages/Register';
import Settings from './src/pages/Settings';
import Blog from './src/pages/Blog';
import './src/styles/global.css';
import Extractor from './src/pages/Extractor';
import Onboarding from './src/pages/Onboarding';

export default function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router >
  );
}
