import { getWidgetConfig, getStats } from '../server/data.js';

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
        const hostname = req.headers.host || '';
        const [widget, stats] = await Promise.all([getWidgetConfig(hostname), getStats()]);
        respond(res, 200, { widget, stats });
    } catch (err) {
        console.error('Widget handler error', err);
        respond(res, 500, { error: 'Failed to load widget config' });
    }
}
