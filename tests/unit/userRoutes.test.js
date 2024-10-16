const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/userRoutes');
const userController = require('../../src/controllers/userController');

jest.mock('../../src/controllers/userController');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com', age: 30 };
    userController.createUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/users')
      .send(mockUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockUser);
    expect(userController.createUser).toHaveBeenCalledWith(mockUser);
  });

  it('should get all users', async () => {
    const mockUsers = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    userController.getAllUsers.mockResolvedValue(mockUsers);

    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUsers);
    expect(userController.getAllUsers).toHaveBeenCalled();
  });

  it('should get user by id', async () => {
    const mockUser = { _id: '123', name: 'John Doe' };
    userController.getUserById.mockResolvedValue(mockUser);

    const res = await request(app).get('/users/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
    expect(userController.getUserById).toHaveBeenCalledWith('123');
  });

  it('should update user', async () => {
    const mockUser = { _id: '123', name: 'John Doe Updated' };
    userController.updateUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .put('/users/123')
      .send({ name: 'John Doe Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
    expect(userController.updateUser).toHaveBeenCalledWith('123', { name: 'John Doe Updated' });
  });

  it('should delete user', async () => {
    userController.deleteUser.mockResolvedValue({ message: 'User deleted' });

    const res = await request(app).delete('/users/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'User deleted' });
    expect(userController.deleteUser).toHaveBeenCalledWith('123');
  });

  it('should handle errors when creating a user', async () => {
    const mockError = new Error('Database error');
    userController.createUser.mockRejectedValue(mockError);

    const res = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com', age: 30 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Database error' });
  });

  it('should handle errors when getting all users', async () => {
    const mockError = new Error('Database error');
    userController.getAllUsers.mockRejectedValue(mockError);

    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Database error' });
  });

  it('should handle errors when getting user by id', async () => {
    const mockError = new Error('User not found');
    userController.getUserById.mockRejectedValue(mockError);

    const res = await request(app).get('/users/123');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('should handle errors when updating user', async () => {
    const mockError = new Error('User not found');
    userController.updateUser.mockRejectedValue(mockError);

    const res = await request(app)
      .put('/users/123')
      .send({ name: 'John Doe Updated' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('should handle errors when deleting user', async () => {
    const mockError = new Error('User not found');
    userController.deleteUser.mockRejectedValue(mockError);

    const res = await request(app).delete('/users/123');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('should handle user not found when getting user by id', async () => {
    userController.getUserById.mockResolvedValue(null);

    const res = await request(app).get('/users/nonexistent');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
    expect(userController.getUserById).toHaveBeenCalledWith('nonexistent');
  });
});
