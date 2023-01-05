const express = require('express');
const fs = require('fs');
const app = express();

//why fileSync
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/**
 * always include the api version
 * the main advantage about that is because
 * you can change your endpoint with /api/v2/tours
 * and still letting the clients use  /api/v1/tours.
 * Almost a A/B test./??"" */

/**
 * eventLoop will execute the first code, first,
 * so we need to get the data before the endpoints
 */

app.get('/api/v1/tours', (req, res) => {
   res.status(200).json({
      status: 'success',
      results: tours.length, // this attribute only makes sense if you are sending an array
      data: {
         tours
      }
   })
});

const port = 3000;
app.listen(port, () => {
   console.log('aplicação iniando');
});