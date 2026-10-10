import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, // link subscription to a real user
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true } // createdAt = subscribed date, no need for subscribedAt
);

subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ userId: 1 }, { unique: true }); // one subscription per user

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
