const Contact = require('../models/Contact');

const createContact = async (req, res) => {
  try {
    const { name, phone, contactMethod, service, details } = req.body;
    const contact = new Contact({ name, phone, contactMethod, service, details });
    await contact.save();
    res.status(201).json({ success: true, message: 'Contact saved successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Failed to save contact' });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
  }
};

module.exports = { createContact, getContacts };
