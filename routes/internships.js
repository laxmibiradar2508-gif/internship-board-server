const express = require('express');
const { getInternships } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { domain, mode, search, page = 1, pageSize = 10 } = req.query;
    let data = getInternships();

    if (domain) data = data.filter(i => i.domain === domain);
    if (mode) data = data.filter(i => i.mode === mode);
    if (search) {
      const s = String(search).toLowerCase();
      data = data.filter(i =>
        i.title.toLowerCase().includes(s) ||
        i.skills.some(sk => sk.toLowerCase().includes(s))
      );
    }

    const total = data.length;
    const limit = Math.min(Number(pageSize) || 10, 50);
    const currentPage = Math.max(Number(page), 1);
    const start = (currentPage - 1) * limit;
    const pageData = data.slice(start, start + limit);

    res.json({
      status: 'success',
      data: pageData,
      pagination: { page: currentPage, pageSize: limit, total }
    });
  } catch (err) {
    console.error('GET /internships failed:', err.message);
    res.status(500).json({ status: 'error', errors: [{ message: 'Server error' }] });
  }
});

module.exports = router;