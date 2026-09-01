const request = require('supertest');
const fs = require('fs');
const path = require('path');

const APPLICATIONS_PATH = path.join(__dirname, '..', 'data', 'applications.json');

// Reset applications data before tests run
if (fs.existsSync(APPLICATIONS_PATH)) {
  fs.writeFileSync(APPLICATIONS_PATH, JSON.stringify([]));
}

const app = require('../index');

describe('POST /api/applications', () => {
  it('rejects missing name', async () => {
    const res = await request(app).post('/api/applications').send({ email: 'a@b.com', internshipId: 'INT-101' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/applications').send({ name: 'Test', email: 'not-an-email', internshipId: 'INT-101' });
    expect(res.status).toBe(400);
  });

  it('rejects unsafe url', async () => {
    const res = await request(app).post('/api/applications').send({
      name: 'Test', email: 'unique1@test.com', internshipId: 'INT-101', portfolioUrl: 'javascript:alert(1)'
    });
    expect(res.status).toBe(400);
  });

  it('rejects unknown internship id', async () => {
    const res = await request(app).post('/api/applications').send({
      name: 'Test', email: 'unique1b@test.com', internshipId: 'INT-999'
    });
    expect(res.status).toBe(400);
  });

  it('accepts a valid application', async () => {
    const res = await request(app).post('/api/applications').send({
      name: 'Test User', email: 'unique2@test.com', internshipId: 'INT-101'
    });
    expect(res.status).toBe(201);
  });

  it('rejects duplicate application', async () => {
    await request(app).post('/api/applications').send({
      name: 'Dup', email: 'dup@test.com', internshipId: 'INT-101'
    });
    const res = await request(app).post('/api/applications').send({
      name: 'Dup', email: 'dup@test.com', internshipId: 'INT-101'
    });
    expect(res.status).toBe(409);
  });
});