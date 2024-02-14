const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const queries = require('./envelopes_routes');

const PORT = process.env.PORT || 4001;

app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}`)});


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

//get all envelopes
app.get('/envelopes', queries.getEnvelopes);
//get envelope by id
app.get('/envelopes/:id', queries.getEnvelopeById);
//get total budget
app.get('/totalbudget', queries.getTotalBudget);
//create envelope
app.post('/envelopes', queries.createEnvelope);
//update envelope
app.put('/envelopes/:id', queries.updateEnvelope);
//delete envelope by id
app.delete('/envelopes/:id', queries.deleteEnvelopeById);
//transfer amounts from budgets
app.put('/envelopes/:from/:to', queries.transferBudgets);