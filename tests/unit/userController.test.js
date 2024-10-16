const userController = require('../../src/controllers/userController');
const User = require('../../src/models/user');

jest.mock('../../src/models/user');

describe('User controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should create a new user', async () => {
        const mockUser = { name: 'Tony Stark', email: "tony@avengers", age: 50}
        User.create.mockResolvedValue(mockUser);

        const result = await userController.createUser(mockUser);
        // console.log("controller was executer")
        expect(result).toEqual(mockUser);
        expect(User.create).toHaveBeenCalledWith(mockUser);
    })

    it('should get all users', async () => {
        const mockUsers = [{ name: 'Tony Stark', email: "tony@avengers", age: 50}, { name: 'Peter Parker', email: "spidey@avengers", age: 20} ]
        User.find.mockResolvedValue(mockUsers);

        const result = await userController.getAllUsers();
        // console.log("controller was executer")
        expect(result).toEqual(mockUsers);
        expect(User.find).toHaveBeenCalled();
    })

    it('should update the user data', async () => {
        const mockUser = { _id: '123', name: 'Steve Rogers'}
        User.findByIdAndUpdate.mockResolvedValue(mockUser);

        const result = await userController.updateUser('123', { name: 'Steve Rogers'});
        // console.log("controller was executer")
        expect(result).toEqual(mockUser);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'Steve Rogers'}, { new: true });
    })
})
