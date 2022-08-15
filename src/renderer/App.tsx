import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from 'screens/MainScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/default.scss';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
      </Routes>
    </Router>
  );
}
