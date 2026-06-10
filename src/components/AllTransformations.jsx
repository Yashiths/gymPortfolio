import { motion } from 'framer-motion';
import { Scale, Flame, Clock, Trophy, ArrowLeft } from 'lucide-react';
import { useGym } from '../context/useGym';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AllTransformations() {
  const { transformations } = useGym();
  const navigate = useNavigate();

  const displayTransformations = transformations?.length > 0 ? transformations : [
    {
      id: "demo-1",
      clientName: "Sahan Perera",
      programName: "Lean Shred Protocol",
      duration: "12 Weeks",
      beforeImageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600", 
      afterImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      metrics: { weightBefore: "88 kg", weightAfter: "74 kg", fatLoss: "-10%" }
    },
    {
      id: "demo-2",
      clientName: "Arjun Mehta",
      programName: "Strength Build",
      duration: "16 Weeks",
      beforeImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600", 
      afterImageUrl: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?w=600",
      metrics: { weightBefore: "70 kg", weightAfter: "78 kg", fatLoss: "-4%" }
    }
  ];

  return (
    <div className="bg-[#090d16] min-h-screen text-gray-100 antialiased overflow-x-hidden">
      <Navbar />
      
      <main className="py-20 relative">
        {/* Background Ornaments */}
        <div className="absolute top-[10%] right-0 w-[50vw] h-[50vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-0 w-[40vw] h-[40vw] rounded-full bg-brand-cyan/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-widest hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
              <h1 className="text-4xl sm:text-6xl font-display font-bold uppercase text-white">THE HALL OF EVOLUTION</h1>
              <div className="w-24 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-orange rounded-full" />
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Explore the complete directory of physical supremacy achieved through biomechanical mastery and precise nutrition.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayTransformations.map((trans, idx) => (
              <motion.div
                key={trans.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col group hover:border-brand-cyan/20 transition-all shadow-2xl bg-white/2"
              >
                <div className="relative h-[300px] flex overflow-hidden">
                  <div className="relative w-1/2 h-full border-r border-white/10">
                    <img src={trans?.beforeImageUrl} alt="Before" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="relative w-1/2 h-full">
                    <img src={trans?.afterImageUrl} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white uppercase">{trans?.clientName}</h3>
                      <p className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{trans?.programName}</p>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-gray-400 uppercase">{trans?.duration}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <MetricBadge label="Before" value={trans?.metrics?.weightBefore} color="white" />
                    <MetricBadge label="After" value={trans?.metrics?.weightAfter} color="cyan" />
                    <MetricBadge label="Fat Loss" value={trans?.metrics?.fatLoss} color="orange" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MetricBadge({ label, value, color }) {
  const colors = {
    cyan: "text-brand-cyan",
    orange: "text-brand-orange",
    white: "text-gray-400"
  };
  return (
    <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
      <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
      <p className={`text-xs font-bold font-mono ${colors[color]}`}>{value || 'N/A'}</p>
    </div>
  );
}