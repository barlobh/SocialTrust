import React from 'react';
import PricingCard from '../components/PricingCard';

export default function PricingSection() {
    const plans = [
        {
            name: 'Starter',
            price: 29,
            priceId: 'price_starter', // Replace with your Stripe Price ID
            features: [
                'Up to 5 widgets',
                '1,000 reviews/month',
                'Basic analytics',
                'Email support',
                'Auto-updating widgets',
            ],
        },
        {
            name: 'Professional',
            price: 79,
            priceId: 'price_professional', // Replace with your Stripe Price ID
            recommended: true,
            features: [
                'Unlimited widgets',
                '10,000 reviews/month',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                'API access',
                'Multi-user accounts',
            ],
        },
        {
            name: 'Enterprise',
            price: 199,
            priceId: 'price_enterprise', // Replace with your Stripe Price ID
            features: [
                'Unlimited everything',
                'Dedicated account manager',
                'Custom integrations',
                'SLA guarantee',
                'White-label option',
                'Advanced security',
            ],
        },
    ];

    return (
        <div id="pricing" className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-400">Choose the plan that fits your business</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <PricingCard key={plan.name} {...plan} />
                ))}
            </div>
        </div>
    );
}
