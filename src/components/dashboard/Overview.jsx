import { useState } from 'react';
import { useGym } from '../../context/useGym';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Calendar,
  PlusCircle,
  TrendingUp,
  Flame,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Overview() {
  const { 
    customers, 
    pendingBookings, 
    totalRevenue, 
    weeklyAttendance,
    logSession,
    acceptBooking,
    declineBooking
  } = useGym();

  const [selectedCustId, setSelectedCustId] = useState('');
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  // Calculate live values from state
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;
  const expiredCustomersCount = customers.filter(c => c.sessionsRemaining === 0).length;
  const pendingBookingsCount = pendingBookings.length;

  // Calculate Revenue distribution by packages
  const packageStats = {
    'Starter Build': { count: 0, price: 149 },
    'Lean Shred': { count: 0, price: 249 },
    'Fittness with Lifestyle Protocol': { count: 0, price: 399 }
  };

  customers.forEach(cust => {
    if (packageStats[cust.packageName]) {
      packageStats[cust.packageName].count += 1;
    }
  });

  const packageRevenueTotal = Object.keys(packageStats).reduce((acc, name) => {
    return acc + (packageStats[name].count * packageStats[name].price);
  }, 0) || 1; // avoid division by 0

  const handleQuickLog = (e) => {
    e.preventDefault();
    if (!selectedCustId) return;

    const customer = customers.find(c => c.id === selectedCustId);
    if (!customer) return;

    if (customer.sessionsRemaining <= 0) {
      setLogSuccessMessage(`Error: ${customer.name} has no sessions remaining!`);
      setTimeout(() => setLogSuccessMessage(''), 4000);
      return;
    }

    logSession(selectedCustId);
    setLogSuccessMessage(`Session logged successfully for ${customer.name}! (${customer.sessionsRemaining - 1} remaining)`);
    setSelectedCustId('');
    setTimeout(() => setLogSuccessMessage(''), 4000);
  };

  // Find active customers to display in quick log select
  const activeCustomersList = customers.filter(c => c.status === 'Active');

  // Chart configuration
  const maxAttendance = Math.max(...weeklyAttendance.map(d => d.count)) || 10;

  return (
    <div className="space-y-8">
      {/* View Title */}
      <div>
        <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm mt-0.5">Real-time metrics, client activities, and booking inquiries.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Active Customers */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 rounded-bl-full pointer-events-none group-hover:bg-brand-cyan/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Active Clients</span>
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-display font-bold text-white">{activeCustomersCount}</h3>
            <p className="text-xs text-brand-cyan font-semibold mt-1">Currently training</p>
          </div>
        </motion.div>

        {/* Metric 2: Total Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-bl-full pointer-events-none group-hover:bg-brand-orange/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-display font-bold text-white">${totalRevenue.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-xs text-brand-orange font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Accumulated earnings
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Expired Sessions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:bg-red-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Expired Sessions</span>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-display font-bold text-white">{expiredCustomersCount}</h3>
            <p className="text-xs text-red-500 font-semibold mt-1">Requires renewal</p>
          </div>
        </motion.div>

        {/* Metric 4: Pending Bookings */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full pointer-events-none group-hover:bg-yellow-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Leads captured</span>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-display font-bold text-white">{pendingBookingsCount}</h3>
            <p className="text-xs text-yellow-500 font-semibold mt-1">Pending inquiries</p>
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Quick Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Weekly Attendance Chart */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">Session Attendance</h3>
              <p className="text-xs text-gray-400">Total client workouts completed over the last 7 days.</p>
            </div>
            <div className="px-3 py-1 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 text-xs font-semibold text-brand-cyan uppercase">
              Weekly log
            </div>
          </div>

          {/* SVG Custom Bar Chart */}
          <div className="w-full h-64 flex items-end justify-between gap-4 pt-6 px-2">
            {weeklyAttendance.map((item, idx) => {
              const heightPercent = (item.count / maxAttendance) * 80; // scale to 80% max
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  {/* Bar value tooltip */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] bg-gray-900 border border-white/10 px-2 py-0.5 rounded text-white font-bold mb-1 leading-none shadow-lg">
                    {item.count}
                  </span>
                  
                  {/* Visual Bar with Gradient */}
                  <div className="w-full relative rounded-t-lg bg-white/5 border border-white/5 group-hover:border-brand-cyan/30 overflow-hidden min-h-[8px] flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-brand-cyan/50 to-brand-cyan rounded-t-md group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300"
                    />
                  </div>
                  
                  {/* Day Label */}
                  <span className="text-xs text-gray-500 font-semibold group-hover:text-brand-cyan transition-colors mt-1">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Action Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Log Session Card */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-brand-orange" />
                Quick Log Session
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Select an active customer to log a completed workout and decrement their session count instantly.
              </p>
            </div>

            <form onSubmit={handleQuickLog} className="space-y-4 pt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Active Client
                </label>
                <select
                  value={selectedCustId}
                  onChange={(e) => setSelectedCustId(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-orange/60 transition-colors"
                >
                  <option value="">-- Choose Client --</option>
                  {activeCustomersList.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.sessionsRemaining} left - {c.packageName})
                    </option>
                  ))}
                </select>
              </div>

              {logSuccessMessage && (
                <p className={`text-xs font-semibold p-3 rounded-lg ${
                  logSuccessMessage.startsWith('Error') 
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                    : 'bg-green-500/10 border border-green-500/20 text-green-400'
                }`}>
                  {logSuccessMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={!selectedCustId}
                className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm text-center transition-all ${
                  selectedCustId
                    ? 'bg-brand-orange hover:bg-brand-orange-hover text-white neon-border-orange cursor-pointer'
                    : 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                Log Attended Session
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Package Revenue Share & Leads Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Package Distribution Bar Panel */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-orange" />
              Package Performance
            </h3>
            <p className="text-xs text-gray-400 mt-1">Revenue distribution based on current active/inactive client enrollments.</p>
          </div>

          <div className="space-y-5 pt-6">
            {Object.keys(packageStats).map((name, index) => {
              const stat = packageStats[name];
              const revenue = stat.count * stat.price;
              const percent = Math.round((revenue / packageRevenueTotal) * 100) || 0;
              
              const colors = [
                'from-brand-cyan to-brand-cyan-hover shadow-cyan',
                'from-brand-orange to-brand-orange-hover shadow-orange',
                'from-purple-500 to-indigo-500 shadow-purple'
              ];

              return (
                <div key={name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-300">{name} (${stat.price})</span>
                    <span className="text-white">{stat.count} clients • ${revenue} ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${colors[index]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Requests Inquiries Panel */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-cyan" />
                Live Inquiries ({pendingBookingsCount})
              </h3>
              <p className="text-xs text-gray-400">Leads captured from the landing page Transformation Form.</p>
            </div>
            {pendingBookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/20 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                New Leads
              </span>
            )}
          </div>

          <div className="overflow-y-auto max-h-64 no-scrollbar space-y-4 pr-1">
            {pendingBookingsCount === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm font-semibold text-gray-500">No pending inquiries at this time.</p>
                <p className="text-xs text-gray-600">New lead submissions from the website contact page will appear here automatically.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{booking.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 text-[10px] uppercase font-bold tracking-wider">
                        {booking.packageName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{booking.email} • {booking.phone}</p>
                    <p className="text-xs text-gray-500 leading-relaxed italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                      "{booking.message}"
                    </p>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">{booking.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      onClick={() => acceptBooking(booking.id)}
                      className="px-3.5 py-2 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => declineBooking(booking.id)}
                      className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      title="Decline Inquiry"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
