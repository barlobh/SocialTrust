import { sql } from '@vercel/postgres';

const fallbackReviews = [
    { source: 'Google', author: 'Sarah M.', rating: 5, text: 'Absolutely amazing service! Highly recommended.', created_at: new Date('2024-10-12') },
    { source: 'Facebook', author: 'John D.', rating: 5, text: 'Best experience I have had in a long time.', created_at: new Date('2024-09-29') },
    { source: 'Twitter', author: '@techguru', rating: 4, text: 'InstantProof is a game changer for social proof.', created_at: new Date('2024-09-10') },
    { source: 'Reddit', author: 'u/growth_hacker', rating: 5, text: 'We boosted conversions by 3x in a week.', created_at: new Date('2024-09-05') },
];

const fallbackStats = {
    totalReviews: 1248,
    avgRating: 4.9,
    trustScore: 98,
};

let schemaInitialized = false;

const hasDb = () => Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);

const toDisplayDate = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export async function ensureSchema() {
    if (!hasDb() || schemaInitialized) return;

    await sql`
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            source TEXT NOT NULL,
            author TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            text TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS widgets (
            id TEXT PRIMARY KEY,
            name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    schemaInitialized = true;
}

async function seedDemoData() {
    if (!hasDb()) return;
    await ensureSchema();

    const reviewCount = await sql`SELECT COUNT(*) AS count FROM reviews;`;
    const total = Number(reviewCount?.rows?.[0]?.count ?? 0);
    if (total === 0) {
        for (const review of fallbackReviews) {
            await sql`
                INSERT INTO reviews (source, author, rating, text, created_at)
                VALUES (${review.source}, ${review.author}, ${review.rating}, ${review.text}, ${review.created_at})
            `;
        }
    }

    const widgetCount = await sql`SELECT COUNT(*) AS count FROM widgets;`;
    const widgetTotal = Number(widgetCount?.rows?.[0]?.count ?? 0);
    if (widgetTotal === 0) {
        await sql`INSERT INTO widgets (id, name) VALUES ('demo-widget', 'Default Demo Widget')`;
    }
}

export async function getReviews(limit = 12) {
    const fromDb = async () => {
        if (!hasDb()) return [];
        try {
            await seedDemoData();
            const result = await sql`
                SELECT source, author, rating, text, created_at
                FROM reviews
                ORDER BY created_at DESC
                LIMIT ${limit}
            `;
            return result.rows.map((row) => ({
                source: row.source,
                author: row.author,
                rating: row.rating,
                text: row.text,
                date: toDisplayDate(row.created_at),
            }));
        } catch (err) {
            console.error('Failed to fetch reviews from database, falling back to static data', err);
            return [];
        }
    };

    const [dbReviews, externalMentions] = await Promise.all([fromDb(), fetchExternalMentions(limit)]);
    const baseFallback = fallbackReviews.slice(0, limit).map((review) => ({
        ...review,
        date: toDisplayDate(review.created_at),
    }));

    const combined = [...dbReviews, ...externalMentions, ...baseFallback].slice(0, limit);
    return combined;
}

export async function getStats() {
    if (!hasDb()) return fallbackStats;

    try {
        await seedDemoData();

        const totals = await sql`
            SELECT
                COUNT(*)::INT AS total_reviews,
                COALESCE(AVG(rating), 0)::NUMERIC(3,2) AS avg_rating
            FROM reviews;
        `;

        const totalReviews = Number(totals.rows?.[0]?.total_reviews ?? 0);
        const avgRating = Number(totals.rows?.[0]?.avg_rating ?? 0);

        return {
            totalReviews,
            avgRating,
            trustScore: Math.min(100, Math.round((avgRating / 5) * 100)),
        };
    } catch (err) {
        console.error('Failed to fetch stats from database, using fallback', err);
        return fallbackStats;
    }
}

export async function getWidgetConfig(hostname) {
    const baseHost = hostname || process.env.PUBLIC_BASE_URL || '';
    const domain = baseHost.startsWith('http') ? baseHost : baseHost ? `https://${baseHost}` : '';
    const buildUrl = (path) => (domain ? `${domain}${path}` : path);
    const shareUrl = domain || 'https://instantproof.app';

    const defaultId = 'demo-widget';

    if (!hasDb()) {
        return {
            id: defaultId,
            snippet: `<script src="${buildUrl('/api/widget-embed.js?id=demo-widget')}" defer></script>`,
            shareUrl,
        };
    }

    try {
        await seedDemoData();
        const widgets = await sql`SELECT id FROM widgets LIMIT 1;`;
        const id = widgets.rows?.[0]?.id || defaultId;

        return {
            id,
            snippet: `<script src="${buildUrl(`/api/widget-embed.js?id=${id}`)}" defer></script>`,
            shareUrl,
        };
    } catch (err) {
        console.error('Failed to fetch widget config, using fallback', err);
        return {
            id: defaultId,
            snippet: `<script src="${buildUrl('/api/widget-embed.js?id=demo-widget')}" defer></script>`,
            shareUrl,
        };
    }
}

