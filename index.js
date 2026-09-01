const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const internshipsRouter = require('./routes/internships');
const applicationsRouter = require('./routes/applications');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

app.use('/api/internships', internshipsRouter);
app.use('/api/applications', applicationsRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', errors: [{ message: 'Not found' }] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;