import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'providers/theme';
import MainScreen from 'screens/MainScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/default.scss';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainScreen />} />
    </Routes>
  </Router>
);

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}
