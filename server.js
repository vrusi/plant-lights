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
redisClient.on('quit', () => console.log('Redis Client quit'));

async function getData() {
    await redisClient.connect();
    const data = await redisClient.get('data');
    redisClient.quit();
    return JSON.parse(data.toString());
}

async function setData(data) {
    await redisClient.connect();
    console.log(data);
    let res = await redisClient.set('data', data);
    console.log(res);
    redisClient.quit();
}

app.get('/', async (req, res) => {
    const data = await getData();
    res.render('index', {
        red: data.red || 0,
        green: data.green || 0,
        blue: data.blue || 0,
    });
})

app.post('/', jsonParser, async (req, res) => {
    dataObj = {
        red: +req.body.red,
        green: +req.body.green,
        blue: +req.body.blue
    }
    data = Buffer.from(JSON.stringify(dataObj));
    await setData(data);
})

app.get('/lights', async (req, res) => {
    const data = await getData();
    res.send(data);
})

app.listen(port, () => {
    console.log(`Plant Lights app listening on port ${port}`);
})