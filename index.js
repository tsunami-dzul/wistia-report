const https = require('https');
const fs = require('fs');

const MAX_LINK_LENGTH = 2048;
const links = [];
const wistiaIds = [];
const sitemap = [];

const findWistiaIds = (url) => {
  https
    .get(url, (res) => {
      res.on('data', (chunk) => {
        getWistiaIds(chunk);

        getLinkFromCurrentPage(chunk);
      });

      res.on('end', () => {
        sitemap.push({
          url,
          links,
          wistiaIds,
        });

        console.log(sitemap);

        // fs.writeFileSync('./downloadFiles/website.html', data);
        // console.log('HTML saved to website.html');
      });
    })

    .on('error', (err) => {
      console.error('Error:', err.message);
    });
};

const getWistiaIds = (chunk) => {
  const wistiaMatches = chunk.toString('utf-8').matchAll(new RegExp('wistia_async_', 'gi'));

  for (const match of wistiaMatches) {
    const wistiaId = match.input.slice(match.index, match.index + 23).split('_')[2];
    wistiaIds.push(wistiaId);
  }
};

const getLinkFromCurrentPage = (chunk) => {
  const linkMatches = chunk.toString('utf-8').matchAll(new RegExp('https:', 'gi'));

  for (const linkMatch of linkMatches) {
    const prevLink = linkMatch.input.substring(linkMatch.index, linkMatch.index + MAX_LINK_LENGTH);
    const link = prevLink.substring(0, prevLink.indexOf('"'));

    if (
      link !== '' &&
      link.indexOf('.js') < 0 &&
      link.indexOf('.css') < 0 &&
      link.indexOf('/login') < 0 &&
      link.indexOf('.jpg') < 0 &&
      link.indexOf('/css?') < 0
    ) {
      links.push(link);
    }
  }
};

const url = 'https://www.exactsciences.com';

findWistiaIds(url);
