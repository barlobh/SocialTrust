import React, { useEffect, useMemo, useState } from 'react';
import {
    Shield,
    LayoutDashboard,
    Settings,
    LogOut,
    Search,
    CheckCircle,
    Loader2,
    Code,
    Copy,
    Share2,
    Send,
    Mail,
    MessageCircle,
    Link2,
    AlertCircle,
    Palette,
    Home,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function DashboardPage() {
    const [scanStep, setScanStep] = useState(0);
    const [isScanning, setIsScanning] = useState(true);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [widgetCode, setWidgetCode] = useState('');
    const [stats, setStats] = useState({ totalReviews: 0, avgRating: 0, trustScore: 0 });
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [shareStatus, setShareStatus] = useState('');
    const [error, setError] = useState('');
    const [accent, setAccent] = useState('emerald');
    const [layout, setLayout] = useState('card');
    const [widgetTitle, setWidgetTitle] = useState('Recent Reviews');
    const [widgetCta, setWidgetCta] = useState('See all proof');

    const steps = [
        'Initializing search engine...',
        'Scanning review sources...',
        'Crawling social mentions...',
        'Analyzing sentiment...',
        'Aggregating trust data...',
        'Generating widget code...',
    ];

    useEffect(() => {
        if (scanStep < steps.length) {
            const timer = setTimeout(() => setScanStep((prev) => prev + 1), 750);
            return () => clearTimeout(timer);
        }
    }, [scanStep]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [reviewsRes, widgetRes] = await Promise.all([
                    fetch(`${API_BASE}/api/reviews`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/widget`).then((r) => r.json()),
                ]);

                if (reviewsRes?.reviews) {
                    setReviews(reviewsRes.reviews);
                    setStats(reviewsRes.stats || {});
                }

                if (widgetRes?.widget?.snippet) {
                    setWidgetCode(widgetRes.widget.snippet);
                    setStats((prev) => ({ ...prev, ...(widgetRes.stats || {}) }));
                    if (widgetRes.widget.shareUrl) setShareUrl(widgetRes.widget.shareUrl);
                }

                if (!shareUrl && typeof window !== 'undefined') {
                    setShareUrl(window.location.origin);
                }
            } catch (err) {
                console.error('Failed to load dashboard data', err);
                setError('Live data is unavailable right now. Showing demo data.');
            } finally {
                setIsScanning(false);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleCopy = async (text, label = 'Copied!') => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setShareStatus(label);
            setTimeout(() => {
                setCopied(false);
                setShareStatus('');
            }, 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    const shareTargets = useMemo(() => {
        const url = encodeURIComponent(shareUrl || '');
        const text = encodeURIComponent('Check out our live trust widget powered by InstantProof.');

        return [
            { name: 'Facebook', icon: Share2, href: shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${url}` : '', variant: 'emerald' },
            { name: 'X (Twitter)', icon: Share2, href: shareUrl ? `https://x.com/intent/tweet?url=${url}&text=${text}` : '', variant: 'slate' },
            { name: 'Telegram', icon: Send, href: shareUrl ? `https://t.me/share/url?url=${url}&text=${text}` : '', variant: 'cyan' },
            { name: 'Email', icon: Mail, href: shareUrl ? `mailto:?subject=InstantProof%20widget&body=${text}%20${url}` : '', variant: 'amber' },
            { name: 'Discord', icon: MessageCircle, action: () => handleCopy(shareUrl, 'Link copied for Discord'), variant: 'purple' },
            { name: 'Instagram', icon: Link2, action: () => handleCopy(shareUrl, 'Link copied for Instagram'), variant: 'pink' },
        ];
    }, [shareUrl]);

    const shareClasses = {
        emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/30 text-emerald-200',
        slate: 'from-slate-500/20 to-slate-500/5 border-slate-400/30 text-slate-200',
        cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-400/30 text-cyan-100',
        amber: 'from-amber-500/20 to-amber-500/5 border-amber-400/30 text-amber-100',
        purple: 'from-purple-500/20 to-purple-500/5 border-purple-400/30 text-purple-100',
        pink: 'from-pink-500/20 to-pink-500/5 border-pink-400/30 text-pink-100',
    };

    const renderShareButtons = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {shareTargets.map((target) => {
                const Icon = target.icon;
                const sharedClass = shareClasses[target.variant] || shareClasses.emerald;
                const base = 'flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20';
                if (target.href) {
                    return (
                        <a key={target.name} href={target.href} target="_blank" rel="noreferrer" className={`${base} bg-gradient-to-br ${sharedClass}`}>
                            <Icon className="w-4 h-4" />
                            {target.name}
                        </a>
                    );
                }
                return (
                    <button key={target.name} onClick={target.action} className={`${base} bg-gradient-to-br ${sharedClass}`}>
                        <Icon className="w-4 h-4" />
                        {target.name}
                    </button>
                );
            })}
        </div>
    );

    const suggestions = useMemo(() => {
        const list = [];
        const total = stats.totalReviews || 0;
        const avg = Number(stats.avgRating || 0);
        const trust = stats.trustScore || 0;
        list.push({ title: 'Add fresh reviews', detail: 'Collect 5 recent reviews this week to lift recency and trust.', impact: '+5 to score' });
        if (avg < 4.6) list.push({ title: 'Raise average rating', detail: 'Resolve 3 low-star issues; aim for 4.6+.', impact: '+0.2 avg' });
        if (trust < 90) list.push({ title: 'Diversify sources', detail: 'Pull in social/forum mentions to increase source credibility.', impact: '+7 trust' });
        if (total < 50) list.push({ title: 'Volume boost', detail: 'Aim for 50+ reviews for stronger proof.', impact: '+5 trust' });
        return list.slice(0, 3);
    }, [stats]);

    const previewAccent = {
        emerald: 'from-emerald-500 to-teal-400',
        cyan: 'from-cyan-500 to-blue-400',
        purple: 'from-purple-500 to-pink-400',
    }[accent] || 'from-emerald-500 to-teal-400';

    const renderPreview = () => {
        const items = reviews.slice(0, 2);
        return (
            <div className="flex flex-col gap-3">
                <div className={`p-4 rounded-2xl border border-white/10 bg-gradient-to-br ${previewAccent} text-white shadow-xl shadow-emerald-500/20`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="font-bold">{widgetTitle || 'Live Widget Preview'}</div>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">Trust Score {stats.trustScore || '—'}</div>
                    </div>
                    <div className={layout === 'list' ? 'space-y-2' : 'grid grid-cols-1 gap-2'}>
                        {items.map((r, i) => (
                            <div key={i} className="bg-black/30 border border-white/10 rounded-xl p-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-semibold">{r.author}</span>
                                    <span className="text-xs text-white/70">{r.source}</span>
                                </div>
                                <div className="text-xs text-yellow-200 mb-1">{'★'.repeat(r.rating || 5)}</div>
                                <div className="text-xs text-white/80 line-clamp-2">{r.text}</div>
                            </div>
                        ))}
                        {items.length === 0 && <div className="text-sm text-white/80">Live data loading...</div>}
                    </div>
                    <div className="mt-3 text-xs text-black/80 font-semibold bg-white/90 text-center py-2 rounded-lg">
                        {widgetCta || 'See all proof'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur hidden md:flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                <Shield className="w-4 h-4" />
                            </div>
                            <span className="font-bold tracking-tight">InstantProof</span>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-emerald-400 rounded-xl font-medium border border-emerald-500/20">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition">
                            <Settings className="w-5 h-5" />
                            Settings
                        </a>
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                            <p className="text-gray-400 text-sm">Live reviews, widget preview, and score coaching</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/60 hover:shadow-lg hover:shadow-emerald-500/20 transition"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <div className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs text-emerald-300 font-medium flex items-center gap-2 shadow-inner shadow-emerald-500/20">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                {loading ? 'Connecting...' : 'System Operational'}
                            </div>
                        </div>
                    </header>

                    {error && (
                        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-sm text-amber-200">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {isScanning ? (
                        <div className="max-w-2xl mx-auto mt-20 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                <Search className="absolute inset-0 m-auto w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Scanning for Reviews...</h2>
                            <div className="space-y-3 max-w-md mx-auto">
                                {steps.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                                            idx === scanStep ? 'text-white scale-105 font-medium' : idx < scanStep ? 'text-emerald-500/50' : 'text-gray-600'
                                        }`}
                                    >
                                        {idx < scanStep ? <CheckCircle className="w-4 h-4" /> : idx === scanStep ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 rounded-full border border-gray-700" />}
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                    <div className="text-gray-400 text-sm mb-2">Total Reviews Found</div>
                                    <div className="text-3xl font-bold">{stats.totalReviews || '—'}</div>
                                    <div className="text-xs text-emerald-200 mt-2">Tip: add 5 new reviews this week.</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                    <div className="text-gray-400 text-sm mb-2">Average Rating</div>
                                    <div className="text-3xl font-bold text-emerald-300">{stats.avgRating ? `${Number(stats.avgRating).toFixed(1)}/5.0` : '—'}</div>
                                    <div className="text-xs text-emerald-200 mt-2">Tip: resolve low-star feedback to reach 4.6+.</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                    <div className="text-gray-400 text-sm mb-2">Trust Score</div>
                                    <div className="text-3xl font-bold text-blue-300">{stats.trustScore ? `${stats.trustScore}/100` : '—'}</div>
                                    <div className="text-xs text-emerald-200 mt-2">Tip: diversify sources to boost credibility.</div>
                                </div>
                            </div>

                            {/* Score Coach */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-lg font-bold">Score Coach</h3>
                                </div>
                                <div className="grid md:grid-cols-3 gap-3">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-400/40 transition">
                                            <div className="text-sm font-semibold mb-1">{s.title}</div>
                                            <div className="text-xs text-gray-300">{s.detail}</div>
                                            <div className="text-xs text-emerald-300 mt-2">{s.impact}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Widget Preview & Theme */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-lg font-bold">
                                            <Palette className="w-5 h-5 text-emerald-400" />
                                            Live Widget Preview
                                        </div>
                                        <p className="text-sm text-gray-400">Tweak accent, layout, title, and CTA before you embed.</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {['emerald', 'cyan', 'purple'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setAccent(opt)}
                                                className={`px-3 py-1 rounded-full text-xs border transition ${
                                                    accent === opt ? 'bg-white/10 border-white/40 text-white shadow shadow-emerald-500/30' : 'border-white/10 text-gray-300 hover:border-white/30'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                        <select
                                            value={layout}
                                            onChange={(e) => setLayout(e.target.value)}
                                            className="bg-black/40 border border-white/10 text-sm rounded-lg px-2 py-1 text-gray-200"
                                        >
                                            <option value="card">Card</option>
                                            <option value="list">List</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    <label className="text-sm text-gray-300">
                                        Title
                                        <input
                                            value={widgetTitle}
                                            onChange={(e) => setWidgetTitle(e.target.value)}
                                            className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            placeholder="Recent Reviews"
                                        />
                                    </label>
                                    <label className="text-sm text-gray-300">
                                        CTA Text
                                        <input
                                            value={widgetCta}
                                            onChange={(e) => setWidgetCta(e.target.value)}
                                            className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                            placeholder="See all proof"
                                        />
                                    </label>
                                </div>
                                {renderPreview()}
                            </div>

                            {/* Widget Code Section */}
                            <div className="bg-gradient-to-br from-emerald-800/30 via-emerald-700/10 to-cyan-800/20 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 rounded-2xl p-8">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                            <Code className="w-5 h-5 text-emerald-400" />
                                            Your Widget Code
                                        </h3>
                                        <p className="text-gray-300 text-sm">Copy this script and drop it into your site.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCopy(widgetCode)}
                                            disabled={!widgetCode}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copied ? 'Copied!' : 'Copy Code'}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/60 rounded-xl p-4 font-mono text-sm text-gray-200 border border-white/10 break-all min-h-[70px]">
                                    {widgetCode || 'Loading widget snippet...'}
                                </div>
                            </div>

                            {/* Share Section */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <Share2 className="w-5 h-5 text-emerald-400" />
                                            Share Your Widget
                                        </h3>
                                        <p className="text-sm text-gray-400">Send your live widget to social channels or copy the link.</p>
                                    </div>
                                    {shareStatus && <span className="text-xs text-emerald-300">{shareStatus}</span>}
                                </div>
                                {renderShareButtons()}
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleCopy(shareUrl || widgetCode, 'Widget link copied')}
                                        className="flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200"
                                    >
                                        <Link2 className="w-4 h-4" />
                                        Copy widget link
                                    </button>
                                </div>
                            </div>

                            {/* Recent Reviews */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/30">
                                <h3 className="text-lg font-bold mb-6">Recent Verified Reviews</h3>
                                <div className="space-y-4">
                                    {reviews.map((review, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-400/30 transition">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${review.source === 'Google' ? 'bg-blue-500' : review.source === 'Facebook' ? 'bg-blue-600' : 'bg-sky-500'}`}>
                                                {review.source?.[0] || 'R'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{review.author}</span>
                                                    <span className="text-xs text-gray-500">• {review.source}</span>
                                                    <span className="text-xs text-gray-500">• {review.date}</span>
                                                </div>
                                                <div className="flex text-yellow-400 mb-2">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 fill-current" />
                                                    ))}
                                                </div>
                                                <p className="text-gray-300 text-sm">{review.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {reviews.length === 0 && <div className="text-sm text-gray-400">No reviews yet.</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black/60 px-8 py-6 text-sm text-gray-500">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>InstantProof Dashboard</span>
                    <div className="flex gap-4">
                        <Link to="/" className="hover:text-white">Home</Link>
                        <a href="#" className="hover:text-white">Docs</a>
                        <a href="#" className="hover:text-white">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Star({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
