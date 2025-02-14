const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const visitedUrls = new Set();

async function extractLinks(url, baseUrl) {
  try {
    if (visitedUrls.has(url)) {
      return [];
    }

    visitedUrls.add(url);

    fs.appendFileSync('./links/urls.txt', `${url}\n`);

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const links = [];

    $('a').each((index, element) => {
      const href = $(element).attr('href');

      if (href) {
        const absoluteUrl = new URL(href, baseUrl).href;

        if (
          absoluteUrl !== '' &&
          absoluteUrl.indexOf('.js') < 0 &&
          absoluteUrl.indexOf('.css') < 0 &&
          absoluteUrl.indexOf('/login') < 0 &&
          absoluteUrl.indexOf('.jpg') < 0 &&
          absoluteUrl.indexOf('.jpeg') < 0 &&
          absoluteUrl.indexOf('.png') < 0 &&
          absoluteUrl.indexOf('tel:') < 0 &&
          absoluteUrl.indexOf('mailto:') < 0 &&
          absoluteUrl.indexOf('google.com') < 0 &&
          absoluteUrl.indexOf('x.com') < 0 &&
          absoluteUrl.indexOf('facebook.com') < 0 &&
          absoluteUrl.indexOf('linkedin.com') < 0 &&
          absoluteUrl.indexOf('.gif') < 0 &&
          absoluteUrl.indexOf('.pdf') < 0 &&
          absoluteUrl.indexOf('#') < 0 &&
          absoluteUrl.indexOf('javascript') < 0 &&
          absoluteUrl.indexOf('/css?') < 0 &&
          absoluteUrl.indexOf('exactsciences.com') >= 0
        ) {
          links.push(absoluteUrl);
        }
      }
    });

    console.log(`Found ${links.length} links on ${url}`);

    for (const link of links) {
      await extractLinks(link, baseUrl);
    }
  } catch (error) {
    console.error(`Error processing ${url}:`, error.message);
  }
}

async function scrapeAllLinks(startUrl) {
  const baseUrl = new URL(startUrl).origin;
  await extractLinks(startUrl, baseUrl);

  console.log('All links found:', Array.from(visitedUrls));
}

// Example usage
const startUrl = 'https://www.exactsciences.com';
scrapeAllLinks(startUrl);
