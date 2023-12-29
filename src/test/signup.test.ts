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
        email: 'bony@gmail.com',
        gender: 'male',
        phone: '+2347085227535',
        address: '15, rantech stop',
        password: 'password123', 
      });

    expect(signupResponse.status).toBe(201);

    // Login
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'bony@gmail.com',
        password: 'password123', 
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });
});

