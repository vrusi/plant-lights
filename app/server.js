const express = require('express');
const path = require('path');
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express();
const port = 3000;
const jsonParser = bodyParser.json()

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.post('/', jsonParser, (req, res) => {
    body = req.body;
    body['red'] = +body['red'];
    body['green'] = +body['green'];
    body['blue'] = +body['blue'];
    content = Buffer.from(JSON.stringify(body));
    fs.writeFile('lights.json', content, { flag: 'w+' }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
})

app.get('/lights',  (req, res) => {
    fs.readFile('lights.json', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        dataParsed = JSON.parse(data.toString());
        res.send(dataParsed);
    })
})

app.listen(port, () => {
    console.log(`Plant Lights app listening on port ${port}`);
})