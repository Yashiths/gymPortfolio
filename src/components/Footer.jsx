import { Mail, ArrowUp } from 'lucide-react';
import { useGym } from '../context/useGym';
import {
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon
} from './dashboard/SocialIcons';

export default function Footer() {
  const { landingData } = useGym();

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Logo & Ethos Column */}
          <div className="md:col-span-6 space-y-4 text-left">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 font-display text-2xl font-bold uppercase tracking-wider"
            >
              <span className="text-white">Fittness with</span>
              <span className="text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">YASH</span>
            </a>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Bespoke coaching systems built on modern exercise physiology and flexible dieting science. Dedicated to high-performing professionals seeking permanent physical supremacy.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
            <a href={landingData?.contact?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/20 transition-all" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </a>
            <a href={landingData?.contact?.youtube || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/20 transition-all" aria-label="YouTube">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            <a href={landingData?.contact?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/20 transition-all" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </a>
            <a href={`mailto:${landingData?.contact?.email || 'coach@Fittness withYASH.com'}`} className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/20 transition-all" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-6">
              Coaching System
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="#about" className="text-gray-400 hover:text-brand-orange transition-colors">The Philosophy</a>
              </li>
              <li>
                <a href="#packages" className="text-gray-400 hover:text-brand-orange transition-colors">Training Packages</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-brand-orange transition-colors">Start Transformation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-orange transition-colors">Client Testimonials</a>
              </li>
            </ul>
          </div>

          {/* Contact Support info Column */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-6">
              Global Support
            </h4> 
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>{landingData?.contact?.email || 'N/A'}</span>
              </li>
              <li>
                <span className="block text-xs text-gray-500 uppercase tracking-widest font-semibold">Active Hours</span>
                <span className="text-gray-300 font-medium">{landingData?.contact?.activeHours || 'N/A'}</span>
              </li>
              <li>
                <span className="block text-xs text-gray-500 uppercase tracking-widest font-semibold">Direct Dispatch</span>
                <span className="text-brand-orange font-medium">WhatsApp Active Support</span> {/* This text is static, but the link is dynamic */}
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom area */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-2">
            <p className="text-xs text-gray-500 font-medium">
              &copy; {currentYear} Fittness with Yash. All Rights Reserved. Made for high performers.
            </p>
            <p className="text-[10px] text-gray-600 max-w-2xl leading-relaxed">
              Disclaimer: Consult with your physician before beginning any diet or exercise program. The information provided on this website is for educational and motivational purposes only and is not intended to substitute professional medical advice.
            </p>
          </div>

          {/* Scroll to top button */}
          <a
            href="#"
            onClick={handleScrollToTop}
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-brand-orange/30 hover:bg-brand-orange/10 flex items-center justify-center text-gray-400 hover:text-brand-orange transition-all shrink-0 shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
