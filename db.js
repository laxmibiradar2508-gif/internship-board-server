const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'seed', 'internships.json');
const DATA_DIR = path.join(__dirname, 'data');
const APPLICATIONS_PATH = path.join(DATA_DIR, 'applications.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(APPLICATIONS_PATH)) fs.writeFileSync(APPLICATIONS_PATH, JSON.stringify([]));

function getInternships() {
  const raw = fs.readFileSync(SEED_PATH, 'utf-8');
  return JSON.parse(raw).internships;
}

function getApplications() {
  const raw = fs.readFileSync(APPLICATIONS_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveApplications(apps) {
  fs.writeFileSync(APPLICATIONS_PATH, JSON.stringify(apps, null, 2));
}

module.exports = { getInternships, getApplications, saveApplications };