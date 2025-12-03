import { Check } from 'lucide-react';
import { useState } from 'react';

export default function PricingCard({ name, price, priceId, features, recommended }) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    successUrl: `${window.location.origin}/dashboard?success=true`,
                    cancelUrl: `${window.location.origin}/?canceled=true`,
                }),
            });

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`relative rounded-2xl border p-8 transition-all ${recommended
                    ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-transparent shadow-lg shadow-emerald-500/20'
                    : 'border-white/10 bg-white/5'
                }`}
        >
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-sm font-bold text-white">
                    Most Popular
                </div>
            )}
            <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-white">{name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-gray-400">/month</span>
                </div>
            </div>
            <ul className="mb-8 space-y-3">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full rounded-xl py-3 font-semibold transition-all ${recommended
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20 disabled:bg-white/5'
                    } disabled:cursor-not-allowed`}
            >
                {loading ? 'Loading...' : 'Get Started'}
            </button>
        </div>
    );
}
