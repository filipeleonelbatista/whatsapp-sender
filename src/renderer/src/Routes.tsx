import { MemoryRouter as Router, Route, Routes as RoutesComponent } from 'react-router-dom'
import Home from './pages/Home'
import './styles/global.css'

export default function Routes(): JSX.Element {
  return (
    <Router>
      <RoutesComponent>
        <Route path="/" element={<Home />} />
      </RoutesComponent>
    </Router>
  )
}
