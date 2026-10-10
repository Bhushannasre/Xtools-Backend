
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import subscribeRouter from './routes/SubscribeRoutes.js';
// import contactRouter from './routes/contactRouter.js';
// import userRoutes from './routes/userRoutes.js';
// import downloadRoutes from './routes/downloadRoutes.js';
// import { connectDB } from './config/db.js';
// import productRoutes from './routes/productRoutes.js';

// dotenv.config();

// // ── Validate required env vars at startup ────────────────────────────────────
// const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
// for (const key of REQUIRED_ENV) {
//     if (!process.env[key]) {
//         console.error(`❌ Missing required environment variable: ${key}`);
//         process.exit(1);
//     }
// }

// const app = express();

// // ── Security headers ─────────────────────────────────────────────────────────
// // helmet's default Cross-Origin-Resource-Policy is "same-origin", which
// // blocks the browser from loading <img src> (and other) responses from
// // this API when the page is served from a different origin — exactly the
// // dev setup here (frontend on :5173, this API on :5000). That shows up as
// // net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin in DevTools, even though the
// // server itself returns 200 and the bytes are fine (CORS for fetch/XHR is
// // unaffected — it's a separate header this one happens to also need).
// // "cross-origin" allows any origin to load these responses, which is
// // appropriate for a public API serving public images/JSON; it does not
// // weaken auth or CORS — those are still enforced separately below.
// app.use(helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
// }));

// // ── CORS ─────────────────────────────────────────────────────────────────────
// const allowedOrigins = process.env.CLIENT_URL.split(',').map(o => o.trim());
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error(`CORS: origin ${origin} not allowed`));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
// }));

// // ── Body parsing ─────────────────────────────────────────────────────────────
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));

// // ── Request logging (dev only) ───────────────────────────────────────────────
// if (process.env.NODE_ENV !== 'production') {
//     app.use(morgan('dev'));
// }

// // ── Routes ───────────────────────────────────────────────────────────────────
// app.use('/api', userRoutes);
// app.use('/api', downloadRoutes);
// app.use('/api', productRoutes);
// app.use('/api', subscribeRouter);
// app.use('/api', contactRouter);

// // ── Health check ─────────────────────────────────────────────────────────────
// app.get('/', (req, res) => res.json({ status: 'API is running' }));

// // ── 404 handler ──────────────────────────────────────────────────────────────
// app.use((req, res) => {
//     res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
// });

// // ── Global error handler ─────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     const status = err.status || 500;
//     const message = process.env.NODE_ENV === 'production'
//         ? 'Something went wrong'
//         : err.message;
//     res.status(status).json({ error: message });
// });

// // ── Start server ─────────────────────────────────────────────────────────────
// async function start() {
//     try {
//         await connectDB(); // single connection — handles everything

//         const PORT = process.env.PORT || 5000;
//         const server = app.listen(PORT, () =>
//             console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
//         );

//         // ── Graceful shutdown ────────────────────────────────────────────────
//         const shutdown = async (signal) => {
//             console.log(`\n${signal} received — shutting down gracefully`);
//             server.close(async () => {
//                 await mongoose.connection.close();
//                 console.log('🛑 MongoDB connection closed');
//                 process.exit(0);
//             });
//         };

//         process.on('SIGTERM', () => shutdown('SIGTERM'));
//         process.on('SIGINT',  () => shutdown('SIGINT'));

//     } catch (err) {
//         console.error('❌ Startup error:', err.message);
//         process.exit(1);
//     }
// }

// start();

// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import subscribeRouter from './routes/SubscribeRoutes.js';
// import contactRouter from './routes/contactRouter.js';
// import userRoutes from './routes/userRoutes.js';
// import downloadRoutes from './routes/downloadRoutes.js';
// import { connectDB } from './config/db.js';
// import productRoutes from './routes/productRoutes.js';

// dotenv.config();

// // ── Validate required env vars at startup ────────────────────────────────────
// const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
// for (const key of REQUIRED_ENV) {
//     if (!process.env[key]) {
//         console.error(`❌ Missing required environment variable: ${key}`);
//         process.exit(1);
//     }
// }

