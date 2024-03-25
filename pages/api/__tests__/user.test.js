import { handler, allUsers } from '../user';
import { ManagementClient } from 'auth0';

const mockGetAll = jest.fn();
jest.mock('auth0', () => {
  return {
    ManagementClient: jest.fn().mockImplementation(() => {
      return { 
        users: {
          getAll: () => mockGetAll(),
        }
      }
    })
  }
});

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
});
