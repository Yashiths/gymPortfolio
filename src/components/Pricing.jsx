import { Check, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGym } from '../context/useGym';

export default function Pricing({ onSelectPackage, isEditing = false, data, onEditField }) {
  const { landingData } = useGym();
  
  // Use either local draft data or live production data
  const pricingData = data || landingData.pricing;

  const styleMapping = [
    {
      popular: false,
      accentColor: 'border-white/5 hover:border-brand-cyan/20',
      buttonBg: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white',
      badgeColor: 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20',
      goalCode: 'Strength Build'
    },
    {
      popular: true,
      accentColor: 'border-brand-orange/40 hover:border-brand-orange neon-border-orange bg-gradient-to-b from-brand-orange/[0.03] to-transparent',
      buttonBg: 'bg-brand-orange hover:bg-brand-orange-hover text-white neon-border-orange font-bold',
      badgeColor: 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30',
      goalCode: 'Fat Loss'
    },
    {
      popular: false,
      accentColor: 'border-white/5 hover:border-brand-cyan/20',
      buttonBg: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white',
      badgeColor: 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20',
      goalCode: 'Contest Prep'
    }
  ];

  const handleSelect = (goal, packageTitle) => {
    if (isEditing) return; // disable clicks during editing sessions

    if (onSelectPackage) {
      onSelectPackage(goal, packageTitle);
    }

    // Scroll to contact form
    const element = document.getElementById('contact');
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

  // Inline wrapper helper for CMS mode
  const renderEditable = (path, label, max, children) => {
    if (!isEditing) return children;
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onEditField(path, label, max);
        }}
        className="editable-field-active inline-block rounded border border-transparent p-0.5 relative transition-all group w-full text-left"
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
      id="packages" 
      className="py-24 relative overflow-hidden bg-dark-bg"
    >
      {/* Visual background lights */}
      <div className="absolute top-[40%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-cyan/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-orange">
            {renderEditable(['title'], 'Pricing Section Name', 30, (
              <span>{pricingData.title}</span>
            ))}
          </h2>
          <h3 className="text-4xl sm:text-5xl font-display font-bold uppercase text-white">
            {renderEditable(['subtitle'], 'Pricing Section Title', 50, (
              <span>{pricingData.subtitle}</span>
            ))}
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-cyan mx-auto rounded-full" />
          <div className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed pt-2">
            {renderEditable(['description'], 'Pricing Section Description', 150, (
              <p>{pricingData.description}</p>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingData?.packages?.map((pkg, idx) => {
            const style = styleMapping[idx] || styleMapping[0];
            const isPopular = style.popular;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`glass-card rounded-3xl p-8 flex flex-col justify-between relative border ${style.accentColor}`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-brand-orange text-white shadow-lg neon-border-orange tracking-widest">
                      Recommended / Most Popular
                    </span>
                  </div>
                )}

                {/* Title Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                      {renderEditable(['packages', idx, 'name'], `Package #${idx + 1} Name`, 30, (
                        <span>{pkg.name}</span>
                      ))}
                    </h4>
                    {isPopular && (
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/20">
                        High Demand
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-400 text-xs min-h-[40px] leading-relaxed">
                    {renderEditable(['packages', idx, 'tagline'], `Package #${idx + 1} Tagline`, 100, (
                      <p>{pkg.tagline}</p>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline py-4 border-y border-white/5">
                    <span className="text-5xl font-display font-bold text-white">
                      {renderEditable(['packages', idx, 'price'], `Package #${idx + 1} Price`, 10, (
                        <span>${pkg.price}</span>
                      ))}
                    </span>
                    <span className="text-gray-500 text-xs uppercase font-semibold tracking-wider ml-2">/ {pkg.period}</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 pt-6">
                    {pkg.features?.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 w-full">
                        <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-brand-orange" />
                        </div>
                        {renderEditable(['packages', idx, 'features', fIdx], `Package #${idx + 1} Feature #${fIdx + 1}`, 60, (
                          <span className="text-gray-300 text-sm font-medium leading-tight">{feature}</span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Select Button */}
                <div className="pt-8 mt-auto">
                  <button
                    onClick={() => handleSelect(style.goalCode, pkg.name)}
                    disabled={isEditing}
                    className={`w-full py-4 rounded-xl text-sm uppercase tracking-widest font-semibold transition-all duration-300 transform active:scale-95 ${
                      isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${style.buttonBg}`}
                  >
                    Select Program
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
