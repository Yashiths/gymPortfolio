import { useState } from 'react';
import { Menu, X, ArrowRight, UserCheck, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGym } from '../context/useGym';
export default function Navbar() {
  const { currentView, changeView, authSettings, setIsAdminAuthenticated } = useGym();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navigation items configuration
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Transformations', href: '#transformations' },
    { name: 'Pricing', href: '#packages' },
    { name: 'Apply', href: '#contact' },
  ];

  // Auth modal structural states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Smooth scroll helper
  const handleScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elem.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false); // Close mobile menu if open
  };

  // Dynamic login handler based on system setup status
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authSettings) return;

    if (!authSettings.is_setup_completed) {
      // First Time Login: Check against master key
      if (masterKeyInput === authSettings.master_key) {
        proceedToDashboard();
      } else {
        setAuthError(true);
      }
    } else {
      // Subsequent Logins: Check against saved Email & Password
      if (emailInput === authSettings.trainer_email && passwordInput === authSettings.trainer_password) {
        proceedToDashboard();
      } else {
        setAuthError(true);
      }
    }
  };

  const proceedToDashboard = () => {
    setAuthError(false);
    setIsAuthModalOpen(false);
    setMasterKeyInput('');
    setEmailInput('');
    setPasswordInput('');
    setIsOpen(false);
    setIsAdminAuthenticated(true);
    changeView('admin'); // Navigate straight to dashboard portal
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setMasterKeyInput('');
    setEmailInput('');
    setPasswordInput('');
    setAuthError(false);
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#090d16]/80 backdrop-blur-md border-b border-white/5 py-4 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleScroll(e, '#home')}
            className="text-white font-bold text-xl uppercase tracking-wider shrink-0"
          >
            ELITE <span className="text-brand-orange">FORCE</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:block px-5 py-2 rounded-full border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 text-xs font-bold uppercase transition-all"
            >
              Trainer Portal
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-[#0c1220] border-b border-white/5 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-lg font-display font-bold uppercase tracking-wider text-gray-300 hover:text-brand-orange transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-orange text-white font-bold uppercase tracking-widest text-xs shadow-orange"
                >
                  <UserCheck className="w-4 h-4" />
                  Trainer Portal
                </button>
                <p className="text-[10px] text-gray-500 text-center mt-4 uppercase tracking-widest">
                  Secure System Authorization Required
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Gateway Modal Overlay */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-[#111827] border border-gray-800 p-6 md:p-8 rounded-2xl w-full max-w-md relative shadow-2xl"
            >
              <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-3 border border-brand-orange/20">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 uppercase tracking-wider">Trainer Gateway</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {!authSettings?.is_setup_completed
                    ? "Initial terminal activation required. Enter Master Code."
                    : "Provide your cloud credentials to access dashboard."}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!authSettings?.is_setup_completed ? (
                  // Initial Mode: Only shows Master Pin Input field
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Master Activation Pin</label>
                    <input
                      type="password"
                      placeholder="Enter 1234..."
                      value={masterKeyInput}
                      onChange={(e) => { setMasterKeyInput(e.target.value); setAuthError(false); }}
                      className={`w-full bg-[#090d16] border rounded-xl px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-brand-orange transition-colors ${authError ? 'border-red-500' : 'border-gray-700'}`}
                    />
                  </div>
                ) : (
                  // Production Mode: Multi-device cloud login fields
                  <>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Trainer Email</label>
                      <input
                        type="email"
                        placeholder="trainer@eliteforce.com"
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setAuthError(false); }}
                        className={`w-full bg-[#090d16] border rounded-xl px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-brand-orange transition-colors ${authError ? 'border-red-500' : 'border-gray-700'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Secret Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false); }}
                        className={`w-full bg-[#090d16] border rounded-xl px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-brand-orange transition-colors ${authError ? 'border-red-500' : 'border-gray-700'}`}
                      />
                    </div>
                  </>
                )}

                {authError && (
                  <p className="text-[11px] text-red-500 mt-1 pl-1">
                    {!authSettings?.is_setup_completed ? "Invalid master key architecture authorization." : "Invalid credential sequence mapping. Access Denied."}
                  </p>
                )}

                <button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-wider text-xs">
                  Verify & Enter
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}