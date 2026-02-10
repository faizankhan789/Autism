import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaGamepad, FaBookOpen, FaTrophy, FaPlus, FaChild } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useTranslation from '../../hooks/useTranslation';

const sampleWeekly = [
  { day: 'Mon', score: 65 }, { day: 'Tue', score: 72 }, { day: 'Wed', score: 58 },
  { day: 'Thu', score: 80 }, { day: 'Fri', score: 75 }, { day: 'Sat', score: 88 }, { day: 'Sun', score: 82 },
];

const sampleActivities = [
  { id: 1, type: 'lesson', title: 'Saying Hello', score: 90, time: '2 hours ago' },
  { id: 2, type: 'game', title: 'Puzzle Game', score: 85, time: '3 hours ago' },
  { id: 3, type: 'story', title: 'Going to School', score: null, time: '5 hours ago' },
  { id: 4, type: 'game', title: 'Emotion Game', score: 70, time: 'Yesterday' },
  { id: 5, type: 'lesson', title: 'Taking Turns', score: 95, time: 'Yesterday' },
];

const moodEmojis = { happy: '😊', calm: '😌', anxious: '😰', frustrated: '😤', upset: '😢' };
const typeColors = { lesson: 'bg-purple-100 text-purple-600', game: 'bg-pink-100 text-pink-600', story: 'bg-green-100 text-green-600' };
const typeIcons = { lesson: FaBook, game: FaGamepad, story: FaBookOpen };

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white text-xl`}>
            <Icon />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-800">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([
    { id: 1, mood: 'happy', note: 'Great session today, very engaged with the puzzle game.', session_date: '2026-02-09', author_username: 'admin' },
    { id: 2, mood: 'calm', note: 'Practiced greetings, showed improvement.', session_date: '2026-02-08', author_username: 'admin' },
  ]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({ mood: 'happy', note: '', session_date: new Date().toISOString().split('T')[0] });

  const sampleSkills = [
    { skill: t('dashboard.communication'), score: 75, fullMark: 100 },
    { skill: t('dashboard.social'), score: 60, fullMark: 100 },
    { skill: t('dashboard.emotional'), score: 80, fullMark: 100 },
    { skill: t('dashboard.cognitive'), score: 70, fullMark: 100 },
    { skill: t('dashboard.motor'), score: 65, fullMark: 100 },
  ];

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get('/accounts/children/');
        const data = res.data.results || res.data;
        setChildren(data);
        if (data.length > 0) setSelectedChild(data[0]);
      } catch { setChildren([]); }
      setLoading(false);
    };
    fetchChildren();
  }, []);

  const addNote = () => {
    if (!noteForm.note.trim()) return;
    setNotes([{ id: Date.now(), ...noteForm, author_username: 'You' }, ...notes]);
    setNoteForm({ mood: 'happy', note: '', session_date: new Date().toISOString().split('T')[0] });
    setShowNoteForm(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner message={t('dashboard.loadingDashboard')} /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">{t('dashboard.title')}</h1>
            <p className="text-gray-500">{t('dashboard.subtitle')}</p>
          </div>
          {children.length > 0 && (
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm">
              <FaChild className="text-purple-500" />
              <select value={selectedChild?.id || ''} onChange={(e) => setSelectedChild(children.find(c => c.id == e.target.value))}
                className="outline-none font-semibold text-gray-700 bg-transparent">
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={FaBook} label={t('dashboard.lessonsDone')} value={12} color="bg-purple-500" delay={0} />
          <StatCard icon={FaGamepad} label={t('dashboard.gamesPlayed')} value={24} color="bg-pink-500" delay={0.1} />
          <StatCard icon={FaBookOpen} label={t('dashboard.storiesRead')} value={8} color="bg-green-500" delay={0.2} />
          <StatCard icon={FaTrophy} label={t('dashboard.avgScore')} value="78%" color="bg-blue-500" delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Radar */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-800 text-lg mb-4">{t('dashboard.skillAssessment')}</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={sampleSkills}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" className="text-sm" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Weekly Progress */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-800 text-lg mb-4">{t('dashboard.weeklyProgress')}</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={sampleWeekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Activity Timeline */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-800 text-lg mb-4">{t('dashboard.recentActivity')}</h2>
            <div className="space-y-3">
              {sampleActivities.map((act) => {
                const Icon = typeIcons[act.type];
                return (
                  <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[act.type]}`}>
                      <Icon />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700 text-sm">{act.title}</p>
                      <p className="text-gray-400 text-xs">{act.time}</p>
                    </div>
                    {act.score !== null && (
                      <span className="text-sm font-bold text-purple-600">{act.score}%</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Behavioral Notes */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">{t('dashboard.behavioralNotes')}</h2>
              <button onClick={() => setShowNoteForm(!showNoteForm)}
                className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition">
                <FaPlus />
              </button>
            </div>

            {showNoteForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-purple-50 rounded-xl p-4 mb-4 space-y-3">
                <div className="flex gap-2">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button key={mood} onClick={() => setNoteForm({ ...noteForm, mood })}
                      className={`text-2xl p-2 rounded-xl transition ${noteForm.mood === mood ? 'bg-white shadow-md scale-110' : 'hover:bg-white/50'}`}>
                      {emoji}
                    </button>
                  ))}
                </div>
                <input type="date" value={noteForm.session_date}
                  onChange={(e) => setNoteForm({ ...noteForm, session_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border outline-none" />
                <textarea value={noteForm.note} onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
                  placeholder={t('dashboard.writeNote')} rows={2}
                  className="w-full px-3 py-2 rounded-xl border outline-none resize-none" />
                <Button variant="primary" size="sm" onClick={addNote}>{t('dashboard.saveNote')}</Button>
              </motion.div>
            )}

            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{moodEmojis[note.mood]}</span>
                    <span className="text-xs text-gray-400">{note.session_date} {t('dashboard.by')} {note.author_username}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{note.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-4">{t('dashboard.quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => alert('PDF report feature coming soon!')}>{t('dashboard.downloadReport')}</Button>
            <Button variant="secondary" onClick={() => alert('Session scheduling coming soon!')}>{t('dashboard.scheduleSession')}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
