const express = require('express');
const router = express.Router();
const axios = require('axios');
require ('dotenv').config();

router.get("/api", function (req, res, next) {
  console.log('hi there');
  const api_key = process.env.key;
  axios.get(`https://www.rijksmuseum.nl/api/en/collection?key=${api_key}=1&ps=100&st=Objects`)
    .then((responseFromAPI) => {
      console.log(responseFromAPI.data);
      const data = responseFromAPI.data;
      
      res.render("index", { title: "Maybe?", data });
    })
    .catch((err)=>console.log(err))
});

module.exports = router;