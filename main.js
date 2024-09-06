const express = require('express');
const axios = require('axios');
const app = express();


const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
// const QUOTES_API_KEY = process.env.QUOTES_API_KEY;


app.get('/', async (req, res) => {

    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('UNSPLASH_ACCESS_KEY is not set');
      process.exit(1);
    }

    const imageResponse = await axios.get(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`);
    const quoteResponse = await axios.get('https://api.quotable.io/random');

    const imageUrl = imageResponse.data.urls.regular;
    const quote = quoteResponse.data.content;

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random Image and Quote</title>
</head>
<body>
    <div style="text-align: center;">
        <img src="${imageUrl}" alt="Random Image" style="max-width: 100%; height: auto;">
        <p>${quote}</p>
    </div>
</body>
</html>`);
 
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
