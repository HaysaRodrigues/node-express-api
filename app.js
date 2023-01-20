const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json()); //this can modify the incoming data

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

/**
 * normally it follows the same name we just need to change the method type
 */
app.post('/api/v1/tours', (req, res) => {
   console.log(req.body);
   //database adds the id for the item being add automatically but since we
   //don't have the id, we will make it manually

   const newId = tours[tours.length - 1].id + 1;
   const newTour = Object.assign(({ id: newId }, req.body));

   tours.push(newTour);
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
      res.status(201).json({
         status: 'success',
         data: {
            tour: newTour
         }
      });
   });
});

const port = 3000;
app.listen(port, () => {
   console.log('starting application...');
});