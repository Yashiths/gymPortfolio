import { useState, useEffect } from 'react';
import { useGym } from '../../context/useGym';
import { KeyRound, CheckCircle, Mail, Clock, Link, AlertCircle } from 'lucide-react';
import {
    InstagramIcon, YoutubeIcon, TwitterIcon
} from './SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
    const { trainerKey, updateTrainerKey, landingData, updateLandingData } = useGym();

    // Trainer Credentials State
    const [newTrainerKey, setNewTrainerKey] = useState('');
    const [trainerKeySuccess, setTrainerKeySuccess] = useState(false);

    // Contact Information State
    const [email, setEmail] = useState(landingData?.contact?.email || '');
    const [activeHours, setActiveHours] = useState(landingData?.contact?.activeHours || '');
    const [whatsappLink, setWhatsappLink] = useState(landingData?.contact?.whatsappLink || '');
    const [instagramLink, setInstagramLink] = useState(landingData?.contact?.instagram || '');
    const [youtubeLink, setYoutubeLink] = useState(landingData?.contact?.youtube || '');
    const [twitterLink, setTwitterLink] = useState(landingData?.contact?.twitter || '');
    const [contactSaveSuccess, setContactSaveSuccess] = useState(false);
    const [contactSaveError, setContactSaveError] = useState('');

    // Sync form fields with landingData if it changes externally
    useEffect(() => {
        setEmail(landingData?.contact?.email || '');
        setActiveHours(landingData?.contact?.activeHours || '');
        setWhatsappLink(landingData?.contact?.whatsappLink || '');
        setInstagramLink(landingData?.contact?.instagram || '');
        setYoutubeLink(landingData?.contact?.youtube || '');
        setTwitterLink(landingData?.contact?.twitter || '');
    }, [landingData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTrainerKey.trim().length > 0) {
            updateTrainerKey(newTrainerKey);
            setTrainerKeySuccess(true);
            setNewTrainerKey('');
            setTimeout(() => setTrainerKeySuccess(false), 3000);
        }
    };

    const handleContactSave = async (e) => {
        e.preventDefault();
        setContactSaveError('');
        setContactSaveSuccess(false);

        try {
            const updatedContact = {
                email,
                activeHours,
                whatsappLink,
                instagram: instagramLink,
                youtube: youtubeLink,
                twitter: twitterLink,
            };
            await updateLandingData({ ...landingData, contact: updatedContact });
            setContactSaveSuccess(true);
            setTimeout(() => setContactSaveSuccess(false), 3000);
        } catch (error) {
            setContactSaveError('Failed to save contact info: ' + error.message);
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white">Settings</h2>
                <p className="text-gray-400 text-sm mt-0.5">Manage application-wide settings and credentials.</p>
            </div>

            {/* Trainer Credentials Section */}
            <div className="glass-card rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <KeyRound className="text-brand-orange w-6 h-6" />
                    <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white">Trainer Credentials</h3>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                    Current Master Key: <span className="text-brand-cyan font-mono font-bold">{trainerKey}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">New Master Key</label>
                        <input
                            type="text"
                            placeholder="Enter new master password/pin..."
                            value={newTrainerKey}
                            onChange={(e) => setNewTrainerKey(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-wider text-xs"
                    >
                        Update Master Key
                    </button>
                </form>

                <AnimatePresence>
                    {trainerKeySuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-4 flex items-center gap-2 text-emerald-500 text-xs bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Master key updated successfully!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Contact Information Section */}
            <div className="glass-card rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <Mail className="text-brand-cyan w-6 h-6" />
                    <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white">Contact Information</h3>
                </div>

                <AnimatePresence>
                    {contactSaveError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span>{contactSaveError}</span>
                        </motion.div>
                    )}
                    {contactSaveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Contact information saved successfully!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleContactSave} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="coach@eliteforce.com"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                    </div>

                    {/* Active Hours */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Active Hours
                        </label>
                        <input
                            type="text"
                            value={activeHours}
                            onChange={(e) => setActiveHours(e.target.value)}
                            placeholder="06:00 AM - 10:00 PM EST"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                    </div>

                    {/* WhatsApp Link */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <Link className="w-3.5 h-3.5" />
                            WhatsApp Link
                        </label>
                        <input
                            type="url"
                            value={whatsappLink}
                            onChange={(e) => setWhatsappLink(e.target.value)}
                            placeholder="https://wa.me/your-number"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                    </div>

                    {/* Instagram Link */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <InstagramIcon className="w-3.5 h-3.5" />
                            Instagram URL
                        </label>
                        <input
                            type="url"
                            value={instagramLink}
                            onChange={(e) => setInstagramLink(e.target.value)}
                            placeholder="https://instagram.com/your-profile"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                    </div>

                    {/* YouTube Link */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <YoutubeIcon className="w-3.5 h-3.5" />
                            YouTube URL
                        </label>
                        <input
                            type="url"
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            placeholder="https://youtube.com/your-channel"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                    </div>

                    {/* Twitter Link */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <TwitterIcon className="w-3.5 h-3.5" />
                            Twitter URL
                        </label>
                        <input
                            type="url"
                            value={twitterLink}
                            onChange={(e) => setTwitterLink(e.target.value)}
                            placeholder="https://twitter.com/your-profile"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-black font-bold uppercase tracking-wider text-xs transition-all shadow-cyan"
                    >
                        Save Contact Info
                    </button>
                </form>
            </div>
        </div>
    );
}