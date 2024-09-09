const UNSPLASH_ACCESS_KEY = '__UNSPLASH_ACCESS_KEY__'; // This will be replaced during build
const err = "Sage seems to be unavailable at the moment! Here's one of my favorite quotes:<br>"
const fallbackQuotes = [
  "A lion doesn't bother himself with opinion of the sheep",
  "I'm the one who knocks",
  "Man this API stinks!"
]

async function getQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching quote, using fallback:', error.message);
    return err + fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

async function getRandomImage() {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    return {
      imageUrl: data.urls.regular,
      photographerName: data.user.name,
      photographerProfileUrl: data.user.links.html
    };
  } catch (error) {
    console.error('Error fetching image:', error.message);
    return null;
  }
}

async function updatePage() {
  const quoteElement = document.getElementById('quote');
  const imageElement = document.getElementById('randomImage');
  const creditElement = document.getElementById('credit');

  const [imageData, quote] = await Promise.all([getRandomImage(), getQuote()]);

  if (imageData) {
    imageElement.src = imageData.imageUrl;
    creditElement.innerHTML = `Photo by <a href="${imageData.photographerProfileUrl}" target="_blank">${imageData.photographerName}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
  } else {
    console.log("Image empty!")
    imageElement.style.display = 'none';
    creditElement.style.display = 'none';
  }

  quoteElement.textContent = `"${quote}"`;
}

updatePage();