// const app = express();

// // ── Security headers ─────────────────────────────────────────────────────────
// // helmet's default Cross-Origin-Resource-Policy is "same-origin", which
// // blocks the browser from loading <img src> (and other) responses from
// // this API when the page is served from a different origin — exactly the
// // dev setup here (frontend on :5173, this API on :5000). That shows up as
// // net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin in DevTools, even though the
// // server itself returns 200 and the bytes are fine (CORS for fetch/XHR is
// // unaffected — it's a separate header this one happens to also need).
// // "cross-origin" allows any origin to load these responses, which is
// // appropriate for a public API serving public images/JSON; it does not
// // weaken auth or CORS — those are still enforced separately below.
// app.use(helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
// }));

// // ── CORS ─────────────────────────────────────────────────────────────────────
// const allowedOrigins = process.env.CLIENT_URL.split(',').map(o => o.trim());
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error(`CORS: origin ${origin} not allowed`));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
// }));

// // ── Body parsing ─────────────────────────────────────────────────────────────
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));

// // ── Request logging (dev only) ───────────────────────────────────────────────
// if (process.env.NODE_ENV !== 'production') {
//     app.use(morgan('dev'));
// }

// // ── Routes ───────────────────────────────────────────────────────────────────
// app.use('/api', userRoutes);
// app.use('/api', downloadRoutes);
// app.use('/api', productRoutes);
// app.use('/api', subscribeRouter);
// app.use('/api', contactRouter);

// // ── Health check ─────────────────────────────────────────────────────────────
// app.get('/', (req, res) => res.json({ status: 'API is running' }));

// // ── 404 handler ──────────────────────────────────────────────────────────────
// app.use((req, res) => {
//     res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
// });

// // ── Global error handler ─────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     const status = err.status || 500;
//     const message = process.env.NODE_ENV === 'production'
//         ? 'Something went wrong'
//         : err.message;
//     res.status(status).json({ error: message });
// });

// // ── Start server ─────────────────────────────────────────────────────────────
// async function start() {
//     try {
//         await connectDB(); // single connection — handles everything

//         const PORT = process.env.PORT || 5000;
//         const server = app.listen(PORT, () =>
//             console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
//         );

//         // ── Graceful shutdown ────────────────────────────────────────────────
//         const shutdown = async (signal) => {
//             console.log(`\n${signal} received — shutting down gracefully`);
//             server.close(async () => {
//                 await mongoose.connection.close();
//                 console.log('🛑 MongoDB connection closed');
//                 process.exit(0);
//             });
//         };

//         process.on('SIGTERM', () => shutdown('SIGTERM'));
//         process.on('SIGINT',  () => shutdown('SIGINT'));

//     } catch (err) {
//         console.error('❌ Startup error:', err.message);
//         process.exit(1);
//     }
// }

// start();

// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import subscribeRouter from './routes/SubscribeRoutes.js';
// import contactRouter from './routes/contactRouter.js';
// import userRoutes from './routes/userRoutes.js';
// import downloadRoutes from './routes/downloadRoutes.js';
// import { connectDB } from './config/db.js';
// import productRoutes from './routes/productRoutes.js';

// dotenv.config();

// // ── Validate required env vars at startup ────────────────────────────────────
// const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
// for (const key of REQUIRED_ENV) {
//     if (!process.env[key]) {
//         console.error(`❌ Missing required environment variable: ${key}`);
//         process.exit(1);
//     }
// }

// const app = express();

// // ── Security headers ─────────────────────────────────────────────────────────
// app.use(helmet());

// // ── CORS ─────────────────────────────────────────────────────────────────────
// const allowedOrigins = process.env.CLIENT_URL.split(',').map(o => o.trim());
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error(`CORS: origin ${origin} not allowed`));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
// }));

// // ── Body parsing ─────────────────────────────────────────────────────────────
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));

// // ── Request logging (dev only) ───────────────────────────────────────────────
// if (process.env.NODE_ENV !== 'production') {
//     app.use(morgan('dev'));
// }

