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

/**
 * define variable via URL :id
 * it can be added a lot of variables: :id/:x/:y
 * if you want to make it option you just add '?'
 * :id/:x/:y?
 */
app.get('/api/v1/tours/:id', (req, res) => {

   const id = parseInt(req.params.id);
   const tour = tours.find(item => item.id === id);

   if (id > tours.length) {
      return res.status(404).json({
         status: 'failed',
         message: 'Invalid ID'
      });
   }

   res.status(200).json({
      status: 'success',
      data: {
         tour
      }
   });
});

/**
 * there are two http method to update: put & patch
 * put: is expected to receive all the values when we sent to the application
 * patch: is only expected the properties we need to update
 */
app.patch('/api/v1/tours/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const newTour = Object.assign(({ id: id }, req.body));

   if (id > tours.length) {
      res.status(404).json({
         status: 'fail',
         data: {
            tour: 'Invalid ID'
         }
      })
   };

   res.status(200).json({
      status: 'success',
      data: {
         tour: newTour
      }
   })
});

/**
 * to delete a register you only need use delete
 * and implement the logic to delete in your database
 *
 * even in the real world we are going
 * to send 204 code for when it's deleted
 */

app.delete('/api/v1/tours/:id', (req, res) => {
   const id = parseInt(req.params.id);

   if (id > tours.length) {
      res.status(404).json({
         status: 'fail',
         data: {
            tour: 'Invalid ID'
         }
      })
   };

   res.status(204).json({
      status: 'success',
      data: {
         tour: null
      }
   })
});

const port = 3000;
app.listen(port, () => {
   console.log('starting application...');
});