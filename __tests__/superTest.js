const { app, server } = require('../index.js');
const request = require('supertest');
const { dbConnection } = require('../models/sequelizeConfig.js');

beforeAll(async () => {
  await dbConnection();
});
afterAll((done) => {
  server.close(done);
});
describe('Express App', () => {
  it('should respond with "Hello World" at the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toBe('Hello World');
  });
});

describe('POST /auth/register', () => {
  it('should register a new user and return user details', async () => {
    const newUser = {
      name: 'TestUser',
      email: 'testuser@example.com',
      password: 'password123',
    };
    const response = await request(app)
      .post('/auth/register')
      .send(newUser)
      .expect(201);
    expect(response.body).toHaveProperty('name', newUser.name);
    expect(response.body).toHaveProperty('email', newUser.email);
  });
  it('should handle missing or invalid fields during registration', async () => {
    const invalidUser = {
      name: 'InvalidUser',
      email: 'invaliduser@example.com',
    };
    const response = await request(app)
      .post('/auth/register')
      .send(invalidUser)
      .expect(400);
    expect(response.body).toHaveProperty('error', 'Missing or Invalid fields');
  });

  it('should handle registration for an existing user', async () => {
    const existingUser = {
      name: 'ExistingUser',
      email: 'existinguser@example.com',
      password: 'password123',
    };

    await request(app).post('/auth/register').send(existingUser).expect(201);

    const response = await request(app)
      .post('/auth/register')
      .send(existingUser)
      .expect(409);

    expect(response.body).toHaveProperty(
      'error',
      'User with this email already exists'
    );
  });
});
describe('POST /auth/login', () => {
  it('should log in a user and return a JWT token in the cookie', async () => {
    const testUser = {
      name: 'TestUser2',
      email: 'testuser2@example.com',
      password: 'testpassword2',
    };
    await request(app).post('/auth/register').send(testUser);

    const response = await request(app).post('/auth/login').send({
      email: 'testuser2@example.com',
      password: 'testpassword2',
    });
    console.log('response ', response);
    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.body).toHaveProperty('name', 'TestUser2');
    expect(response.body).toHaveProperty('email', 'testuser2@example.com');
    expect(response.body).toHaveProperty('jwtToken');

    await request(app)
      .delete('/auth/user')
      .set('Cookie', [`jwtToken=${response.body.jwtToken}`]);
  });
  it('should handle login with incorrect credentials', async () => {
    const invalidCredentials = {
      email: 'nonexistentuser@example.com',
      password: 'wrongpassword',
    };
    const response = await request(app)
      .post('/auth/login')
      .send(invalidCredentials)
      .expect(401);
    expect(response.body).toHaveProperty('error', 'Wrong email or password');
  });
  it('should handle login with invalid email format', async () => {
    const invalidEmailFormat = {
      email: 'invalidemailformat',
      password: 'testpassword',
    };
    const response = await request(app)
      .post('/auth/login')
      .send(invalidEmailFormat)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Wrong email format');
  });
});
