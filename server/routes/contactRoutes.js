const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');

router.post('/submitquery', createContact);
router.get('/queries', getContacts);

module.exports = router;
