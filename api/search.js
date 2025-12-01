import { searchMentions } from '../server/data.js';

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

    const query = String(req.query?.q || req.query?.query || '').trim();
    if (!query) {
        respond(res, 400, { error: 'Missing query' });
        return;
    }

    try {
        const { mentions, total } = await searchMentions(query, 12);
        respond(res, 200, { mentions, total });
    } catch (err) {
        console.error('Search handler error', err);
        respond(res, 500, { error: 'Failed to search mentions' });
    }
}
