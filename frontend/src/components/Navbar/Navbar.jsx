import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaBook,
  FaGamepad,
  FaBookOpen,
  FaChartBar,
  FaBars,
  FaTimes,
  FaSignInAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import useTranslation from '../../hooks/useTranslation';

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
          isActive
            ? 'bg-white/30 text-white shadow-inner'
            : 'text-white/80 hover:bg-white/20 hover:text-white'
        }`
      }
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t, isUrdu } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.home'), icon: FaHome },
    { to: '/lessons', label: t('nav.lessons'), icon: FaBook },
    { to: '/games', label: t('nav.games'), icon: FaGamepad },
    { to: '/stories', label: t('nav.stories'), icon: FaBookOpen },
    { to: '/dashboard', label: t('nav.dashboard'), icon: FaChartBar },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-xl">
              <span className="text-2xl">🌟</span>
              <span className="hidden sm:inline">{t('nav.brand')}</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* User area */}
              {isAuthenticated && user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 text-white hover:bg-white/30 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold hidden sm:inline">
                    {user.name || 'User'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white font-semibold text-sm hover:bg-white/30 transition-colors"
                >
                  <FaSignInAlt />
                  <span className="hidden sm:inline">{t('nav.login')}</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-gradient-to-b from-purple-700 to-pink-600"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.to} {...item} onClick={closeMobile} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

    </>
  );
}