// // ── Routes ───────────────────────────────────────────────────────────────────
// app.use('/api', userRoutes);
// app.use('/api', downloadRoutes);
// app.use('/api', productRoutes);
// app.use('/api', subscribeRouter);
// app.use('/api/contact', contactRouter);

// // ── Health check ─────────────────────────────────────────────────────────────
// app.get('/', (req, res) => res.json({ status: 'API is running' }));

// // ── 404 handler ──────────────────────────────────────────────────────────────
// app.use((req, res) => {
//     res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
// });

// // ── Global error handler ─────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     const status = err.status || 500;
//     const message = process.env.NODE_ENV === 'production'
//         ? 'Something went wrong'
//         : err.message;
//     res.status(status).json({ error: message });
// });

// // ── Start server ─────────────────────────────────────────────────────────────
// async function start() {
//     try {
//         await connectDB(); // single connection — handles everything

//         const PORT = process.env.PORT || 5000;
//         const server = app.listen(PORT, () =>
//             console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
//         );

//         // ── Graceful shutdown ────────────────────────────────────────────────
//         const shutdown = async (signal) => {
//             console.log(`\n${signal} received — shutting down gracefully`);
//             server.close(async () => {
//                 await mongoose.connection.close();
//                 console.log('🛑 MongoDB connection closed');
//                 process.exit(0);
//             });
//         };

//         process.on('SIGTERM', () => shutdown('SIGTERM'));
//         process.on('SIGINT',  () => shutdown('SIGINT'));

//     } catch (err) {
//         console.error('❌ Startup error:', err.message);
//         process.exit(1);
//     }
// }

// start();

// IMPORTANT: this must be the very first import in the file. ES module
// imports are all hoisted and their bodies run in the order they're first
// encountered — so if `dotenv.config()` ran further down (even before the
// rest of server.js's own code), it would still run AFTER the bodies of
// './routes/userRoutes.js' → './controller/userController.js' →
// './config/mailer.js', because those modules get imported (and therefore
// executed) first in the dependency graph. mailer.js reads
// process.env.EMAIL_USER / EMAIL_PASS at the top level the moment it's
// imported, so it was always seeing an empty environment and printing the
// "not set" warning even when .env had correct values. Loading dotenv via
// this side-effect import, as literally the first line, makes it the first
// module executed, so every other module sees the real .env values.
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import subscribeRouter from './routes/SubscribeRoutes.js';
import contactRouter from './routes/contactRouter.js';
import userRoutes from './routes/userRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';

// ── Validate required env vars at startup ────────────────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`❌ Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
// helmet's default Cross-Origin-Resource-Policy is "same-origin", which
// blocks the browser from loading <img src> (and other) responses from
// this API when the page is served from a different origin — exactly the
// dev setup here (frontend on :5173, this API on :5000). That shows up as
// net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin in DevTools, even though the
// server itself returns 200 and the bytes are fine (CORS for fetch/XHR is
// unaffected — it's a separate header this one happens to also need).
// "cross-origin" allows any origin to load these responses, which is
// appropriate for a public API serving public images/JSON; it does not
// weaken auth or CORS — those are still enforced separately below.
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL.split(',').map(o => o.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging (dev only) ───────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', userRoutes);
app.use('/api', downloadRoutes);
app.use('/api', productRoutes);
app.use('/api', subscribeRouter);
app.use('/api', contactRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'API is running' }));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message;
    res.status(status).json({ error: message });
});

// ── Start server ─────────────────────────────────────────────────────────────
async function start() {
    try {
        await connectDB(); // single connection — handles everything

        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
        );

        // ── Graceful shutdown ────────────────────────────────────────────────
        const shutdown = async (signal) => {
            console.log(`\n${signal} received — shutting down gracefully`);
            server.close(async () => {
                await mongoose.connection.close();
                console.log('🛑 MongoDB connection closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT',  () => shutdown('SIGINT'));

    } catch (err) {
        console.error('❌ Startup error:', err.message);
        process.exit(1);
    }
}

start();