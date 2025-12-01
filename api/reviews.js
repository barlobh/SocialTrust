import { getReviews, getStats } from '../server/data.js';

const respond = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        respond(res, 405, { error: 'Method not allowed' });
        return;
    }

    try {
        const [reviews, stats] = await Promise.all([getReviews(12), getStats()]);
        respond(res, 200, { reviews, stats });
    } catch (err) {
        console.error('Reviews handler error', err);
        respond(res, 500, { error: 'Failed to load reviews' });
    }
}
