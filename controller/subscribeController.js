import Subscriber from "../models/subscribeModel.js";

const subscribeUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if this user already subscribed
        const existingByUser = await Subscriber.findOne({ userId: req.user.id });
        if (existingByUser) {
            return res.status(400).json({ message: "You are already subscribed" });
        }

        // Check if this email is already taken by another account
        const existingByEmail = await Subscriber.findOne({ email });
        if (existingByEmail) {
            return res.status(400).json({ message: "This email is already subscribed" });
        }

        const newSubscriber = await Subscriber.create({
            email,
            userId: req.user.id,
        });

        res.status(201).json({
            message: "Subscription successful",
            data: newSubscriber,
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

export default subscribeUser;