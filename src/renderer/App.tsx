import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import ContactLists from './src/pages/ContactLists';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Logs from './src/pages/Logs';
import MessageModels from './src/pages/MessageModels';
import Profile from './src/pages/Profile';
import Register from './src/pages/Register';
import Settings from './src/pages/Settings';
import './src/styles/global.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/envio-mensagens" element={<Home />} />
        <Route path="/modelos-de-mensagem" element={<MessageModels />} />
        <Route path="/listas-de-contatos" element={<ContactLists />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/historico-de-envios" element={<Logs />} />
      </Routes>
    </Router >
  );
}
