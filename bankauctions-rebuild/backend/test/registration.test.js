import { it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

it('returns readable JSON validation errors instead of an HTML crash', async () => {
  const res = await request(app).post('/api/v1/auth/register').send({ fullName: 'A', email: 'invalid', phone: '12', password: '123' });
  assert.equal(res.status, 400);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.deepEqual(res.body.errors.map(error => error.field).sort(), ['email', 'fullName', 'password', 'phone']);
  assert.match(res.body.message, /at least 6 characters/);
  assert.equal(res.body.token, undefined);
});

it('registers an active buyer, grants three credits, permits protected access and subsequent login', async () => {
  const email = 'registration-regression@example.com';
  const credentials = { email, password: 'ValidPassword@42' };
  const res = await request(app).post('/api/v1/auth/register').send({ ...credentials, fullName: 'Registration Test', phone: '+91 98765 43210' });
  assert.equal(res.status, 201);
  assert.equal(res.body.user.isActive, true);
  assert.equal(res.body.user.unlocksRemaining, 3);
  assert.equal(res.body.user.phone, '9876543210');
  assert.equal(res.body.user.passwordHash, undefined);
  const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${res.body.token}`);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, email);
  const login = await request(app).post('/api/v1/auth/login').send(credentials);
  assert.equal(login.status, 200);
  const duplicate = await request(app).post('/api/v1/auth/register').send({ ...credentials, fullName: 'Registration Test', phone: '9876543210' });
  assert.equal(duplicate.status, 400);
  assert.match(duplicate.body.message, /already exists/);
});
