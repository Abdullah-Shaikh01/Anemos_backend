const { createClient } = require('redis')

const client = createClient();

( async () => {
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('key', 'value')}
)();

module.exports = client