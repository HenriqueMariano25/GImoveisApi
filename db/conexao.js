const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://rdzzluprtbmfgq:404cfea746d06f9a1beb7f69b574bf3a8c1c77dd40c5d93a8c572a6401f11e96@ec2-100-25-231-126.compute-1.amazonaws.com:5432/d34qlqh66i5ot5',
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

module.exports = client