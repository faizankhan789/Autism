import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirm: '', role: 'parent', phone: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.username, form.password);
      } else {
        if (form.password !== form.password_confirm) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await register(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.username?.[0] || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
          <div className="flex justify-center mb-3">
            <Avatar mood="waving" size="sm" />
          </div>
          <h1 className="text-white text-2xl font-extrabold">
            {isLogin ? 'Welcome Back!' : 'Join Us!'}
          </h1>
          <p className="text-white/80 text-sm mt-1 urdu-text">
            {isLogin ? 'واپسی پر خوش آمدید!' : 'ہمارے ساتھ شامل ہوں!'}
          </p>
        </div>

        <div className="flex border-b">
          {['Login', 'Register'].map((tab, i) => (
            <button key={tab} onClick={() => { setIsLogin(i === 0); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
                (i === 0 ? isLogin : !isLogin) ? 'text-purple-600' : 'text-gray-400'
              }`}>
              {tab}
              {(i === 0 ? isLogin : !isLogin) && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">
              {error}
            </motion.div>
          )}

          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition" required />
          </div>

          {!isLogin && (
            <>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition" required />
              </div>
              <div className="relative">
                <FaUserShield className="absolute left-3 top-3.5 text-gray-400" />
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition bg-white">
                  <option value="parent">Parent</option>
                  <option value="therapist">Therapist</option>
                </select>
              </div>
              <div className="relative">
                <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition" />
              </div>
            </>
          )}

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition" required />
          </div>

          {!isLogin && (
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition" required />
            </div>
          )}

          {loading ? <LoadingSpinner /> : (
            <Button variant="primary" className="w-full" type="submit">
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
