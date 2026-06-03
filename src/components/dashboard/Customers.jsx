import { useState } from 'react';
import { useGym } from '../../context/useGym';
import { 
  Search, 
  ChevronRight, 
  Calendar, 
  Phone, 
  Mail, 
  Zap, 
  UserPlus, 
  Dumbbell, 
  RotateCcw, 
  X,
  History,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Customers() {
  const { 
    customers, 
    logSession, 
    renewSessions, 
    addCustomer 
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [packageFilter, setPackageFilter] = useState('All'); // 'All' | 'Starter Build' | 'Lean Shred' | 'Elite Lifestyle Protocol'
  
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New customer form states
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustPackage, setNewCustPackage] = useState('Lean Shred');
  const [newCustSessions, setNewCustSessions] = useState(12);

  // Renewal form states inside detail drawer
  const [sessionsToAdd, setSessionsToAdd] = useState(12);
  const [amountPaid, setAmountPaid] = useState(249);

  // Auto calculate typical renewal cost when session count changes
  const handleSessionsToAddChange = (count) => {
    setSessionsToAdd(count);
    const costMap = {
      10: 129,
      12: 249,
      20: 349,
      24: 449,
      36: 599
    };
    if (costMap[count]) {
      setAmountPaid(costMap[count]);
    }
  };

  const handleRegisterClient = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) return;

    addCustomer({
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone,
      packageName: newCustPackage,
      totalSessions: newCustSessions
    });

    // Reset Form
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustPackage('Lean Shred');
    setNewCustSessions(12);
    setShowAddForm(false);
  };

  // Find selected customer
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filter customers logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cust.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || cust.status === statusFilter;
    const matchesPackage = packageFilter === 'All' || cust.packageName === packageFilter;
    return matchesSearch && matchesStatus && matchesPackage;
  });

  return (
    <div className="space-y-8 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white">Client Directory</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage athlete records, log attended workouts, and handle renewals.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-3 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-black font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all self-start sm:self-center neon-border-cyan cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Register Client
        </button>
      </div>

      {/* Directory Filter System */}
      <div className="glass-card rounded-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
          />
        </div>

        {/* Status Select */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive/Expired</option>
          </select>
        </div>

        {/* Package Select */}
        <div className="md:col-span-3">
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
          >
            <option value="All">All Packages</option>
            <option value="Starter Build">Starter Build</option>
            <option value="Lean Shred">Lean Shred</option>
            <option value="Elite Lifestyle Protocol">Elite Lifestyle Protocol</option>
          </select>
        </div>
      </div>

      {/* Directory Grid/Table List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="py-4 px-6">Name / Contact</th>
                <th className="py-4 px-6">Package Level</th>
                <th className="py-4 px-6">Sessions Remaining</th>
                <th className="py-4 px-6">Joint Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 font-semibold">
                    No clients found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr 
                    key={cust.id} 
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="hover:bg-white/3 transition-colors cursor-pointer group"
                  >
                    <td className="py-5 px-6">
                      <div className="font-bold text-white group-hover:text-brand-orange transition-colors">{cust.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{cust.email} • {cust.phone}</div>
                    </td>
                    <td className="py-5 px-6 font-semibold text-gray-300">
                      {cust.packageName}
                    </td>
                    <td className="py-5 px-6 font-mono font-bold">
                      <span className={cust.sessionsRemaining === 0 ? 'text-red-500' : cust.sessionsRemaining <= 3 ? 'text-brand-orange' : 'text-brand-cyan'}>
                        {cust.sessionsRemaining}
                      </span>
                      <span className="text-gray-600 text-xs font-normal"> / {cust.totalSessions}</span>
                    </td>
                    <td className="py-5 px-6 text-gray-400">
                      {cust.joinDate}
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        cust.status === 'Active'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cust.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />
                        {cust.status === 'Active' ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerId(cust.id);
                        }}
                        className="p-1.5 rounded-lg border border-white/10 bg-[#111827] text-gray-400 hover:text-white group-hover:border-brand-orange/40 hover:bg-brand-orange/10 hover:border-brand-orange transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-brand-orange" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card Grid View */}
        <div className="lg:hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 font-semibold">
              No clients found matching the selected filters.
            </div>
          ) : (
            filteredCustomers.map(cust => (
              <div 
                key={cust.id} 
                onClick={() => setSelectedCustomerId(cust.id)}
                className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-orange/30 hover:bg-white/2 cursor-pointer transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">{cust.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{cust.email}</p>
                    <p className="text-xs text-gray-500">{cust.phone}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    cust.status === 'Active'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {cust.status === 'Active' ? 'Active' : 'Expired'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-white/5">
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Package</p>
                    <p className="font-semibold text-gray-300 truncate mt-0.5">{cust.packageName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Sessions</p>
                    <p className="font-semibold text-white mt-0.5">
                      <span className={cust.sessionsRemaining === 0 ? 'text-red-400' : 'text-brand-cyan'}>
                        {cust.sessionsRemaining}
                      </span>
                      <span className="text-gray-500"> / {cust.totalSessions}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {cust.joinDate}
                  </span>
                  <span className="text-brand-orange font-bold uppercase tracking-wider text-[10px] flex items-center gap-0.5">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Side Slide-out Drawer Panel for Customer details */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomerId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-out Drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl bg-[#0c1220] border-l border-white/10 h-full shadow-2xl p-6 md:p-8 overflow-y-auto flex flex-col justify-between"
            >
              {/* Close buttons */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-brand-orange" />
                  <span className="font-display text-lg font-bold uppercase tracking-wider text-white">Client Portfolio</span>
                </div>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8 flex-1">
                {/* Client Basic Details Card */}
                <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{selectedCustomer.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedCustomer.status === 'Active'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {selectedCustomer.status === 'Active' ? 'Active' : 'Expired'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-400">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-cyan" />
                      {selectedCustomer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-cyan" />
                      {selectedCustomer.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-cyan" />
                      Member Since: {selectedCustomer.joinDate}
                    </p>
                  </div>
                </div>

                {/* Session Progress Tracker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-300">
                    <span>Workout Credits Tracker</span>
                    <span className="font-mono">
                      <span className={selectedCustomer.sessionsRemaining === 0 ? 'text-red-500' : 'text-brand-cyan'}>
                        {selectedCustomer.sessionsRemaining}
                      </span>
                      <span className="text-gray-500"> / {selectedCustomer.totalSessions} Remaining</span>
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedCustomer.sessionsRemaining === 0 
                          ? 'bg-red-500' 
                          : 'bg-gradient-to-r from-brand-cyan to-brand-orange'
                      }`}
                      style={{ width: `${(selectedCustomer.sessionsRemaining / selectedCustomer.totalSessions) * 100}%` }}
                    />
                  </div>

                  {/* Log attended workout button */}
                  <button
                    onClick={() => logSession(selectedCustomer.id)}
                    disabled={selectedCustomer.status === 'Inactive'}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all mt-4 border ${
                      selectedCustomer.status === 'Active'
                        ? 'bg-brand-orange border-brand-orange text-white hover:bg-brand-orange-hover neon-border-orange cursor-pointer'
                        : 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-white animate-pulse" />
                    Log Attended Session
                  </button>
                  {selectedCustomer.status === 'Inactive' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400 mt-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <div>
                        <p className="font-bold">Account Expired / Inactive</p>
                        <p className="mt-0.5 font-normal">All sessions are depleted. Use the panel below to renew the package and reactivate the customer.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Renewal Form */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                  <h4 className="text-sm font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <RotateCcw className="w-4.5 h-4.5 text-brand-cyan" />
                    Renew or Add Sessions
                  </h4>
                  <p className="text-xs text-gray-400">Add credits and process renewals. Account reactivates automatically if it was inactive.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                        Sessions Count
                      </label>
                      <select
                        value={sessionsToAdd}
                        onChange={(e) => handleSessionsToAddChange(parseInt(e.target.value))}
                        className="w-full p-2.5 bg-[#090d16] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-brand-cyan/60"
                      >
                        <option value={10}>+10 sessions</option>
                        <option value={12}>+12 sessions</option>
                        <option value={20}>+20 sessions</option>
                        <option value={24}>+24 sessions</option>
                        <option value={36}>+36 sessions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                        Cost / Fee ($)
                      </label>
                      <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 bg-[#090d16] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-brand-cyan/60 font-semibold"
                        placeholder="Amount"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => renewSessions(selectedCustomer.id, sessionsToAdd, amountPaid)}
                    className="w-full py-3 bg-brand-cyan hover:bg-brand-cyan-hover text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer shadow-cyan mt-2"
                  >
                    Process Renewal
                  </button>
                </div>

                {/* History Log Feed */}
                <div className="space-y-3">
                  <h4 className="text-sm font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <History className="w-4.5 h-4.5 text-gray-400" />
                    Activity Logs
                  </h4>
                  <div className="max-h-56 overflow-y-auto no-scrollbar space-y-2 pr-1 text-xs">
                    {selectedCustomer.history.map((log, idx) => (
                      <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase mb-1 ${
                            log.type === 'session_logged'
                              ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/20'
                              : log.type === 'renewed'
                              ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {log.type.replace('_', ' ')}
                          </span>
                          <p className="text-gray-300 font-normal leading-relaxed">{log.info}</p>
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold shrink-0">{log.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register New Client Modal Dialogue */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0c1220] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white">Register New Athlete</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
                    placeholder="Enter athlete's name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Training System Package
                    </label>
                    <select
                      value={newCustPackage}
                      onChange={(e) => setNewCustPackage(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors"
                    >
                      <option value="Starter Build">Starter Build ($149/mo)</option>
                      <option value="Lean Shred">Lean Shred ($249/mo)</option>
                      <option value="Elite Lifestyle Protocol">Elite Lifestyle Protocol ($399/mo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Credits Total (Sessions)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={newCustSessions}
                      onChange={(e) => setNewCustSessions(parseInt(e.target.value) || 12)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-3 border border-white/10 rounded-xl hover:bg-white/5 text-gray-300 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-black font-bold text-xs uppercase tracking-wider transition-all neon-border-cyan cursor-pointer"
                  >
                    Initialize Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
