const express = require('express');
const axios = require('axios');
const app = express();


const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
// const QUOTES_API_KEY = process.env.QUOTES_API_KEY;

const err = "Sage seems to be unavailable at the moment! Maybe the API the sage is using i down here's some of my favorite qoute:<br>"
const fallbackQuotes = [
  "A lion doesn't bother himself with opinion of the sheep",
  "I'm the one who knocks",
  "Man this API stinks!"
]
async function getQuote() {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    return response.data.content;
  } catch (error) {
    console.error('Error fetching quote, using fallback:', error.message);
    return err+fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

app.get('/', async (req, res) => {
try{
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('UNSPLASH_ACCESS_KEY is not set');
      process.exit(1);
    }

    // const imageResponse = await axios.get(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`);
    // const quoteResponse = await axios.get('https://api.quotable.io/random');
    const [imageResponse, quote] = await Promise.all([
      axios.get(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`),
      getQuote()
    ]);

    const imageUrl = imageResponse.data.urls.regular;
    const photographerName = imageResponse.data.user.name;
    const photographerProfileUrl = imageResponse.data.user.links.html;  
  
    res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Random Image and Quote</title>
      </head>
      <body>
          <h1 style="text-align: center">ImageSage</h1>
          <h2  style="text-align: center">Images with worthless wosdom</h2>
          <div style="text-align: center;">
              <img src="${imageUrl}" alt="Random Image" style="max-width: 100%; height: auto;">
              <p class="credit" style="font-size: 12px">Photo by <a href="${photographerProfileUrl}" target="_blank">${photographerName}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a></p>
              <p style="font-size: 36px;">${quote}</p>
          </div>
      </body>
      </html>`);
} catch(error){
    console.log(error);
    res.status(501).send(`<body>Image sage seems to be out of wisdom!</body>`);
  }

});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
