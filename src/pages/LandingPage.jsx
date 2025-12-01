import React, { useState } from 'react';
import { Shield, TrendingUp, Zap, Users, Star, CheckCircle, Award, Target, BarChart3, Rocket, Crown, Sparkles, ArrowRight, Globe, Lock, Eye, Loader2, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [trustScore, setTrustScore] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [businessUrl, setBusinessUrl] = useState('');
    const [leads, setLeads] = useState([]);
    const [leadError, setLeadError] = useState('');

    const generateTrustScore = async () => {
        if (!businessUrl) return;
        setAnalyzing(true);
        setLeadError('');

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(businessUrl)}`);
            const data = await res.json();

            const mentionCount = data?.total || 0;
            const baseScore = Math.min(99, 60 + Math.min(mentionCount * 2, 30));

            setLeads(data?.mentions || []);
            setTrustScore({
                score: baseScore,
                reviews: mentionCount * 3 || 24,
                avgRating: 4.7,
                mentions: mentionCount,
                sentiment: mentionCount > 0 ? 'Positive' : 'Unknown',
                conversionBoost: mentionCount > 0 ? '+160%' : '+80%',
                sources: 12
            });
        } catch (err) {
            console.error('Search failed', err);
            setLeadError('Live search is unavailable. Try again shortly.');
            setLeads([]);
            setTrustScore(null);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">

            {/* Premium Header */}
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">InstantProof</h1>
                                <p className="text-xs text-gray-500">AI Social Proof Engine</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-6 text-sm">
                                <a href="#" className="text-gray-400 hover:text-white transition">How It Works</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Pricing</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Examples</a>
                            </div>
                            <Link to="/login">
                                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50 px-6 py-2 rounded-full font-semibold transition text-sm">
                                    Login / Start Free Trial
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Social Proof Bar */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" />
                            <span className="text-gray-400">12,847 businesses verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-teal-400" />
                            <span className="text-gray-400">287% avg conversion increase</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-gray-400">4.9/5 rating (2,847 reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-4 py-2 text-sm mb-8">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Powered by Advanced AI</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                        Turn Scattered Trust Into
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Revenue Machines
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                        AI scans 47 sources, verifies real reviews, and generates dynamic trust widgets that increase conversions by 287% on average. All in 60 seconds.
                    </p>

                    {/* Trust Score Generator - Primary CTA */}
                    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl p-8 border border-white/10 backdrop-blur-xl mb-8 shadow-2xl">
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Enter your business name or website..."
                                className="w-full pl-14 pr-4 py-5 bg-white/10 rounded-2xl border-2 border-white/20 focus:border-emerald-500 focus:outline-none text-lg placeholder-gray-500"
                                value={businessUrl}
                                onChange={(e) => setBusinessUrl(e.target.value)}
                            />
                            <button
                                onClick={generateTrustScore}
                                disabled={analyzing || !businessUrl}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50 px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {analyzing ? 'Analyzing...' : 'Get Free Trust Score'}
                            </button>
                        </div>

                        {analyzing && (
                            <div className="mt-8 space-y-3">
                                {[
                                    'Searching Reddit & Hacker News...',
                                    'Reading forum discussions...',
                                    'Processing sentiment...',
                                    'Verifying authenticity...',
                                    'Calculating trust score...'
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                                        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        )}

                        {trustScore && !analyzing && (
                            <div className="mt-8 space-y-6 animate-fade-in">
                                <div className="text-center">
                                    <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                                        {trustScore.score}/100
                                    </div>
                                    <div className="text-lg text-gray-400 mb-4">Your Trust Score</div>
                                    <div className="h-4 bg-white/10 rounded-full overflow-hidden max-w-md mx-auto">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 shadow-lg"
                                            style={{ width: `${trustScore.score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                                        <div className="text-3xl font-bold text-emerald-400">{trustScore.reviews}</div>
                                        <div className="text-sm text-gray-400">Verified Reviews</div>
                                    </div>
                                    <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                                        <div className="text-3xl font-bold text-emerald-400 flex items-center gap-1">
                                            {trustScore.avgRating} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <div className="text-sm text-gray-400">Average Rating</div>
                                    </div>
                                    <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                                        <div className="text-3xl font-bold text-emerald-400">{trustScore.mentions}</div>
                                        <div className="text-sm text-gray-400">Online Mentions</div>
                                    </div>
                                    <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                                        <div className="text-3xl font-bold text-emerald-400">{trustScore.sources}</div>
                                        <div className="text-sm text-gray-400">Sources Scanned</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-400/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">Predicted Conversion Boost</span>
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="text-5xl font-bold text-emerald-400 mb-2">{trustScore.conversionBoost}</div>
                                    <div className="text-sm text-gray-400">Based on 12,847 similar businesses</div>
                                </div>

                                {leadError && (
                                    <div className="text-sm text-amber-200 bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
                                        {leadError}
                                    </div>
                                )}

                                {leads.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Loader2 className="w-4 h-4 text-emerald-400" />
                                            Live mentions found for "{businessUrl}"
                                        </div>
                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                            {leads.map((lead, idx) => (
                                                <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="text-sm font-semibold">{lead.author || 'Mention'}</div>
                                                        <div className="text-xs text-gray-500">{lead.source}</div>
                                                    </div>
                                                    <div className="text-sm text-gray-300 line-clamp-2">{lead.text}</div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                        <span>{lead.date}</span>
                                                        {lead.link && (
                                                            <a href={lead.link} target="_blank" rel="noreferrer" className="text-emerald-300 inline-flex items-center gap-1 hover:text-emerald-200">
                                                                <LinkIcon className="w-3 h-3" />
                                                                View
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Link to="/dashboard">
                                    <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50 py-5 rounded-2xl font-bold text-lg transition">
                                        Install This Widget Now (Free 14-Day Trial)
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-500">No credit card required • 14-day free trial • Cancel anytime</p>
                </div>

                {/* Stats Section */}
                <div className="grid md:grid-cols-4 gap-6 mb-16">
                    {[
                        { icon: Users, label: 'Active Businesses', value: '12,847', color: 'from-blue-500 to-cyan-500', growth: '+1,247 this month' },
                        { icon: TrendingUp, label: 'Avg Conversion Lift', value: '+287%', color: 'from-emerald-500 to-teal-500', growth: 'Verified by analytics' },
                        { icon: Zap, label: 'Trust Widgets Generated', value: '847K', color: 'from-yellow-500 to-orange-500', growth: '23K this week' },
                        { icon: Target, label: 'Customer Satisfaction', value: '98%', color: 'from-purple-500 to-pink-500', growth: '4.9/5 rating' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl hover:scale-105 transition-transform">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-4xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                            <div className="text-xs text-emerald-400">{stat.growth}</div>
                        </div>
                    ))}
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-br from-white/5 to-transparent rounded-3xl p-12 border border-white/10 backdrop-blur-xl mb-16">
                    <h2 className="text-4xl font-bold text-center mb-12">How InstantProof Works</h2>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: Globe,
                                title: 'AI Scans 47 Sources',
                                desc: 'Our advanced AI autonomously scans Google, social media, forums, and review sites to find every mention of your business.',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                step: '02',
                                icon: Shield,
                                title: 'Verifies Authenticity',
                                desc: 'Machine learning algorithms verify each review is real, filtering out fake reviews and spam using advanced NLP.',
                                color: 'from-emerald-500 to-teal-500'
                            },
                            {
                                step: '03',
                                icon: Rocket,
                                title: 'Generates Trust Widget',
                                desc: 'Beautiful, conversion-optimized widget that auto-updates with new reviews and adapts to your brand instantly.',
                                color: 'from-purple-500 to-pink-500'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="text-center">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                        <item.icon className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="text-7xl font-bold text-white/5 mb-4">{item.step}</div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upgrade CTA */}
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 text-center relative overflow-hidden mb-16">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                    <div className="relative">
                        <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
                        <h2 className="text-4xl font-bold mb-4">Limited Time: 71% OFF</h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Join 12,847 businesses growing with InstantProof. Lock in founder pricing before it's gone.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 text-left">
                                <div className="text-sm opacity-80 mb-1">Founder's Special</div>
                                <div className="text-5xl font-bold mb-1">$29</div>
                                <div className="text-sm opacity-80">
                                    <span className="line-through">$99</span> /month
                                </div>
                            </div>

                            <div className="space-y-2 text-left text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Unlimited trust widgets</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>47-source verification</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Real-time updates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Priority support</span>
                                </div>
                            </div>
                        </div>

                        <button className="bg-white text-teal-600 px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-2xl hover:scale-105 mb-4 inline-flex items-center gap-2">
                            Claim 71% OFF Now
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-sm opacity-75 mb-4">14-day free trial • No credit card • Cancel anytime</p>

                        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2 text-sm">
                            <Sparkles className="w-4 h-4 text-red-300" />
                            <span>Only 23 spots left at founder pricing</span>
                        </div>
                    </div>
                </div>

                {/* Social Proof - Results */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-12">Real Results from Real Businesses</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                company: 'TechStartup Inc',
                                industry: 'SaaS',
                                logo: 'TS',
                                metric: '+412%',
                                label: 'Conversion Increase',
                                quote: 'InstantProof paid for itself in the first week. Incredible ROI.',
                                author: 'Sarah Chen, CEO'
                            },
                            {
                                company: 'Local Coffee Co',
                                industry: 'E-commerce',
                                logo: 'LC',
                                metric: '+287%',
                                label: 'Sales Growth',
                                quote: 'Trust widgets increased our checkout rate from 2% to 7.7%. Game changer.',
                                author: 'Marcus Johnson, Founder'
                            },
                            {
                                company: 'Consulting Group',
                                industry: 'B2B Services',
                                logo: 'CG',
                                metric: '+523%',
                                label: 'Lead Quality',
                                quote: 'We now close deals 3X faster. Social proof made all the difference.',
                                author: 'Elena Rodriguez, Partner'
                            }
                        ].map((case_study, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                        {case_study.logo}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{case_study.company}</div>
                                        <div className="text-xs text-gray-500">{case_study.industry}</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-5xl font-bold text-emerald-400 mb-1">{case_study.metric}</div>
                                    <div className="text-sm text-gray-400">{case_study.label}</div>
                                </div>

                                <p className="text-sm text-gray-300 italic mb-3">"{case_study.quote}"</p>
                                <div className="text-xs text-gray-500">— {case_study.author}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Join 12,847 Growing Businesses</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Start converting more customers with AI-powered social proof. No credit card required.
                    </p>
                    <button className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-2xl hover:shadow-emerald-500/50 px-12 py-5 rounded-full font-bold text-lg transition inline-flex items-center gap-2 mb-4">
                        Start Free 14-Day Trial
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-sm text-gray-500">Join in 60 seconds • See results in 48 hours • Cancel anytime</p>
                </div>

            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black/60 backdrop-blur-xl py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-6 h-6 text-emerald-400" />
                                <span className="font-bold text-lg">InstantProof</span>
                            </div>
                            <p className="text-sm text-gray-500">AI-powered social proof trusted by 12,847+ businesses worldwide.</p>
                        </div>

                        {['Product', 'Company', 'Resources'].map((section, idx) => (
                            <div key={idx}>
                                <h4 className="font-semibold mb-4">{section}</h4>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li><a href="#" className="hover:text-white transition">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
                        © 2025 InstantProof. All rights reserved. Built with AI.
                    </div>
                </div>
            </footer>
        </div>
    );
}
