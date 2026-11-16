import { it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

it('rejects password variants and unknown users without creating a session', async () => {
  for (const credentials of [
    { email: 'buyer@bankauctions.ai', password: 'Buyer@123456' },
    { email: 'buyer@bankauctions.ai', password: 'incorrect-password' },
    { email: 'missing-account@example.com', password: 'incorrect-password' }
  ]) {
    const res = await request(app).post('/api/v1/auth/login').send(credentials);
    assert.equal(res.status, 401);
    assert.equal(res.body.token, undefined);
    assert.equal(res.headers['set-cookie'], undefined);
    assert.equal(res.body.message, 'Invalid email or password.');
  }
});
