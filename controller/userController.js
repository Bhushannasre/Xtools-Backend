// import UserModel from '../models/userModel.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // Helper: strip password from user object before sending
// function sanitizeUser(user) {
//     const { password: _, ...safeUser } = user.toObject();
//     return safeUser;
// }

// export async function registerUser(req, res) {
//     try {
//         const { username, email, password } = req.body;

//         // Manual input validation
//         if (!username || !email || !password) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         if (password.length < 8) {
//             return res.status(400).json({ error: 'Password must be at least 8 characters' });
//         }

//         const existing = await UserModel.findOne({ email });
//         if (existing) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         // Use async hash — never blocks the event loop
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await UserModel.create({
//             username,
//             email,
//             password: hashedPassword,
//         });

//         const token = jwt.sign(
//             { id: newUser._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '7d' }
//         );

//         return res.status(201).json({
//             message: 'User registered successfully',
//             token,
//             data: sanitizeUser(newUser),
//         });
//     } catch (err) {
//         console.error('Register error:', err);
//         return res.status(500).json({ error: 'An error occurred during registration' });
//     }
// }

// export async function loginUser(req, res) {
//     try {
//         const { email, password } = req.body;

//         // Manual input validation
//         if (!email || !password) {
//             return res.status(400).json({ error: 'Email and password are required' });
//         }

//         const user = await UserModel.findOne({ email });

//         // Use a generic message — don't reveal whether email exists
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Use async compare — never blocks the event loop
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const token = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '7d' }
//         );

//         return res.status(200).json({
//             message: 'Login successful',
//             token,
//             data: sanitizeUser(user),
//         });
//     } catch (err) {
//         console.error('Login error:', err);
//         return res.status(500).json({ error: 'An error occurred during login' });
//     }
// }

import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { transporter, isMailerConfigured } from '../config/mailer.js';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Helper: strip password from user object before sending
function sanitizeUser(user) {
    const { password: _, ...safeUser } = user.toObject();
    return safeUser;
}

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Manual input validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const existing = await UserModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Use async hash — never blocks the event loop
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            data: sanitizeUser(newUser),
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: 'An error occurred during registration' });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Manual input validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email });

        // Use a generic message — don't reveal whether email exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Use async compare — never blocks the event loop
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            data: sanitizeUser(user),
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
}

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        // Always respond with the same generic message whether or not the
        // email exists — a different response here would let anyone probe
        // this endpoint to find out which emails have accounts.
        const genericResponse = {
            message: 'If an account exists for that email, a password reset link has been sent.',
        };

        if (!user) {
            return res.status(200).json(genericResponse);
        }

        if (!isMailerConfigured()) {
            console.error(
                'Forgot-password requested but EMAIL_USER/EMAIL_PASS are not configured — cannot send reset email. See config/mailer.js.'
            );
            return res.status(500).json({
                error: 'Password reset email could not be sent — the server is not configured to send email yet.',
            });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        await user.save();

        // CLIENT_URL can be a comma-separated list (see server.js's CORS
        // setup) — the first entry is this app's own canonical origin.
        const clientUrl = (process.env.CLIENT_URL || '').split(',')[0].trim();
        const resetLink = `${clientUrl}/reset-password/${rawToken}`;

        await transporter.sendMail({
            from: `"X2LS" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Reset your X2LS password',
            html: `
                <p>Hi ${user.username},</p>
                <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
            `,
        });

        return res.status(200).json(genericResponse);
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Reset token is required' });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'That reset link is invalid or has expired' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Your password has been reset. You can now log in.' });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ error: 'An error occurred while resetting your password' });
    }
}