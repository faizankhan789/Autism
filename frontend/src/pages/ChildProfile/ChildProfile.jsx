import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaChild, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const severityColors = { mild: 'bg-green-100 text-green-700', moderate: 'bg-yellow-100 text-yellow-700', severe: 'bg-red-100 text-red-700' };
const avatarColors = ['bg-purple-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400'];

function ChildCard({ child, onEdit, onDelete, index }) {
  const age = Math.floor((Date.now() - new Date(child.date_of_birth)) / 31557600000);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card hoverable className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${avatarColors[index % 6]} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
            {child.name[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">{child.name}</h3>
            <p className="text-gray-500 text-sm">{age} years old</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${severityColors[child.severity]}`}>
              {child.severity}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(child)} className="p-2 text-purple-500 hover:bg-purple-50 rounded-xl"><FaEdit /></button>
            <button onClick={() => onDelete(child.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><FaTrash /></button>
          </div>
        </div>
        {child.notes && <p className="mt-3 text-gray-500 text-sm bg-gray-50 rounded-xl p-3">{child.notes}</p>}
      </Card>
    </motion.div>
  );
}

function ChildModal({ child, onClose, onSave }) {
  const [form, setForm] = useState(child || { name: '', date_of_birth: '', severity: 'mild', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{child ? 'Edit Child' : 'Add Child'}</h2>
          <button onClick={onClose} className="text-white p-1"><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Child's Name" required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none" />
          <input name="date_of_birth" type="date" value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none" />
          <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none bg-white">
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes (optional)" rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none resize-none" />
          {saving ? <LoadingSpinner /> : (
            <Button variant="primary" className="w-full" type="submit">
              {child ? 'Update' : 'Add Child'}
            </Button>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ChildProfile() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const { user } = useAuth();

  const fetchChildren = async () => {
    try {
      const res = await api.get('/accounts/children/');
      setChildren(res.data.results || res.data);
    } catch { setChildren([]); }
    setLoading(false);
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleSave = async (form) => {
    try {
      if (form.id) {
        await api.put(`/accounts/children/${form.id}/`, form);
      } else {
        await api.post('/accounts/children/', form);
      }
      setModal(null);
      fetchChildren();
    } catch (err) { alert('Error saving: ' + JSON.stringify(err.response?.data)); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this child profile?')) return;
    try {
      await api.delete(`/accounts/children/${id}/`);
      fetchChildren();
    } catch { alert('Error deleting profile'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner message="Loading profiles..." /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Children</h1>
            <p className="text-gray-500">Manage your children's profiles</p>
          </div>
          <Button variant="primary" icon={<FaPlus />} onClick={() => setModal({})}>Add Child</Button>
        </div>

        {children.length === 0 ? (
          <Card className="p-12 text-center">
            <FaChild className="text-6xl text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No children yet</h3>
            <p className="text-gray-400 mb-4">Add your first child to get started!</p>
            <Button variant="primary" icon={<FaPlus />} onClick={() => setModal({})}>Add Child</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {children.map((child, i) => (
              <ChildCard key={child.id} child={child} index={i} onEdit={(c) => setModal(c)} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <AnimatePresence>
          {modal !== null && <ChildModal child={modal.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
