const express = require('express');
const router = express.Router();
const axios = require('axios');
require ('dotenv').config();

router.get("/rijksmuseum", function (req, res, next) {
  console.log('Here are the title, artist, and img url');
  const api_key = process.env.key;
  axios.get(`https://www.rijksmuseum.nl/api/en/collection?key=${api_key}=1&ps=100&st=Objects`)
    .then((responseFromAPI) => {
      responseFromAPI.data.artObjects.forEach(e => {
      const {title, principalOrFirstMaker, webImage:{url}} = e;
      console.log("****",title, principalOrFirstMaker, url)
      });
      res.render('apiViews/rijksmuseum', {apiValue: responseFromAPI.data.artObjects})
    })
    .catch((err)=>console.log(err))
});

module.exports = router;