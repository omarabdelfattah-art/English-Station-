async function testAPI() {
  try {
    console.log('Testing API endpoints...');

    // Test users endpoint
    console.log('\n1. Testing GET /api/users');
    const usersResponse = await fetch('http://localhost:5000/api/users');
    const usersData = await usersResponse.json();
    console.log('Status:', usersResponse.status);
    console.log('Response:', usersData);

    // Test lessons endpoint
    console.log('\n2. Testing GET /api/lessons');
    const lessonsResponse = await fetch('http://localhost:5000/api/lessons');
    const lessonsData = await lessonsResponse.json();
    console.log('Status:', lessonsResponse.status);
    console.log('Response:', lessonsData);

    // Test settings endpoint
    console.log('\n3. Testing GET /api/settings');
    const settingsResponse = await fetch('http://localhost:5000/api/settings');
    const settingsData = await settingsResponse.json();
    console.log('Status:', settingsResponse.status);
    console.log('Response:', settingsData);

    console.log('\nAll API tests completed!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();

