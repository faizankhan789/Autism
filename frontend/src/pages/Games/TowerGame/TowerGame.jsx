import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import RewardAnimation from '../../../components/common/RewardAnimation';
import useTranslation from '../../../hooks/useTranslation';

const RING_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
const LEVELS = { 1: 3, 2: 4, 3: 5 };

function Ring({ size, maxSize, color, isSelected, onClick }) {
  const width = 40 + (size / maxSize) * 60;
  return (
    <motion.div layout onClick={onClick}
      className={`h-8 rounded-full cursor-pointer transition-all ${isSelected ? 'ring-4 ring-purple-400 ring-offset-2' : 'hover:brightness-110'}`}
      style={{ width: `${width}%`, backgroundColor: color, margin: '0 auto' }}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
    />
  );
}

function Peg({ rings, maxSize, pegIndex, selectedPeg, onSelectPeg, onPlaceRing, t }) {
  const isSelected = selectedPeg === pegIndex;
  return (
    <div onClick={() => rings.length > 0 && selectedPeg === null ? onSelectPeg(pegIndex) : onPlaceRing(pegIndex)}
      className={`flex-1 flex flex-col items-center cursor-pointer`}>
      <div className={`w-full max-w-[180px] bg-gray-100 rounded-3xl p-4 min-h-[200px] flex flex-col justify-end gap-1 transition-all ${isSelected ? 'bg-purple-50 ring-2 ring-purple-300' : 'hover:bg-gray-50'}`}>
        <div className="w-2 h-full bg-gray-300 rounded-full mx-auto absolute" style={{ minHeight: 120 }} />
        {rings.map((ring, i) => (
          <Ring key={ring.size} size={ring.size} maxSize={maxSize} color={ring.color}
            isSelected={isSelected && i === rings.length - 1} onClick={(e) => { e.stopPropagation(); onSelectPeg(pegIndex); }} />
        ))}
        {rings.length === 0 && <div className="text-gray-300 text-center text-sm py-8">{t('tower.empty')}</div>}
      </div>
      <div className="mt-2 text-xs font-semibold text-gray-400">{t('tower.peg')} {pegIndex + 1}</div>
    </div>
  );
}

export default function TowerGame() {
  const { t } = useTranslation();
  const [level, setLevel] = useState(1);
  const [showReward, setShowReward] = useState(false);
  const ringCount = LEVELS[level];

  const initGame = (count) => {
    const rings = Array.from({ length: count }, (_, i) => ({ size: count - i, color: RING_COLORS[count - i - 1] }));
    return { pegs: [rings, [], []], moves: 0, completed: false };
  };

  const [game, setGame] = useState(initGame(ringCount));
  const [selectedPeg, setSelectedPeg] = useState(null);

  const minMoves = Math.pow(2, ringCount) - 1;

  const handleSelectPeg = (pegIndex) => {
    if (game.completed) return;
    if (selectedPeg === null) {
      if (game.pegs[pegIndex].length > 0) setSelectedPeg(pegIndex);
    } else if (selectedPeg === pegIndex) {
      setSelectedPeg(null);
    } else {
      handlePlaceRing(pegIndex);
    }
  };

  const handlePlaceRing = (toPeg) => {
    if (selectedPeg === null) return;
    const fromRings = [...game.pegs[selectedPeg]];
    const toRings = [...game.pegs[toPeg]];
    const movingRing = fromRings[fromRings.length - 1];

    if (toRings.length > 0 && toRings[toRings.length - 1].size < movingRing.size) {
      setSelectedPeg(null);
      return;
    }

    fromRings.pop();
    toRings.push(movingRing);
    const newPegs = [...game.pegs];
    newPegs[selectedPeg] = fromRings;
    newPegs[toPeg] = toRings;

    const completed = newPegs[2].length === ringCount;
    setGame({ pegs: newPegs, moves: game.moves + 1, completed });
    setSelectedPeg(null);
    if (completed) setTimeout(() => setShowReward(true), 500);
  };

  const restart = () => { setGame(initGame(LEVELS[level])); setSelectedPeg(null); setShowReward(false); };
  const changeLevel = (l) => { setLevel(l); setGame(initGame(LEVELS[l])); setSelectedPeg(null); setShowReward(false); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 p-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">🗼 {t('tower.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('tower.moveAllRings')}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(l => (
            <button key={l} onClick={() => changeLevel(l)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm ${level === l ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}>
              {t('tower.level')} {l} ({LEVELS[l]} {t('tower.rings')})
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-4 text-sm">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold">{t('puzzle.moves')}: {game.moves}</span>
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold">{t('tower.min')}: {minMoves}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <p className="text-center text-sm text-gray-400 mb-4">
            {selectedPeg !== null ? `🟣 ${t('tower.clickToPlace')}` : t('tower.clickToPickUp')}
          </p>
          <div className="flex gap-4 relative">
            {game.pegs.map((rings, i) => (
              <Peg key={i} rings={rings} maxSize={ringCount} pegIndex={i}
                selectedPeg={selectedPeg} onSelectPeg={handleSelectPeg} onPlaceRing={handlePlaceRing} t={t} />
            ))}
          </div>
        </div>

        {game.completed && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-extrabold text-orange-500 mb-2">🎉 {t('common.wellDone')}</h2>
            <p className="text-gray-500 mb-4">{t('tower.completed').replace('{moves}', game.moves).replace('{min}', minMoves)}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={restart}>{t('common.playAgain')}</Button>
              {level < 3 && <Button variant="secondary" onClick={() => changeLevel(level + 1)}>{t('tower.nextLevel')}</Button>}
            </div>
          </motion.div>
        )}

        <RewardAnimation type="trophy" show={showReward} onComplete={() => setShowReward(false)} />
      </div>
    </div>
  );
}
