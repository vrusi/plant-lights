const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const port = process.env.PORT || 80;
const jsonParser = bodyParser.json();
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

app.use(bodyParser.urlencoded({
    extended: true
}));

redisClient.on('connect', () => console.log('Connected to Redis Client'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.post('/', jsonParser, async (req, res) => {
    body = req.body;
    body['red'] = +body['red'];
    body['green'] = +body['green'];
    body['blue'] = +body['blue'];
    content = Buffer.from(JSON.stringify(body));
    await redisClient.connect();
    await redisClient.set('data', content);
    redisClient.quit();
})

app.get('/lights', async (req, res) => {
    await redisClient.connect();
    const data = await redisClient.get('data');
    redisClient.quit();
    dataParsed = JSON.parse(data.toString());
    res.send(dataParsed);
})

app.listen(port, () => {
    console.log(`Plant Lights app listening on port ${port}`);
})