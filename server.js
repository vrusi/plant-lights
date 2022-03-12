const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const redis = require('redis');
const pug = require('pug');

const app = express();
const port = process.env.PORT || 80;
const jsonParser = bodyParser.json();
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'pug')
app.set('views', './views')

redisClient.on('connect', () => console.log('Connected to Redis Client'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function getData() {
    try {
        console.log('Getting data...');
        await redisClient.connect();
        const data = await redisClient.get('data');
        redisClient.quit();
        console.log('Data received:\n' + data);
        return !!data ? JSON.parse(data.toString()) : null;
    } catch (error) {
        console.error('Error while getting data.');
        console.error(error);
    }
}

async function setData(data) {
    console.log('Setting data:\n' + data);
    try {
        await redisClient.connect();
        let res = await redisClient.set('data', data);
        redisClient.quit();
        console.log('Data successfuly set.');
    } catch (error) {
        console.error('Error while setting data');
        console.error(error);
    }
}

app.get('/', async (req, res) => {
    const data = await getData();
    try {
        res.render('index', {
            red: data ? data.red || 0 : 0,
            green: data ? data.green || 0 : 0,
            blue: data ? data.blue || 0 : 0,
        });
    } catch (error) {
        console.error('Error while rendering index.html');
        console.error(error);
    }
})

app.post('/', jsonParser, async (req, res) => {
    dataObj = {
        red: +req.body.red,
        green: +req.body.green,
        blue: +req.body.blue
    }
    data = Buffer.from(JSON.stringify(dataObj));
    await setData(data);
    res.sendStatus(200);
})

app.get('/data', async (req, res) => {
    const data = await getData();
    res.send(data);
})

app.listen(port, () => {
    console.log(`Plant Lights app listening on port ${port}`);
})