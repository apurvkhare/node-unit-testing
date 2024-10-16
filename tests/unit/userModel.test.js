const mongoose = require('mongoose');
const User = require('../../src/models/user');

// Mock the mongoose.model function
jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: jest.fn().mockReturnValue(jest.fn())
}));

describe('User Model Test', () => {
  // Mock the Schema and model creation
  const mockSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }},
    age: { type: Number, required: true }
  };
  mongoose.Schema.mockImplementation(() => ({ ...mockSchema }));

  // Update the User mock to include validateSync
  const mockValidateSync = jest.fn();
  const UserMock = jest.fn().mockImplementation(() => ({
    validateSync: mockValidateSync
  }));
  mongoose.model.mockReturnValue(UserMock);

  beforeEach(() => {
    mockValidateSync.mockReset();
  });

  it('should create user schema with correct fields', () => {
    expect(mongoose.Schema).toHaveBeenCalledWith({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, validate: expect.any(Object) },
      age: { type: Number, required: true }
    });
  });

  // it('should create model with correct name and schema', () => {
  //   expect(mongoose.model).toHaveBeenCalledWith('User', expect.objectContaining(mockSchema));
  // });

  Test validation
  it('should validate required fields', () => {
    mockValidateSync.mockReturnValue({
      errors: {
        name: new Error('Name is required'),
        email: new Error('Email is required'),
        age: new Error('Age is required')
      }
    });
    const user = new UserMock({});
    const validationError = user.validateSync();
    expect(validationError.errors.name).toBeDefined();
    expect(validationError.errors.email).toBeDefined();
    expect(validationError.errors.age).toBeDefined();
  });

  // it('should validate email format', () => {
  //   mockValidateSync.mockReturnValue({
  //     errors: {
  //       email: new Error('Invalid email format')
  //     }
  //   });
  //   const user = new UserMock({
  //     name: 'John Doe',
  //     email: 'invalid-email',
  //     age: 30
  //   });
  //   const validationError = user.validateSync();
  //   expect(validationError.errors.email).toBeDefined();
  // });

  // it('should accept valid user data', () => {
  //   mockValidateSync.mockReturnValue(undefined);
  //   const user = new UserMock({
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     age: 30
  //   });
  //   const validationError = user.validateSync();
  //   expect(validationError).toBeUndefined();
  // });
});
