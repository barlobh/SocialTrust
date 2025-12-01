import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { buildEmbedMarkup, getReviews, getStats, getWidgetConfig } from './data.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
        res.status(400).json({ error: 'A valid email is required' });
        return;
    }
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    res.json({ token, user: { email, name: email.split('@')[0] } });
});

app.get('/api/reviews', async (_req, res) => {
    try {
        const [reviews, stats] = await Promise.all([getReviews(12), getStats()]);
        res.json({ reviews, stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load reviews' });
    }
});

app.get('/api/widget', async (req, res) => {
    try {
        const host = req.get('host');
        const [widget, stats] = await Promise.all([getWidgetConfig(host), getStats()]);
        res.json({ widget, stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load widget config' });
    }
});

app.get('/api/widget-embed.js', async (_req, res) => {
    try {
        const [reviews, stats] = await Promise.all([getReviews(5), getStats()]);
        const markup = buildEmbedMarkup({
            title: 'Verified Reviews',
            reviews,
            trustScore: stats.trustScore,
        });

        res.set('Content-Type', 'application/javascript');
        res.send(
            `
            (function() {
                try {
                    const mount = document.createElement('div');
                    mount.innerHTML = ${JSON.stringify(markup)};
                    const node = mount.firstElementChild;
                    const current = document.currentScript;
                    if (current && current.parentNode) {
                        current.parentNode.insertBefore(node, current);
                    } else {
                        document.body.appendChild(node);
                    }
                } catch (e) {
                    console.error('InstantProof widget failed to mount', e);
                }
            })();
        `
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('// InstantProof widget failed to load');
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});
