// import request from 'supertest';
// import jwt from 'jsonwebtoken';
// import app from '../app'; // your express app
// import { describe, expect, it } from 'vitest';
// import { OTP_SECRET_KEY } from '../config/serverConfig.js';

// const testUserData = {
//   email: 'testuser@example.com',
//   password: 'Str0ngP@ssw0rd!',
//   fullName: 'Test User',
//   userName: 'testuser',
//   role: 'developer', // or 'employer'
// };

// let otpVerificationToken = '';

// describe('Signup Flow', () => {
//   it('POST /api/auth/signup/initiate - should return 200 and otpVerificationToken', async () => {
//     const res = await request(app)
//       .post('/api/auth/signup/initiate')
//       .send(testUserData);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.info).toBeDefined();

//     otpVerificationToken = res.body.info;
//   }, 10000);

//   it('POST /api/auth/signup/verify - should verify OTP and create user', async () => {
//     expect(otpVerificationToken).toBeTruthy();

//     const decoded = jwt.verify(otpVerificationToken, OTP_SECRET_KEY);
//     const otp = decoded.otp;
//     expect(otp).toBeDefined();

//     const res = await request(app)
//       .post('/api/auth/signup/verify')
//       .set('authorization', `Bearer ${otpVerificationToken}`)
//       .send({ otp });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.message).toMatch(/user created/i);
//   }, 10000);
// });