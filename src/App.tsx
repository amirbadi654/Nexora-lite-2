import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import GameNotifications from './components/GameNotifications';
import WalletGuard from './components/WalletGuard';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Challenge from './pages/Challenge';
import Leaderboard from './pages/Leaderboard';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function AppRoutes() {
  return (
    <>
      <Navbar />
      <GameNotifications />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/dashboard"
          element={<WalletGuard><Dashboard /></WalletGuard>}
        />
        <Route
          path="/challenge"
          element={<WalletGuard><Challenge /></WalletGuard>}
        />
        <Route
          path="/shop"
          element={<WalletGuard><Shop /></WalletGuard>}
        />
        <Route
          path="/profile"
          element={<WalletGuard><Profile /></WalletGuard>}
        />
        <Route
          path="/settings"
          element={<WalletGuard><Settings /></WalletGuard>}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GameProvider>
    </WalletProvider>
  );
}

export default App;
