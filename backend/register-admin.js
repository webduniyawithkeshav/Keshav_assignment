const http = require('http');

const data = JSON.stringify({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
            console.log('✅ Admin created successfully!');
            console.log(responseData);
            console.log('\n📧 Email: admin@example.com');
            console.log('🔑 Password: password123');
            console.log('\n➡️  Now you can login at http://localhost:5173');
        } else if (res.statusCode === 400) {
            console.log('✅ Admin already exists! You can login now.');
            console.log('\n📧 Email: admin@example.com');
            console.log('🔑 Password: password123');
        } else {
            console.log('❌ Error:', responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Connection error:', error.message);
    console.log('\n⚠️  Make sure the backend server is running on port 5000');
});

req.write(data);
req.end();
