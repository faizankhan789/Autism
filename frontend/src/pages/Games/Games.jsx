import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPuzzlePiece, FaLayerGroup, FaMicrophone, FaSmile, FaEye } from 'react-icons/fa';
import Card from '../../components/common/Card';
import useTranslation from '../../hooks/useTranslation';

export default function Games() {
  const { t } = useTranslation();

  const games = [
    { id: 'puzzle', name: t('gamesHub.puzzle'), icon: FaPuzzlePiece, color: 'from-purple-400 to-purple-600', desc: t('gamesHub.puzzleDesc') },
    { id: 'tower', name: t('gamesHub.tower'), icon: FaLayerGroup, color: 'from-orange-400 to-orange-600', desc: t('gamesHub.towerDesc') },
    { id: 'voice', name: t('gamesHub.voice'), icon: FaMicrophone, color: 'from-blue-400 to-blue-600', desc: t('gamesHub.voiceDesc') },
    { id: 'emotion', name: t('gamesHub.emotion'), icon: FaSmile, color: 'from-pink-400 to-pink-600', desc: t('gamesHub.emotionDesc') },
    { id: 'eye-tracking', name: t('gamesHub.eyeTracking'), icon: FaEye, color: 'from-green-400 to-green-600', desc: t('gamesHub.eyeTrackingDesc') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">{t('gamesHub.title')}</h1>
          <p className="text-gray-400 mt-2">{t('gamesHub.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <motion.div key={game.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              <Link to={`/games/${game.id}`}>
                <Card hoverable className="overflow-hidden group">
                  <div className={`bg-gradient-to-br ${game.color} p-8 flex items-center justify-center`}>
                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                      <game.icon className="text-white text-6xl" />
                    </motion.div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg">{game.name}</h3>
                    <p className="text-gray-500 text-sm mt-2">{game.desc}</p>
                    <div className="mt-3">
                      <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {t('common.easy')}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
