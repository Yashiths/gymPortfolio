import { motion } from 'framer-motion';
import { Scale, Flame, Clock, Trophy, ArrowRight } from 'lucide-react';
import { useGym } from '../context/useGym';
import { useNavigate } from 'react-router-dom';

export default function Transformations() {
  const { transformations } = useGym();
  const navigate = useNavigate();

  // 💡 Firestore එක හිස් නම් පෙන්වන්න සුපිරි Fallback (Demo) Data එකක් සෙට් කරා ක්‍රෑෂ් නොවී පේන්න
  const displayTransformations = transformations?.length > 0 ? transformations : [
    {
      id: "demo-transformation",
      clientName: "Sahan Perera",
      programName: "Lean Shred Protocol",
      duration: "12 Weeks",
      beforeImageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600", 
      afterImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      metrics: {
        weightBefore: "88 kg",
        weightAfter: "74 kg",
        fatLoss: "-10%"
      }
    }
  ];

  return (
    <section id="transformations" className="py-24 relative overflow-hidden bg-dark-bg">
      {/* Background Ornaments */}
      <div className="absolute top-[30%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-cyan/5 blur-[130px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-cyan">Success Stories</h2>
          <p className="text-4xl sm:text-5xl font-display font-bold uppercase text-white">Fittness with EVOLUTIONS</p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-12">
          {displayTransformations.slice(0, 2).map((trans, idx) => (
            <motion.div
              key={trans.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card rounded-[2rem] overflow-hidden border border-white/5 grid grid-cols-1 lg:grid-cols-12 items-center group hover:border-white/10 transition-all shadow-2xl"
            >
              {/* Images Column */}
              <div className="lg:col-span-6 relative h-[400px] sm:h-[500px] flex overflow-hidden bg-black/20">
                <div className="relative w-1/2 h-full border-r border-white/10">
                  <img src={trans?.beforeImageUrl} alt="Before" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">Before</div>
                </div>
                <div className="relative w-1/2 h-full">
                  <img src={trans?.afterImageUrl} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-brand-orange text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-orange">After</div>
                </div>
              </div>

              {/* Info Column */}
              <div className="lg:col-span-6 p-8 md:p-12 space-y-8 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-brand-orange" />
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">{trans?.programName}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase">{trans?.clientName}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCard icon={<Scale className="w-4 h-4" />} label="Weight Shift" value={`${trans?.metrics?.weightBefore || 'N/A'} → ${trans?.metrics?.weightAfter || 'N/A'}`} color="cyan" />
                  <MetricCard icon={<Flame className="w-4 h-4" />} label="Body Fat" value={trans?.metrics?.fatLoss || 'N/A'} color="orange" />
                  <MetricCard icon={<Clock className="w-4 h-4" />} label="Timeline" value={trans?.duration || 'N/A'} color="white" />
                </div>
                
                <p className="text-gray-500 text-xs italic leading-relaxed">
                  *Results achieved through strictly adhered biomechanical programming and evidence-based nutritional protocols.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => navigate('/transformations')}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all group shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10">View All Success Stories</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform text-brand-orange" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/0 via-brand-orange/5 to-brand-orange/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value, color }) {
  const colors = {
    cyan: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20",
    orange: "text-brand-orange bg-brand-orange/10 border-brand-orange/20",
    white: "text-white bg-white/5 border-white/10"
  };

  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} flex flex-col gap-2`}>
      <div className="flex items-center gap-2 opacity-70">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-bold font-mono text-white">{value}</span>
    </div>
  );
}