// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         username: {
//             type: String,
//             required: [true, "Username is required"],
//             trim: true,
//             minlength: [2, "Username must be at least 2 characters"],
//         },
//         email: {
//             type: String,
//             required: [true, "Email is required"],
//             unique: true, // Prevents duplicate emails at the DB level
//             trim: true,
//             lowercase: true,
//             match: [/\S+@\S+\.\S+/, "Invalid email format"],
//         },
//         password: {
//             type: String,
//             required: [true, "Password is required"],
//             minlength: [8, "Password must be at least 8 characters"],
//         },
//     },
//     {
//         timestamps: true, // Adds createdAt and updatedAt automatically
//     }
// );

// const userModel = mongoose.model("User", userSchema);
// export default userModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [2, "Username must be at least 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // Prevents duplicate emails at the DB level
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Invalid email format"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
        },
        // Only a SHA-256 hash of the reset token is ever stored here, never
        // the raw token that goes out in the email — same principle as
        // hashing passwords, so a database leak alone can't be used to
        // reset anyone's account. select:false keeps both fields out of
        // ordinary find()/toObject() results (no change needed to
        // sanitizeUser in userController.js); they still work fine as
        // query filters in resetPassword() despite not being projected.
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;