import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import SensoryPanel from './components/SensoryPanel/SensoryPanel';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ChildProfile from './pages/ChildProfile/ChildProfile';
import Lessons from './pages/Lessons/Lessons';
import Games from './pages/Games/Games';
import PuzzleGame from './pages/Games/PuzzleGame/PuzzleGame';
import TowerGame from './pages/Games/TowerGame/TowerGame';
import EmotionGame from './pages/Games/EmotionGame/EmotionGame';
import VoiceGame from './pages/Games/VoiceGame/VoiceGame';
import EyeTrackingGame from './pages/Games/EyeTrackingGame/EyeTrackingGame';
import Stories from './pages/Stories/Stories';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/children" element={<ChildProfile />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/puzzle" element={<PuzzleGame />} />
          <Route path="/games/tower" element={<TowerGame />} />
          <Route path="/games/emotion" element={<EmotionGame />} />
          <Route path="/games/voice" element={<VoiceGame />} />
          <Route path="/games/eye-tracking" element={<EyeTrackingGame />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <SensoryPanel />
      </div>
    </Router>
  );
}

export default App;
