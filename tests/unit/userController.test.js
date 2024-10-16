const userController = require('../../src/controllers/userController');
const User = require('../../src/models/user');

jest.mock('../../src/models/user');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com', age: 30 };
    User.create.mockResolvedValue(mockUser);

    const result = await userController.createUser(mockUser);
    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith(mockUser);
  });

  it('should get all users', async () => {
    const mockUsers = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    User.find.mockResolvedValue(mockUsers);

    const result = await userController.getAllUsers();
    expect(result).toEqual(mockUsers);
    expect(User.find).toHaveBeenCalled();
  });

  it('should get user by id', async () => {
    const mockUser = { _id: '123', name: 'John Doe' };
    User.findById.mockResolvedValue(mockUser);

    const result = await userController.getUserById('123');
    expect(result).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith('123');
  });

  it('should update user', async () => {
    const mockUser = { _id: '123', name: 'John Doe Updated' };
    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    const result = await userController.updateUser('123', { name: 'John Doe Updated' });
    expect(result).toEqual(mockUser);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'John Doe Updated' }, { new: true });
  });

  it('should delete user', async () => {
    const mockUser = { _id: '123', name: 'John Doe' };
    User.findByIdAndDelete.mockResolvedValue(mockUser);

    const result = await userController.deleteUser('123');
    expect(result).toEqual(mockUser);
    expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});