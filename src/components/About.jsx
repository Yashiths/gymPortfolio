import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, Flame, Scale, Award, Edit2 } from 'lucide-react';
import { useGym } from '../context/useGym';

export default function About({ isEditing = false, data, onEditField }) {
  const { landingData } = useGym();
  
  // Use either local draft data or live production data
  const aboutData = data || landingData.about;

  const iconsMap = {
    'Precision Strength': Dumbbell,
    'Hypertrophy Mechanics': Flame,
    'Lifestyle Sustainability': Scale
  };

  const pillarColorMap = {
    0: { text: 'text-brand-orange', glow: 'from-brand-orange/20 to-transparent', border: 'hover:border-brand-orange/30' },
    1: { text: 'text-brand-cyan', glow: 'from-brand-cyan/20 to-transparent', border: 'hover:border-brand-cyan/30' },
    2: { text: 'text-green-400', glow: 'from-green-500/10 to-transparent', border: 'hover:border-green-500/20' }
  };

  // Inline wrapper helper for CMS mode
  const renderEditable = (path, label, max, children) => {
    if (!isEditing) return children;
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onEditField(path, label, max);
        }}
        className="editable-field-active inline-block rounded border border-transparent p-0.5 relative transition-all group w-full"
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
      id="about" 
      className="py-24 relative overflow-hidden bg-dark-bg border-y border-white/5"
    >
      {/* Decorative Light Spots */}
      <div className="absolute top-[10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-orange">
            The Philosophy
          </h2>
          <p className="text-4xl sm:text-5xl font-display font-bold uppercase text-white">
            DESIGNED FOR SUPREMACY. BUILT ON SCIENCE.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-cyan mx-auto rounded-full" />
        </div>

        {/* 2-Column Grid for Coach Bio and Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch">
          
          {/* Coach Bio Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between glass-card rounded-3xl p-8 md:p-10 border border-white/5 bg-gradient-to-br from-white/5 to-transparent"
          >
            <div className="space-y-6">
              <div>
                {renderEditable(['meetBadge'], 'Meet Coach Badge', 20, (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/15 border border-brand-orange/20 text-xs font-semibold text-brand-orange uppercase">
                    {aboutData.meetBadge}
                  </div>
                ))}
              </div>

              <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wide">
                {renderEditable(['title'], 'Bio Section Title', 60, (
                  <span>{aboutData.title}</span>
                ))}
              </h3>
              
              <div className="text-gray-400 leading-relaxed text-base font-normal space-y-4">
                {renderEditable(['bioParagraph1'], 'Bio Paragraph 1', 350, (
                  <p>{aboutData.bioParagraph1}</p>
                ))}
                {renderEditable(['bioParagraph2'], 'Bio Paragraph 2', 350, (
                  <p>{aboutData.bioParagraph2}</p>
                ))}
              </div>
            </div>
            
            {/* Signature Accent */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div>
                {renderEditable(['signatureName'], 'Signature Name', 30, (
                  <p className="text-sm font-semibold text-white uppercase">{aboutData.signatureName}</p>
                ))}
                {renderEditable(['signatureTitle'], 'Signature Title', 40, (
                  <p className="text-xs text-gray-500">{aboutData.signatureTitle}</p>
                ))}
              </div>
              
              <div className="font-display italic text-2xl font-bold text-brand-orange opacity-40 select-none">
                {renderEditable(['signatureAccent'], 'Signature Accent Word', 25, (
                  <span>{aboutData.signatureAccent}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Certifications Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 glass-card rounded-3xl p-8 md:p-10 border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex flex-col justify-between"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
                <Award className="text-brand-cyan w-6 h-6" />
                {renderEditable(['credentialsTitle'], 'Credentials Title', 45, (
                  <span>{aboutData.credentialsTitle}</span>
                ))}
              </h3>
              
              <div className="text-gray-400 text-sm leading-relaxed">
                {renderEditable(['credentialsText'], 'Credentials Text Intro', 200, (
                  <p>{aboutData.credentialsText}</p>
                ))}
              </div>
              
              <ul className="space-y-3.5 pt-2">
                {aboutData?.credentials?.map((cred, idx) => (
                  <li key={idx} className="flex items-start gap-3 w-full">
                    <ShieldCheck className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                    {renderEditable(['credentials', idx], `Credential #${idx + 1}`, 50, (
                      <span className="text-gray-300 font-medium text-sm leading-normal">{cred}</span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accent border banner */}
            <div className="mt-8 p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white uppercase">100% Scientific</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Strictly data-driven and biomechanically safe coaching.</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 3-Pillar Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutData?.pillars?.map((pillar, idx) => {
            const Icon = iconsMap[pillar.title] || Dumbbell;
            const style = pillarColorMap[idx] || pillarColorMap[0];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`glass-card rounded-2xl p-8 border border-white/5 relative group overflow-hidden ${style.border}`}
              >
                {/* Hover gradient layer */}
                <div className={`absolute inset-0 bg-gradient-to-b ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                
                {/* Card Icon */}
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${style.text} mb-6 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Card Content */}
                <h4 className="text-xl font-display font-bold text-white uppercase tracking-wide mb-3">
                  {renderEditable(['pillars', idx, 'title'], `Pillar #${idx + 1} Title`, 30, (
                    <span>{pillar.title}</span>
                  ))}
                </h4>
                
                <div className="text-gray-400 text-sm leading-relaxed">
                  {renderEditable(['pillars', idx, 'description'], `Pillar #${idx + 1} Description`, 150, (
                    <p>{pillar.description}</p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
