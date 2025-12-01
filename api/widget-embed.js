import { buildEmbedMarkup, getReviews, getStats } from '../server/data.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.statusCode = 405;
        res.end('Method not allowed');
        return;
    }

    try {
        const [reviews, stats] = await Promise.all([getReviews(5), getStats()]);
        const markup = buildEmbedMarkup({
            title: 'Verified Reviews',
            reviews,
            trustScore: stats.trustScore,
        });

        res.setHeader('Content-Type', 'application/javascript');
        res.statusCode = 200;
        res.end(
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
        console.error('Widget embed error', err);
        res.statusCode = 500;
        res.end('// InstantProof widget failed to load');
    }
}
