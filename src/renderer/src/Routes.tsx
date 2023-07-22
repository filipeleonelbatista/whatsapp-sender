import { MemoryRouter as Router, Route, Routes as RoutesComponent } from 'react-router-dom'
import Connections from './pages/Connections'
import Home from './pages/Home'
import './styles/global.css'

export default function Routes(): JSX.Element {
  return (
    <Router>
      <RoutesComponent>
        <Route path="/" element={<Home />} />
        <Route path="/connections" element={<Connections />} />
      </RoutesComponent>
    </Router>
  )
}
