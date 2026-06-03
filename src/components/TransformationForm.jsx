import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Phone, Dumbbell, Award, AlertCircle, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { useGym } from '../context/useGym';

export default function TransformationForm({ selectedGoal, selectedPackage }) {
  const { addBooking, landingData } = useGym();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [experience, setExperience] = useState('Beginner');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const goal = userGoal || selectedGoal || 'Muscle Gain';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your contact phone number.');
      return;
    }

    setError('');

    // Pre-formatted text message template exactly as requested:
    const templateMessage = `Hi Coach! I want to join your Fittness with Coaching Program. Here are my details:\n- Name: ${name.trim()}\n- Contact: ${phone.trim()}\n- Email: ${email.trim()}\n- My Goal: ${goal}\n- Experience Level: ${experience}\n- Message: ${message.trim() || 'No additional comments.'}`;

    // 1. Log the lead directly in the Dashboard state
    const goalToPackageMap = {
      'Strength Build': 'Starter Build',
      'Fat Loss': 'Lean Shred',
      'Contest Prep': 'Fittness with Lifestyle Protocol',
      'Muscle Gain': 'Lean Shred' // fallback
    };
    
    addBooking({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      goal: goal,
      packageName: selectedPackage || goalToPackageMap[goal] || 'Starter Build',
      message: message.trim() || `Goal: ${goal}, Experience: ${experience}`
    });

    setIsSuccess(true);

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setExperience('Beginner');

    // 2. Encoded message string & Redirect to WhatsApp after brief delay
    const encodedMessage = encodeURIComponent(templateMessage);
    const waBase = landingData?.contact?.whatsappLink || 'https://wa.me/94764195746';
    const whatsAppUrl = `${waBase}${waBase.includes('?') ? '&' : '?'}text=${encodedMessage}`;

    setTimeout(() => {
      setIsSuccess(false);
      window.open(whatsAppUrl, '_blank');
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="py-24 relative overflow-hidden bg-dark-bg border-t border-white/5"
    >
      {/* Background Ornaments */}
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-orange">
            Apply Now
          </h2>
          <p className="text-4xl sm:text-5xl font-display font-bold uppercase text-white">
            START YOUR TRANSFORMATION
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-cyan mx-auto rounded-full" />
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed pt-2">
            Fill out your details below. Your submission will register live in the portal and compile a direct application message to Coach Roman via secure WhatsApp dispatch.
          </p>
        </div>

        {/* Outer Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 bg-gradient-to-b from-white/5 to-transparent shadow-2xl relative"
        >
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#0c1220]/95 backdrop-blur-md rounded-3xl z-30 flex flex-col items-center justify-center p-8 text-center space-y-4"
              >
                <CheckCircle className="w-16 h-16 text-brand-cyan animate-bounce" />
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Application Captured!</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Your lead is registered in the trainer database. Launching secure WhatsApp link to submit directly to Coach Roman...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedPackage && (
            <div className="mb-8 p-4 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex justify-between items-center">
              <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">Selected Program:</span>
              <span className="text-xs text-brand-orange font-bold uppercase tracking-wider bg-brand-orange/10 px-3 py-1 rounded border border-brand-orange/20">
                {selectedPackage}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Client Name Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-orange" />
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-sm font-medium"
                />
              </div>

              {/* Email Address Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-orange" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-sm font-medium"
                />
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-orange" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-sm font-medium"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Goal Select Dropdown */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-brand-cyan" />
                  Primary Training Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all text-sm font-medium cursor-pointer"
                >
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Contest Prep">Contest Prep</option>
                  <option value="Strength Build">Strength Build</option>
                </select>
              </div>

              {/* Fitness Experience Dropdown */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-cyan" />
                  Current Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all text-sm font-medium cursor-pointer"
                >
                  <option value="Beginner">Beginner (Under 1 Year)</option>
                  <option value="Intermediate">Intermediate (1-3 Years)</option>
                  <option value="Advanced Athlete">Advanced Athlete (3+ Years)</option>
                  <option value="Competitive Competitor">Competitive Competitor</option>
                </select>
              </div>

            </div>

            {/* Additional Message Comments */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-orange" />
                Additional Message / Notes
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let Coach Roman know about your training history, medical conditions, or availability..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-sm font-medium"
              />
            </div>

            {/* Note about Whatsapp Dispatch */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 text-left leading-relaxed">
              <strong>Notice:</strong> Submitting this form will securely register your request in the Coach Portal and open your device's WhatsApp application with the formatted message template pre-filled for Coach Roman Vance.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest text-sm bg-gradient-to-r from-brand-orange to-brand-orange-hover hover:from-brand-orange-hover hover:to-brand-orange transition-all duration-300 transform active:scale-[0.98] neon-border-orange flex items-center justify-center gap-2 cursor-pointer"
            >
              Submit Application
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
