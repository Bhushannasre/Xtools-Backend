import contactModel from "../models/contactModel.js";

async function contactController(req, res) {
  const { name, email, phone, message } = req.body;

  // ✅ Validate BEFORE saving
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const newContact = new contactModel({ name, email, phone, message });
    await newContact.save();
    return res.status(200).json({ message: 'Contact form submitted successfully', data: newContact });
  } catch (err) {
    console.error('Error saving contact form data:', err);
    return res.status(500).json({ error: 'An error occurred while saving contact form data' });
  }
}

export default contactController;