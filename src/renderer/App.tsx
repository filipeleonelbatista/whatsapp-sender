import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
