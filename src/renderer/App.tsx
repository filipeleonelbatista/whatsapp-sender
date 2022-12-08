import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import ContactLists from './src/pages/ContactLists';
import Home from './src/pages/Home';
import Logs from './src/pages/Logs';
import MessageModels from './src/pages/MessageModels';
import Profile from './src/pages/Profile';
import Settings from './src/pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modelos-de-mensagem" element={<MessageModels />} />
        <Route path="/listas-de-contatos" element={<ContactLists />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/historico-de-envios" element={<Logs />} />
      </Routes>
    </Router >
  );
}