export function buildEmbedMarkup({ title = 'Recent Reviews', reviews = fallbackReviews, trustScore = 98 }) {
    const reviewCards = reviews
        .slice(0, 3)
        .map(
            (review) => `
            <div style="padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.04);margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                    <div style="width:30px;height:30px;border-radius:10px;background:#10b981;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont">
                        ${review.source?.[0] ?? 'R'}
                    </div>
                    <div>
                        <div style="font-weight:600;font-size:13px;color:#fff">${review.author}</div>
                        <div style="font-size:11px;color:#9ca3af">${review.source} &bull; ${toDisplayDate(review.created_at)}</div>
                    </div>
                </div>
                <div style="color:#fbbf24;font-size:12px;margin-bottom:6px">
                    ${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}
                </div>
                <div style="color:#d1d5db;font-size:12px;line-height:1.5">${review.text}</div>
            </div>
        `
        )
        .join('');

    return `
        <div style="width:100%;max-width:360px;border-radius:18px;border:1px solid rgba(255,255,255,0.08);background:radial-gradient(circle at 20% 20%,rgba(16,185,129,0.15),transparent 25%),radial-gradient(circle at 80% 0%,rgba(45,212,191,0.12),transparent 25%),rgba(17,24,39,0.94);color:#e5e7eb;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont;padding:16px;box-shadow:0 25px 80px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.03)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#10b981,#0ea5e9);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;">IP</div>
                    <div>
                        <div style="font-weight:700;font-size:14px;color:#fff">${title}</div>
                        <div style="font-size:12px;color:#9ca3af">Trust Score ${trustScore}/100</div>
                    </div>
                </div>
                <div style="padding:6px 10px;border-radius:12px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);color:#34d399;font-weight:700;font-size:12px">${trustScore}</div>
            </div>
            ${reviewCards}
            <div style="margin-top:10px;font-size:11px;color:#9ca3af;text-align:center">
                Powered by <span style="color:#10b981;font-weight:700">InstantProof</span>
            </div>
        </div>
    `;
}

export async function searchMentions(query, limit = 10) {
    const q = (query || '').trim();
    if (!q) return { mentions: [], total: 0 };

    const [hn, reddit] = await Promise.all([
        fetchHackerNewsMentions(limit, q).catch(() => []),
        fetchRedditMentions(limit, q).catch(() => []),
    ]);

    const combined = [...hn, ...reddit].slice(0, limit);
    return { mentions: combined, total: combined.length };
}

async function fetchExternalMentions(limit = 6) {
    // Free, allowed sources without API keys: Hacker News API + Reddit JSON endpoints.
    // We keep it resilient: if network fails, we return [] silently.
    const hnPromise = fetchHackerNewsMentions(Math.ceil(limit / 2)).catch(() => []);
    const redditPromise = fetchRedditMentions(Math.ceil(limit / 2)).catch(() => []);
    const [hn, reddit] = await Promise.all([hnPromise, redditPromise]);
    return [...hn, ...reddit].slice(0, limit);
}

async function fetchHackerNewsMentions(limit = 3) {
    const topUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    const ids = await fetchJson(topUrl);
    if (!Array.isArray(ids)) return [];
    const picks = ids.slice(0, limit * 2); // overfetch slightly
    const stories = await Promise.all(
        picks.map(async (id) => {
            const item = await fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return item;
        })
    );
    return stories
        .filter(Boolean)
        .slice(0, limit)
        .map((item) => ({
            source: 'HackerNews',
            author: item.by || 'hn-user',
            rating: 5,
            text: item.title || 'Mention on Hacker News',
            date: toDisplayDate((item.time || 0) * 1000),
            link: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        }));
}

async function fetchRedditMentions(limit = 3, query = 'reviews') {
    const encoded = encodeURIComponent(query || 'reviews');
    const searchUrl = `https://www.reddit.com/r/entrepreneur+smallbusiness+saas/search.json?q=${encoded}&sort=new&restrict_sr=on`;
    const json = await fetchJson(searchUrl);
    const posts = json?.data?.children || [];
    return posts
        .map((p) => p.data)
        .filter(Boolean)
        .slice(0, limit)
        .map((post) => ({
            source: 'Reddit',
            author: post.author || 'reddit-user',
            rating: 5,
            text: post.title || 'Mention on Reddit',
            date: toDisplayDate((post.created_utc || 0) * 1000),
            link: post.permalink ? `https://reddit.com${post.permalink}` : undefined,
        }));
}

async function fetchJson(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'instantproof-widget' } });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.json();
}
