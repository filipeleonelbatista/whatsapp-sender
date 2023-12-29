import {
  MemoryRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import Blog from "./src/pages/Blog";
import ContactLists from "./src/pages/ContactLists";
import CreateInstances from "./src/pages/CreateInstances";
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Logs from "./src/pages/Logs";
import MessageModels from "./src/pages/MessageModels";
import MultipleSender from "./src/pages/MultipleSender";
import Onboarding from "./src/pages/Onboarding";
import Register from "./src/pages/Register";
import Settings from "./src/pages/Settings";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/envio-mensagens" element={<Home />} />
        <Route path="/cadastro-whatsapp" element={<CreateInstances />} />
        <Route path="/envio-simultaneo" element={<MultipleSender />} />
        <Route path="/modelos-de-mensagem" element={<MessageModels />} />
        <Route path="/listas-de-contatos" element={<ContactLists />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/historico-de-envios" element={<Logs />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Switch>
    </Router>
  );
}
