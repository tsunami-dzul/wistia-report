const https = require('https');
const fs = require('fs');
const { log } = require('console');

const findWistiaIds = (url) => {
  https
    .get(url, (res) => {
      res.on('data', (chunk) => {
        console.log('processing url: ', url);

        processWistiaIds(chunk, url);
      });
    })

    .on('error', (err) => {
      console.error(`Error in ${url}:`, err.message);
    });
};

const processWistiaIds = (chunk, url) => {
  const wistiaMatches = chunk.toString('utf-8').matchAll(new RegExp('wistia_async_', 'gi'));
  const wistiaIds = [];

  for (const match of wistiaMatches) {
    const wistiaId = match.input.slice(match.index, match.index + 23).split('_')[2];

    wistiaIds.push(wistiaId);
  }

  if (wistiaIds.length > 0) {
    const data = `${url}, ${wistiaIds.join()}\n`;

    fs.appendFileSync('./wistiaId/wistiaReport5.csv', data);
  }
};

const getWistiaIds = () => {
  const urls = fs.readFileSync('./links/urls.txt', { encoding: 'utf-8' }).split('\n');

  fs.appendFileSync(
    './wistiaId/wistiaReport5.csv',
    'URL, wistiaId-1, wistiaId-2, wistiaId-3, wistiaId-4, wistiaId-5, wistiaId-6, wistiaId-7, wistiaId-8 \n'
  );

  for (let i = 0; i < urls.length; i++) {
    findWistiaIds(urls[i]);
  }
};

getWistiaIds();
