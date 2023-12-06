// src/__tests__/signup.test.ts
import request from 'supertest';
import app from '../app';

describe('Signup and Login', () => {
  it('should allow a user to signup and login', async () => {
    // Signup
    const signupResponse = await request(app)
      .post('/signup')
      .send({
        fullname: 'John Doe',
        email: 'john@example.com',
        gender: 'm',
        phone: '+2347085647535',
        address: '1, rantech stop',
        password: 'password123', 
      });

    expect(signupResponse.status).toBe(201);

    // Login
    const loginResponse = await request(app)
      .post('/login')
      .send({
        fullname: 'John Doe',
        password: 'password123', 
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });
});

