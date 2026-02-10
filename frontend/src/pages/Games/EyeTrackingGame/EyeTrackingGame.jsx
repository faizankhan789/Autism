import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/common/Button';
import RewardAnimation from '../../../components/common/RewardAnimation';

const SHAPES = ['⭐', '❤️', '🔵', '🟢', '🌸', '🦋', '🌈', '🎈'];
const COLORS = ['from-yellow-400 to-orange-400', 'from-pink-400 to-red-400', 'from-blue-400 to-indigo-400', 'from-green-400 to-teal-400'];
const GAME_DURATION = 60;

export default function EyeTrackingGame() {
  const [target, setTarget] = useState({ x: 50, y: 40, shape: 0 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [gazePos, setGazePos] = useState({ x: 0, y: 0 });
  const [hoverTime, setHoverTime] = useState(0);
  const [trail, setTrail] = useState([]);
  const [popEffect, setPopEffect] = useState(null);
  const containerRef = useRef(null);
  const hoverRef = useRef(0);

  const spawnTarget = useCallback(() => {
    setTarget({
      x: 10 + Math.random() * 75,
      y: 15 + Math.random() * 60,
      shape: Math.floor(Math.random() * SHAPES.length),
    });
    setHoverTime(0);
    hoverRef.current = 0;
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const handleMouse = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGazePos({ x, y });
      setTrail(prev => [...prev.slice(-15), { x, y, id: Date.now() }]);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      const dist = Math.sqrt(Math.pow(gazePos.x - target.x, 2) + Math.pow(gazePos.y - target.y, 2));
      if (dist < 8) {
        hoverRef.current += 50;
        setHoverTime(hoverRef.current);
        if (hoverRef.current >= 1500) {
          setPopEffect({ x: target.x, y: target.y });
          setScore(s => s + 1);
          spawnTarget();
          setTimeout(() => setPopEffect(null), 500);
        }
      } else {
        hoverRef.current = Math.max(0, hoverRef.current - 20);
        setHoverTime(hoverRef.current);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, gazePos, target, spawnTarget]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setGameOver(true); setShowReward(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const startGame = () => { setGameStarted(true); setScore(0); setTimeLeft(GAME_DURATION); setGameOver(false); setShowReward(false); spawnTarget(); };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 pt-24">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">👁️</div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Eye Tracking Game</h1>
          <p className="text-gray-500 urdu-text mb-4">آنکھوں سے کھیل</p>
          <p className="text-gray-400 mb-2">Move your mouse to follow the targets!</p>
          <p className="text-gray-400 text-sm mb-6">Hold your gaze on the target for 1.5 seconds to pop it!</p>
          <Button variant="primary" onClick={startGame}>Start Game</Button>
        </motion.div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 pt-24">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-extrabold text-green-600 mb-2">Time's Up!</h2>
          <p className="text-5xl font-extrabold text-purple-500 mb-2">{score}</p>
          <p className="text-gray-500 mb-6">targets popped in {GAME_DURATION} seconds!</p>
          <Button variant="primary" onClick={startGame}>Play Again</Button>
        </motion.div>
        <RewardAnimation type="star" show={showReward} onComplete={() => setShowReward(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 p-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-bold text-green-600">Score: {score}</span>
          <span className={`px-4 py-2 rounded-xl shadow-sm font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600'}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
        </div>

        <div ref={containerRef} className="relative bg-white rounded-3xl shadow-lg overflow-hidden" style={{ height: '65vh' }}>
          {/* Trail */}
          {trail.map((dot, i) => (
            <div key={dot.id} className="absolute w-3 h-3 rounded-full bg-purple-300 pointer-events-none transition-opacity"
              style={{ left: `${dot.x}%`, top: `${dot.y}%`, opacity: (i + 1) / trail.length * 0.5, transform: 'translate(-50%,-50%)' }} />
          ))}

          {/* Target */}
          <motion.div
            animate={{ x: [0, 5, -5, 0], y: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute cursor-pointer"
            style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className="relative">
              <div className="text-5xl">{SHAPES[target.shape]}</div>
              {hoverTime > 0 && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="100"
                    strokeDashoffset={100 - (hoverTime / 1500) * 100} className="transition-all" />
                </svg>
              )}
            </div>
          </motion.div>

          {/* Pop effect */}
          <AnimatePresence>
            {popEffect && (
              <motion.div initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} exit={{ opacity: 0 }}
                className="absolute text-4xl pointer-events-none"
                style={{ left: `${popEffect.x}%`, top: `${popEffect.y}%`, transform: 'translate(-50%,-50%)' }}>
                ✨
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gaze cursor */}
          <div className="absolute w-6 h-6 rounded-full border-2 border-purple-500 bg-purple-200/30 pointer-events-none"
            style={{ left: `${gazePos.x}%`, top: `${gazePos.y}%`, transform: 'translate(-50%,-50%)', transition: 'all 0.05s' }} />
        </div>
      </div>
    </div>
  );
}
