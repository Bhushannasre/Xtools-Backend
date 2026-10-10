import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Please sign in to continue' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, iat, exp }
        next();
    } catch {
        return res.status(401).json({ message: 'Session expired, please sign in again' });
    }
}