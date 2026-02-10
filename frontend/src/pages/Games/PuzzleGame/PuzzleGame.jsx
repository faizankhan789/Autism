import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import RewardAnimation from '../../../components/common/RewardAnimation';
import useTranslation from '../../../hooks/useTranslation';

const ANIMALS = ['🐱', '🐶', '🐰', '🐸', '🦁', '🐨', '🐼', '🐵', '🦊'];
const COLORS = ['bg-purple-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-orange-200', 'bg-red-200', 'bg-indigo-200', 'bg-teal-200'];
const DIFFICULTIES = { easy: { cols: 2, count: 4 }, medium: { cols: 3, count: 6 }, hard: { cols: 3, count: 9 } };

function DraggablePiece({ piece, index }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PIECE',
    item: { id: piece.id, index: piece.correctPos },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return (
    <div ref={drag} className={`w-20 h-20 ${COLORS[piece.id % 9]} rounded-2xl flex items-center justify-center text-4xl cursor-grab shadow-md transition-transform ${isDragging ? 'opacity-30 scale-90' : 'hover:scale-105'}`}>
      {ANIMALS[piece.id % 9]}
    </div>
  );
}

function DropZone({ position, placed, onDrop, cols }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'PIECE',
    drop: (item) => onDrop(item, position),
    canDrop: () => !placed,
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  return (
    <div ref={drop}
      className={`w-20 h-20 rounded-2xl border-3 border-dashed flex items-center justify-center text-4xl transition-all ${
        placed ? `${COLORS[placed.id % 9]} border-green-400 shadow-lg` :
        isOver && canDrop ? 'border-purple-400 bg-purple-50 scale-105' :
        'border-gray-300 bg-gray-50'
      }`}>
      {placed ? ANIMALS[placed.id % 9] : <span className="text-gray-300 text-2xl">{position + 1}</span>}
    </div>
  );
}

function PuzzleBoard() {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState('easy');
  const [showReward, setShowReward] = useState(false);
  const { cols, count } = DIFFICULTIES[difficulty];

  const diffLabels = { easy: t('common.easy'), medium: t('common.medium'), hard: t('common.hard') };

  const initGame = useCallback(() => {
    const pieces = Array.from({ length: count }, (_, i) => ({ id: i, correctPos: i }));
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    return { tray: shuffled, board: Array(count).fill(null), moves: 0, score: 0, completed: false };
  }, [count]);

  const [game, setGame] = useState(initGame);

  const handleDrop = (item, position) => {
    if (game.board[position]) return;
    const newBoard = [...game.board];
    const newTray = game.tray.filter(p => p.id !== item.id);
    const piece = game.tray.find(p => p.id === item.id);
    newBoard[position] = piece;

    const moves = game.moves + 1;
    const correctCount = newBoard.filter((p, i) => p && p.correctPos === i).length;
    const score = Math.round((correctCount / count) * 100);
    const completed = newTray.length === 0;

    setGame({ tray: newTray, board: newBoard, moves, score, completed });
    if (completed) setTimeout(() => setShowReward(true), 500);
  };

  const restart = () => { setGame(initGame()); setShowReward(false); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">🧩 {t('puzzle.title')}</h1>
        </motion.div>

        <div className="flex justify-center gap-2 mb-6">
          {Object.keys(DIFFICULTIES).map(d => (
            <button key={d} onClick={() => { setDifficulty(d); setTimeout(() => setGame(initGame()), 0); }}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${difficulty === d ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-purple-50'}`}>
              {diffLabels[d]}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-6 mb-4 text-sm">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold">{t('puzzle.moves')}: {game.moves}</span>
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold">{t('common.score')}: {game.score}%</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-center font-bold text-gray-600 mb-4">{t('puzzle.placeHere')}</h3>
          <div className={`grid gap-3 justify-center`} style={{ gridTemplateColumns: `repeat(${cols}, 5rem)` }}>
            {game.board.map((placed, i) => (
              <DropZone key={i} position={i} placed={placed} onDrop={handleDrop} cols={cols} />
            ))}
          </div>
        </div>

        {game.tray.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-center font-bold text-gray-600 mb-4">{t('puzzle.dragAnimals')}</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {game.tray.map((piece, i) => (
                <DraggablePiece key={piece.id} piece={piece} index={i} />
              ))}
            </div>
          </div>
        )}

        {game.completed && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-6 bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-extrabold text-purple-600 mb-2">🎉 {t('common.amazing')}</h2>
            <p className="text-gray-500 mb-4">{t('puzzle.completed').replace('{moves}', game.moves)}</p>
            <Button variant="primary" onClick={restart}>{t('common.playAgain')}</Button>
          </motion.div>
        )}

        <RewardAnimation type="star" show={showReward} onComplete={() => setShowReward(false)} />
      </div>
    </div>
  );
}

export default function PuzzleGame() {
  return (
    <DndProvider backend={HTML5Backend}>
      <PuzzleBoard />
    </DndProvider>
  );
}
