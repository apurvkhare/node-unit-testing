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
    })

    it('should get user by id', async () => {
        const mockUser = { _id: '123', name: 'Tony Stark', email: "tony@avengers", age: 50}
        userController.getUserById.mockResolvedValue(mockUser)

        const res = await request(app).get('/users/123')

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(mockUser)
        expect(userController.getUserById).toHaveBeenCalledWith('123')
    })

    it("should return 'user not found' for invalid id", async () => {
        userController.getUserById.mockResolvedValue(null);

        const res = await request(app).get('/users/456')

        expect(res.statusCode).toBe(404)
        expect(res.body).toEqual({ message: 'User not found' })
        expect(userController.getUserById).toHaveBeenCalledWith('456')
    })

    it("should return 'server error' for server error", async () => {
        const errorMessage = 'server crashed';
        const mockError = new Error(errorMessage)
        userController.getUserById.mockRejectedValue(mockError);

        const res = await request(app).get('/users/789')

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ message: errorMessage })
        expect(userController.getUserById).toHaveBeenCalledWith('789')
    })
})