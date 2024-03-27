import handler, { allUsers } from '../user';
import { ManagementClient } from 'auth0';

const mockGetAll = jest.fn();
const mockCreate = jest.fn();
jest.mock('auth0', () => {
  return {
    ManagementClient: jest.fn().mockImplementation(() => {
      return { 
        users: {
          create: () => mockCreate(),
          getAll: () => mockGetAll(),
        }
      }
    })
  }
});

function MockResponse() {
  this.code = null;
  this.data = null;
  this.success = undefined;
}

MockResponse.prototype.status = function (code) {
  this.code = code;
  return this;
}

MockResponse.prototype.json = function(data, success) {
  this.data = data;
  if (success) this.success = success;
  return this;
}

describe('User API Tests', () => {
  it('should retrieve all the users from Auth0', async () => {
    const usersToGet = [
      {
        name: 'Test User',
        email: 'testuser123@test.com',
        app_metadata: {
          va_partners: {
            admin: true,
            hospitalRole: [
              { id: 1, admin: true }
            ]
          }
        }
      },
      {
        name: 'Test User 2',
        email: 'testuser234@test.com',
        app_metadata: {
          va_partners: {
            admin: false,
            hospitalRole: [
              { id: 1, admin: false }
            ]
          }
        }
      }
    ];

    mockGetAll.mockImplementationOnce(() => {
      return { data: usersToGet }
    });

    const results = await allUsers();
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      name: 'Test User',
      email: 'testuser123@test.com',
      admin: true,
      hospitalRole: [
        { id: 1, admin: true }
      ]
    });
    expect(results[1]).toEqual({
      name: 'Test User 2',
      email: 'testuser234@test.com',
      admin: false,
      hospitalRole: [
        { id: 1, admin: false }
      ]
    });
  });

  it('should create a user in Auth0', async () => {
    const expectedUser = {
      name: 'Test User',
      email: 'testuser123@test.com',
      admin: false,
      hospitalRole: [ { id: 1, admin: true }]
    };

    mockCreate.mockImplementationOnce(() => {
      return { data: {
        name: expectedUser.name,
        email: expectedUser.email,
        app_metadata: {
          va_partners: {
            admin: expectedUser.admin,
            hospitalRole: expectedUser.hospitalRole
          }
        }
      } };
    });

    const req = {
      method: 'POST',
      body: {
        email: expectedUser.email,
        admin: expectedUser.admin,
        name: expectedUser.name,
        password: 'TestPassowrd123!'
      }
    };
    const res = new MockResponse();

    await handler(req, res);
    expect(res.data).toEqual(expectedUser);
    expect(res.code).toBe(200);
    expect(res.success).toEqual({ success: true });
  });
});
