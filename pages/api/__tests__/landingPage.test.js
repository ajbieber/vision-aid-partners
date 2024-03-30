const axios = require('axios');
const apiUrl = 'http://localhost:3000/api/landingPage'; 

describe('Landing Page API Tests', () => {
    let uid = 2;
    let id;
    test('should add content successfully', async () => {
        // Mock request body
        const requestBody = {
            userId: uid,
            content: 'New content'
        };
      
        // Send a POST request to the API endpoint
        const response = await fetch(`${apiUrl}`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        expect(response.status).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.userId).toBe(uid);
        expect(responseBody.content).toBe(requestBody.content);
        expect(responseBody.id).toBeDefined();
        id = responseBody.id;
    });
    test('should read content successfully', async () => {
        // Mock request body
        var requestData = {
            id: id,
        };
        const queryString = new URLSearchParams(requestData).toString();
        
        // Send a GET request to the API endpoint /api/landingPage?id=2
        const response = await fetch(`${apiUrl}?${queryString}`);

        expect(response.status).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.id).toBe(id);
        expect(responseBody.userId).toBe(uid);

    });
    test('should update content successfully', async () => {
        const requestBody = {
            id: id,
            content: 'New updated content'
        };
        // Send a UPDATE request to the API endpoint
        const response = await fetch(`${apiUrl}`, {
          method: "PATCH",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });


        expect(response.status).toBe(200);
    });
    test('should delete content successfully', async () => {
        // Mock request body
        var requestData = {
            id: id,
        };
        const queryString = new URLSearchParams(requestData).toString();
        
        // Send a DELETE request to the API endpoint /api/landingPage?id=2
        const response = await fetch(`${apiUrl}?${queryString}`, { method: "DELETE" });

        expect(response.status).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.id).toBe(id);
    });
});
