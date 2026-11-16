import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

describe('BankAuctions.ai Backend API Suite', () => {
  let buyerToken = '';
  let checkerToken = '';
  let engineerToken = '';
  let adminToken = '';
  let testAuctionId = '';

  it('GET /api/v1/health returns healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'healthy');
  });

  it('POST /api/v1/auth/login authenticates Admin role', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@bankauctions.ai', password: 'Admin@123' });
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'ADMIN');
    adminToken = res.body.token;
  });

  it('POST /api/v1/auth/login authenticates Checker role', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'checker@bankauctions.ai', password: 'Checker@123' });
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'CHECKER');
    checkerToken = res.body.token;
  });

  it('POST /api/v1/auth/login authenticates Engineer role', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'engineer@bankauctions.ai', password: 'Engineer@123' });
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'ENGINEER');
    engineerToken = res.body.token;
  });

  it('POST /api/v1/auth/login authenticates Buyer role', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'buyer@bankauctions.ai', password: 'Buyer@123' });
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'BUYER');
    buyerToken = res.body.token;
  });

  it('GET /api/v1/auctions returns published listings for public buyers', async () => {
    const res = await request(app).get('/api/v1/auctions?city=chennai');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
    testAuctionId = res.body.data[0].id;
    // ensure all returned lots are PUBLISHED
    for (const lot of res.body.data) {
      assert.strictEqual(lot.status, 'PUBLISHED');
    }
  });

  it('GET /api/v1/auctions/:id returns complete details with attributes', async () => {
    const res = await request(app).get(`/api/v1/auctions/${testAuctionId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.id, testAuctionId);
    assert.ok(res.body.data.bank);
    assert.ok(res.body.data.category);
  });

  it('Checker Panel: GET /api/v1/checker/queue returns pending exceptions', async () => {
    const res = await request(app)
      .get('/api/v1/checker/queue')
      .set('Authorization', `Bearer ${checkerToken}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  it('Checker Panel: Role Guard blocks unauthorized buyers', async () => {
    const res = await request(app)
      .get('/api/v1/checker/queue')
      .set('Authorization', `Bearer ${buyerToken}`);
    
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  it('Engineer Panel: GET /api/v1/engineer/assignments returns assigned site visits', async () => {
    const res = await request(app)
      .get('/api/v1/engineer/assignments')
      .set('Authorization', `Bearer ${engineerToken}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('Admin Panel: GET /api/v1/admin/overview returns real database KPIs', async () => {
    const res = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.metrics.totalAuctions > 0);
    assert.ok(res.body.data.metrics.publishedAuctions > 0);
    assert.ok(res.body.data.metrics.totalBuyers > 0);
  });

  it('Complete Lifecycle Journey: Import -> Checker Verify -> Admin Publish -> Buyer Discover', async () => {
    // 1. Admin imports a new authentic lot
    const importRes = await request(app)
      .post('/api/v1/admin/imports')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        records: [
          {
            sourceRef: `TEST-IMP-${Date.now()}`,
            title: '4BHK luxury penthouse, 3,400 sq ft Â· Anna Nagar',
            city: 'chennai',
            locality: 'Anna Nagar',
            bankCode: 'SBI',
            catCode: 'flat',
            reservePrice: 24500000,
            emdAmount: 2450000,
            auctionStartDate: new Date(Date.now() + 10 * 86400000).toISOString()
          }
        ]
      });
    
    assert.strictEqual(importRes.status, 201);
    const newLot = importRes.body.data[0];
    assert.strictEqual(newLot.status, 'PENDING_CHECKER');

    // 2. Checker reviews and verifies
    const verifyRes = await request(app)
      .patch(`/api/v1/checker/reviews/${newLot.id}`)
      .set('Authorization', `Bearer ${checkerToken}`)
      .send({
        decision: 'VERIFIED',
        correctionNotes: 'Scanned notice verified against lender publication',
        corrections: { reservePrice: 24500000 }
      });
    
    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.data.status, 'CHECKER_VERIFIED');

    // 3. Admin publishes
    const pubRes = await request(app)
      .post(`/api/v1/admin/auctions/${newLot.id}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    assert.strictEqual(pubRes.status, 200);
    assert.strictEqual(pubRes.body.data.status, 'PUBLISHED');

    // 4. Buyer discovers in public search
    const searchRes = await request(app).get(`/api/v1/auctions?city=chennai&search=penthouse`);
    assert.strictEqual(searchRes.status, 200);
    const found = searchRes.body.data.some((a) => a.id === newLot.id);
    assert.strictEqual(found, true);
  });
});
