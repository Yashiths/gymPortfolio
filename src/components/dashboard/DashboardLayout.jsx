import { useState } from 'react';
import { useGym } from '../../context/useGym';
import {
  LayoutDashboard,
  Users,
  Edit,
  LogOut,
  Menu,
  X,
  Zap, 
  Settings as SettingsIcon, // Renamed to avoid conflict with Settings component
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InitialSetupForm from './InitialSetupForm'; 

export default function DashboardLayout({ children }) {
  const { adminSubView, changeView, totalRevenue, customers, authSettings } = useGym();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  if (!authSettings) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <Zap className="w-8 h-8 text-brand-orange animate-pulse" />
      </div>
    );
  }


  const isSetupDone = authSettings.is_setup_completed;
  const activeCount = isSetupDone ? customers.filter(c => c.status === 'Active').length : 0;
  const displayRevenue = isSetupDone ? totalRevenue : 0;

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview Analytics',
      icon: LayoutDashboard,
      desc: 'Performance & quick logger'
    },
    {
      id: 'customers',
      label: 'Client Directory',
      icon: Users,
      desc: 'Advanced customer list'
    },
    {
      id: 'editor',
      label: 'Page Editor (CMS)',
      icon: Edit,
      desc: 'ABC landing page editor'
    },
    {
      id: 'settings',
      label: 'App Settings',
      icon: SettingsIcon,
      desc: 'ABC landing page editor'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col md:flex-row antialiased overflow-x-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/40 border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-orange animate-pulse" />
          <span className="font-display text-xl font-bold uppercase tracking-wider text-white">Fittness with PORTAL</span>
        </div>
        <button
          onClick={() => isSetupDone && setMobileMenuOpen(true)} // බ්ලොක් කරලා තියෙන්නේ setup වෙනකන්
          disabled={!isSetupDone}
          className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-300 disabled:opacity-30"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && isSetupDone && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-80 bg-[#111827] border-r border-white/10 p-6 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-brand-orange" />
                    <span className="font-display text-2xl font-bold uppercase tracking-wider text-white">Fittness with PORTAL</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="w-full flex items-center gap-4 p-3.5 rounded-xl border bg-transparent border-transparent text-gray-600 opacity-40 cursor-not-allowed">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={() => changeView('landing')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                Exit to Website
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:flex flex-col justify-between w-72 bg-[#0c1220] border-r border-white/5 p-6 h-screen sticky top-0 shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-orange-hover flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold uppercase tracking-wider text-white leading-none">Fittness with Yash</h1>
              <p className="text-[9px] uppercase tracking-widest text-brand-cyan font-bold mt-0.5">Trainer Dashboard</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white/2 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                <TrendingUp className="w-3 h-3 text-brand-orange" />
                Rev
              </div>
              <p className="text-sm font-bold text-white mt-1">${displayRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/2 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                <UserCheck className="w-3 h-3 text-brand-cyan" />
                Clients
              </div>
              <p className="text-sm font-bold text-white mt-1">{activeCount} Active</p>
            </div>
          </div>


          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = isSetupDone && adminSubView === item.id;
              
              return (
                <button
                  key={item.id}
                  disabled={!isSetupDone}
                  onClick={() => changeView('admin', item.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
                    !isSetupDone 
                      ? 'opacity-30 cursor-not-allowed border-transparent text-gray-500' 
                      : isActive 
                        ? 'bg-brand-orange/10 border-brand-orange/30 text-white shadow-[0_0_15px_rgba(255,157,0,0.15)]' 
                        : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-orange' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5 leading-none">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="space-y-4">
          <button
            onClick={() => changeView('landing')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 bg-white/3 text-gray-300 hover:bg-brand-orange hover:text-white font-medium transition-all group duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Exit to Website</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Window */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[#090d16]">
        <div className="absolute top-0 right-0 w-[40vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[20%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
   
          {isSetupDone ? (
            children
          ) : (
            <div className="max-w-md mx-auto py-12">
              <InitialSetupForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}