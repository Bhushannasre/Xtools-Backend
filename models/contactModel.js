import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],
  },
  phone: {
    type: Number,
    required:[true, 'Phone Number is required'],
    maxlength:[10],

  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
  },
}, { timestamps: true }); // adds createdAt & updatedAt automatically

const contactModel = mongoose.model('Contact', contactSchema);

export default contactModel;