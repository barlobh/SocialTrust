const respond = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

const parseBody = (req) =>
    new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        respond(res, 405, { error: 'Method not allowed' });
        return;
    }

    try {
        const body = await parseBody(req);
        const email = String(body?.email || '').trim().toLowerCase();

        if (!email || !email.includes('@')) {
            respond(res, 400, { error: 'A valid email is required' });
            return;
        }

        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

        respond(res, 200, {
            token,
            user: {
                email,
                name: email.split('@')[0],
            },
        });
    } catch (err) {
        console.error('Auth handler error', err);
        respond(res, 500, { error: 'Unable to sign in right now' });
    }
}
