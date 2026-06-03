import { useState } from 'react';
import { useGym } from '../../context/useGym';

export default function InitialSetupForm() {
    const { setupTrainerCredentials } = useGym();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await setupTrainerCredentials(email, password);
        } catch (err) {
            setError(err.message || 'Failed to initialize credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl">
            <div className="mb-6 text-center">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                    Account Initialization
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                    Set up your permanent admin credentials below
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Admin Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@Fittness withYASH.com"
                        className="w-full px-4 py-3 bg-[#0d1220] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Master Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-[#0d1220] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 rounded-xl bg-brand-orange text-white font-semibold text-sm hover:bg-brand-orange-hover transition-all disabled:opacity-50 tracking-wider uppercase"
                >
                    {loading ? 'Initializing...' : 'Save & Launch Portal'}
                </button>
            </form>
        </div>
    );
}