const express = require('express');
const validator = require('validator');
const { getInternships, getApplications, saveApplications } = require('../db');
const { applicationLimiter } = require('../middleware/rateLimit');

const router = express.Router();

function isSafeUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

router.post('/', applicationLimiter, (req, res) => {
  const { internshipId, name, email, portfolioUrl, note } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }
  if (!email || !validator.isEmail(String(email))) {
    errors.push({ field: 'email', message: 'A valid email is required.' });
  }
  if (!internshipId) {
    errors.push({ field: 'internshipId', message: 'Internship is required.' });
  }
  if (portfolioUrl && !isSafeUrl(portfolioUrl)) {
    errors.push({ field: 'portfolioUrl', message: 'URL must start with http:// or https://.' });
  }

  if (errors.length) {
    return res.status(400).json({ status: 'error', errors });
  }

  const internships = getInternships();
  const match = internships.find(i => i.id === internshipId);
  if (!match) {
    return res.status(400).json({ status: 'error', errors: [{ field: 'internshipId', message: 'Unknown internship.' }] });
  }

  const applications = getApplications();
  const cleanEmail = email.trim().toLowerCase();
  const duplicate = applications.find(a => a.email === cleanEmail && a.internshipId === internshipId);
  if (duplicate) {
    return res.status(409).json({ status: 'error', errors: [{ message: 'You already applied to this internship.' }] });
  }

  const newApplication = {
    id: applications.length + 1,
    internshipId,
    name: name.trim(),
    email: cleanEmail,
    portfolioUrl: portfolioUrl || null,
    note: note || null,
    createdAt: new Date().toISOString()
  };

  try {
    applications.push(newApplication);
    saveApplications(applications);
    res.status(201).json({ status: 'success', data: { id: newApplication.id } });
  } catch (err) {
    console.error('POST /applications failed:', err.message);
    res.status(500).json({ status: 'error', errors: [{ message: 'Server error' }] });
  }
});

module.exports = router;