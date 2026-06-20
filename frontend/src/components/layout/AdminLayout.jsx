import React, { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiPackage, FiShoppingBag, FiTag, FiImage,
  FiDollarSign, FiUsers, FiMenu, FiX, FiLogOut, FiExternalLink
} from 'react-icons/fi'
import { logout } from '../../store/slices/authSlice'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/banners', label: 'Banners', icon: FiImage },
  { to: '/admin/transactions', label: 'Payments', icon: FiDollarSign },
  { to: '/admin/users', label: 'Customers', icon: FiUsers },
]

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-emerald-950">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-3xl text-gold">SK</span>
            <div>
              <p className="font-sans text-[9px] text-white/50 tracking-widest uppercase leading-tight">Admin</p>
              <p className="font-sans text-[9px] text-white/50 tracking-widest uppercase leading-tight">Panel</p>
            </div>
          </Link>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="font-sans text-[9px] text-white/30 tracking-widest uppercase px-3 mb-2">Main Menu</p>
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to} to={to} end={exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 font-sans text-sm transition-all rounded-none ${isActive
                ? 'bg-gold/20 text-gold border-l-2 border-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <Link to="/" target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 text-white/50 hover:text-white font-sans text-xs transition-colors">
          <FiExternalLink size={14} /> View Store
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 font-sans text-xs transition-colors">
          <FiLogOut size={14} /> Sign Out
        </button>
        <div className="flex items-center gap-3 px-4 pt-2 border-t border-white/10">
          <div className="w-8 h-8 bg-gold/20 flex items-center justify-center">
            <span className="font-display text-gold text-sm">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-sans text-xs text-white font-medium truncate max-w-[120px]">{user?.name}</p>
            <p className="font-sans text-[10px] text-white/40">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 md:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
          <button className="md:hidden p-2 text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={20} />
          </button>
          <div className="hidden md:block">
            <p className="font-sans text-xs text-gray-400 tracking-widest uppercase">SK Luxury Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-gray-500 hidden sm:block">{user?.email}</span>
            <div className="w-8 h-8 bg-emerald-900 flex items-center justify-center">
              <span className="font-display text-gold text-sm">{user?.name?.charAt(0)}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
