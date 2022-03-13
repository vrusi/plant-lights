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

async function getData(key) {
    try {
        console.log(`Getting data: ${key}...`);
        const data = await redisClient.get(key);
        console.log('Data received:\n' + data);
        return !!data ? JSON.parse(data.toString()) : null;
    } catch (error) {
        console.error('Error while getting data.');
        console.error(error);
    }
}

async function setData(key, value) {
    console.log(`Setting ${key}: ${value}`);
    try {
        const valueBuffer = Buffer.from(JSON.stringify(value));
        await redisClient.set(key, valueBuffer);
        console.log(`Data (${key}) successfuly set.`);
    } catch (error) {
        console.error('Error while setting data');
        console.error(error);
    }
}

function getPreset(presets, label) {
    for (let preset of presets) {
        if (preset.label === label) {
            return preset.setting;
        }
    }

    return null;
}

app.get('/', async (req, res) => {
    if (req.query && req.query.current === 'presets') {

        const presets = await getData('presets');
        try {
            res.render('presets', {
                presets: presets ? presets : null,
            });
        } catch (error) {
            console.error('Error while rendering presets.pug');
            console.error(error);
        }
    } else {
        const data = await getData('data');
        try {
            res.render('index', {
                red: data ? data.red || 0 : 0,
                green: data ? data.green || 0 : 0,
                blue: data ? data.blue || 0 : 0,
            });
        } catch (error) {
            console.error('Error while rendering index.pug');
            console.error(error);
        }
    }
})

app.post('/', jsonParser, async (req, res) => {
    dataObj = {
        red: +req.body.red,
        green: +req.body.green,
        blue: +req.body.blue
    }
    if (!req.body.label) {
        await setData('data', dataObj);

    } else {
        let presets = await getData('presets');

        presets.push({
            label: req.body.label,
            setting: dataObj,
        });

        await setData('presets', presets);
    }

    res.redirect('/');
})

app.get('/data', async (req, res) => {
    const data = await getData('data');
    res.send(data);
})

app.post('/presets/:id', async (req, res) => {
    const presets = await getData('presets');
    const preset = getPreset(presets, req.params.id);

    if (req.body.action === 'set') {
        await setData('data', preset);

    } else if (req.body.action === 'delete') {
        const presetsFiltered = presets.filter(preset => preset.label !== req.params.id);
        await setData('presets', presetsFiltered);
    }

    res.redirect('/?current=presets');
});

app.listen(port, async () => {
    console.log(`Plant Lights app listening on port ${port}`);
    await redisClient.connect();
})