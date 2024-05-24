const express = require('express');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.argv.includes('--port') ? parseInt(process.argv[process.argv.indexOf('--port') + 1]) : 8001;

app.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});

app.get('/random', (req, res) => {
  const xml = generateRandomXml();
  res.type('application/rss+xml');
  res.send(xml);
});

app.get('/rss', (req, res) => {
  const filePath = path.join(__dirname, 'xml', 'rss.xml');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.type('application/xml');
      res.send(data);
    }
  });
});

app.get('/feed', (req, res) => {
  const filePath = path.join(__dirname, 'xml', 'feed.xml');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.type('application/xml');
      res.send(data);
    }
  });
});

function generateRandomXml() {
  const root = xmlbuilder.create('rss');
  root.att('version', '2.0');

  const channel = root.ele('channel');
  channel.ele('title', 'Random RSS Feed');
  channel.ele('link', 'https://example.com');

  for (let i = 0; i < Math.floor(Math.random() * 25 + 1); i++) {
    const item = channel.ele('item');
    item.ele('title', `Item ${i}`);
    item.ele('description', `This is item ${i}`);
  }

  return root.end({ pretty: true });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
