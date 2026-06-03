import { motion } from 'framer-motion';
import { Trophy, Users, ChevronDown, Sparkles, Zap, Edit2 } from 'lucide-react';
import { useGym } from '../context/useGym';

export default function Hero({ isEditing = false, data, onEditField }) {
  const { landingData } = useGym();
  
  // Safe loading guard to prevent crashes if landingData is not yet fetched from Firebase
  if (!landingData && !data) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Zap className="w-8 h-8 text-brand-orange animate-bounce" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Elite Portal...</p>
        </div>
      </div>
    );
  }

  // Fallback settings to gracefully handle empty database structures without breaking the UI
  const heroData = data || landingData?.hero || {
    welcomeBadge: "Welcome to Elite Force",
    headline: "Build Your Ultimate Performance",
    subtitle: "Custom programming, evidence-based nutrition, and elite coaching engineered for your specific physiological goals.",
    ctaPrimary: "Start Training",
    ctaSecondary: "View Packages",
    successRate: "98%",
    yearsExp: "5+",
    supportHours: "24/7",
    imageUrl: ""
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const badgeVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const badgeVariantsDelayed = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1.5
      }
    }
  };

  const renderEditable = (path, label, max, children) => {
    if (!isEditing) return children;
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onEditField(path, label, max);
        }}
        className="editable-field-active inline-block rounded border border-transparent p-0.5 relative transition-all group cursor-pointer"
        title={`Click to edit ${label} (Max ${max} chars)`}
      >
        <span className="absolute -top-3.5 -right-2 bg-brand-cyan text-black font-extrabold text-[8px] uppercase px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-0.5">
          <Edit2 className="w-2 h-2" />
          Edit
        </span>
        {children}
      </div>
    );
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-dark-bg"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-dark-bg/80 to-dark-bg pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        <motion.div 
          className="lg:col-span-7 text-left space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            {renderEditable(['welcomeBadge'], 'Welcome Badge', 50, (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-brand-orange">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                {heroData.welcomeBadge}
              </div>
            ))}
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight uppercase"
          >
            {renderEditable(['headline'], 'Hero Headline', 60, (
              <span className="text-white block">
                {heroData.headline}
              </span>
            ))}
          </motion.h1>

          <motion.div variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-xl font-normal leading-relaxed">
            {renderEditable(['subtitle'], 'Hero Subtitle', 200, (
              <p>{heroData.subtitle}</p>
            ))}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            {renderEditable(['ctaPrimary'], 'Primary CTA Button', 20, (
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, 'contact')}
                className="px-8 py-4 rounded-xl font-semibold bg-brand-orange text-white hover:bg-brand-orange-hover transition-all duration-300 transform hover:-translate-y-0.5 neon-border-orange flex items-center gap-2 group text-base"
              >
                {heroData.ctaPrimary}
                <Zap className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              </a>
            ))}
            
            {renderEditable(['ctaSecondary'], 'Secondary CTA Button', 20, (
              <a
                href="#packages"
                onClick={(e) => handleScrollTo(e, 'packages')}
                className="px-8 py-4 rounded-xl font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 text-base flex items-center gap-2"
              >
                {heroData.ctaSecondary}
              </a>
            ))}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="pt-8 border-t border-white/5 flex gap-8"
          >
            <div>
              {renderEditable(['successRate'], 'Success Rate Stat', 5, (
                <p className="text-3xl font-display font-bold text-white leading-none">{heroData.successRate}</p>
              ))}
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">Success Rate</p>
            </div>
            <div className="border-l border-white/10 pl-8">
              {renderEditable(['yearsExp'], 'Experience Stat', 5, (
                <p className="text-3xl font-display font-bold text-white leading-none">{heroData.yearsExp}</p>
              ))}
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">Years Experience</p>
            </div>
            <div className="border-l border-white/10 pl-8">
              {renderEditable(['supportHours'], 'Support Stat', 5, (
                <p className="text-3xl font-display font-bold text-white leading-none">{heroData.supportHours}</p>
              ))}
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">Direct Support</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[450px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[380px] h-[480px] rounded-3xl overflow-hidden glass-card relative flex items-center justify-center p-4 border border-white/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-brand-orange/10 z-10 pointer-events-none" />
            
            {isEditing && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditField(['imageUrl'], 'Hero Image URL', 300);
                }}
                className="absolute inset-x-4 top-4 z-30 bg-black/80 hover:bg-black border border-brand-cyan/40 hover:border-brand-cyan text-brand-cyan text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-cyan transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Upload / Replace URL
              </div>
            )}

            <div className="w-full h-full border border-white/5 rounded-2xl flex flex-col items-center justify-center relative bg-black/40 z-0 p-6 overflow-hidden">
              {heroData.imageUrl ? (
                <img 
                  src={heroData.imageUrl} 
                  alt="Coach Roman Performance" 
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                />
              ) : (
                <>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl z-0" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-cyan/20 rounded-full blur-2xl z-0" />
                  
                  <svg className="absolute w-[130%] h-[130%] opacity-20 text-brand-orange pointer-events-none z-0" viewBox="0 0 100 100" fill="none">
                    <path d="M10,90 Q40,40 60,60 T90,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M20,95 Q45,35 65,55 T80,5" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                </>
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                {!heroData.imageUrl && (
                  <Zap className="w-20 h-20 text-brand-orange drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] mb-4 animate-pulse" />
                )}
                
                <div className="space-y-2 mt-4 bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                  <p className="font-display text-2xl font-bold uppercase tracking-wider text-white">ELITE PERFORMANCE</p>
                  <p className="text-xs text-brand-orange font-semibold tracking-widest uppercase">TRAIN WITH PURPOSE</p>
                  <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed mt-2 mx-auto">
                    A high-end system built on biomechanics, custom programming, and progressive overload.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={badgeVariants}
            animate="animate"
            className="absolute top-8 -left-4 sm:-left-8 glass-card rounded-2xl p-4 flex items-center gap-3.5 shadow-xl border border-white/10 z-20 backdrop-blur-xl max-w-[190px]"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 text-brand-orange shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold font-display text-white leading-none">100+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Transformed Clients</p>
            </div>
          </motion.div>

          <motion.div 
            variants={badgeVariantsDelayed}
            animate="animate"
            className="absolute bottom-12 -right-4 sm:-right-8 glass-card rounded-2xl p-4 flex items-center gap-3.5 shadow-xl border border-white/10 z-20 backdrop-blur-xl max-w-[190px]"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20 text-brand-cyan shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold font-display text-white leading-none">Certified Pro</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">ISSA & NASM Elite</p>
            </div>
          </motion.div>

          <motion.div 
            variants={badgeVariants}
            animate="animate"
            className="absolute -bottom-4 left-6 glass-card rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xl border border-white/10 z-20 backdrop-blur-xl"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">Custom Meal Plans</span>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
        <a 
          href="#about"
          onClick={(e) => handleScrollTo(e, 'about')}
          className="text-gray-500 hover:text-white transition-colors flex flex-col items-center gap-1.5"
          aria-label="Scroll to philosophy"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Our Philosophy</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}