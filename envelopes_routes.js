const express = require('express');
const envelopesRouter = express.Router();
module.exports = envelopesRouter;
const morgan = require('morgan');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'personal_budget_II',
  password: 'postgres',
  port: 5432,
});


//Get all envelopes
const getEnvelopes = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM envelopes');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

//Get total budget
const getTotalBudget = async (request, response) => {
  try {
    const results = await pool.query('SELECT SUM(budget) AS total_budget FROM envelopes');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

//Get envelope by id
const getEnvelopeById = async (request, response) => {
  try{
    const id = request.params.id;
    if (isNaN(id)){
      response.status(400).json({error:'Invalid id. It must be a number'});
      return;
    };
    const result = await pool.query('SELECT * FROM envelopes WHERE id = $1', [id]);
    if(result.rows.length === 0){
      response.status(404).send('User not found');
      return;
    }; 
    response.status(200).json(result.rows)
  } catch (error){
    console.error("Error executing SQL query:", error);
    response.status(500).json({ error: "Internal Server Error" });
  };
};

//create envelope
const createEnvelope = async (request, response) => {
  try{
  const name = request.query.name
  const budget = request.query.budget
  const description = request.query.description

  if (name === undefined || budget === undefined){
    response.status(400).json({error:'Not null values allowed for name and budget'});
    return;
  };

  const results = await pool.query('INSERT INTO envelopes (name, budget, description) VALUES ($1, $2, $3) RETURNING *', [name, budget, description], (error, results) => {
    
    response.status(201).send(`Envelope added with ID: ${results.rows[0].id}`)
  })} catch(error){
    console.error("Error executing SQL query", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

//update envelope
const updateEnvelope = async (request, response) => {
  try{
  const id = parseInt(request.params.id)
  const name = request.query.name
  const budget = request.query.budget
  const description = request.query.description

  if (isNaN(id)){
    response.status(400).json({error:'Invalid id. It must be a number'});
    return;
  };

  const results = await pool.query(
    'UPDATE envelopes SET name = $1, budget = $2, description = $3 WHERE id = $4',
    [name, budget, description, id])

    if (results.rowCount === 0) {
      response.status(404).send(`User with ID ${id} not found`);
      return;
    }
    
      response.status(200).send(`Envelope modified with ID: ${id}`)
    }catch(error){
      console.error("Error executing SQL query", error);
      response.status(500).json({ error: "Internal Server Error" });
    } 
};

//delete envelope by id
const deleteEnvelopeById = async (request, response) => {
  try{
    const id = parseInt(request.params.id);

    if (isNaN(id)){
      response.status(400).json({error:'Invalid id. It must be a number'});
      return;
    };

  const results= await pool.query('DELETE FROM envelopes WHERE id = $1', [id]) ;

  if (results.rowCount === 0) {
    response.status(404).send(`Envelope with ID ${id} not found`);
    return;
  };
    
  response.status(200).send(`Envelope deleted with ID: ${id}`);
  
  }catch(error){
    console.error("Error executing SQL query", error);
      response.status(500).json({ error: "Internal Server Error" });
  };
};

//transfers budgets from different envelopes. Amount goes in header.
const transferBudgets = async (request, response) => {
  try{
  const transferAmount = parseFloat(request.get('Transfer-Amount'));
  if (isNaN(transferAmount) || transferAmount <= 0) {
    res.status(400).send('Invalid transfer amount');
    return;
  };
  const fromEnvelopeId = request.params.from;
  const toEnvelopeId = request.params.to;

  if (isNaN(fromEnvelopeId) || isNaN(toEnvelopeId)){
    response.status(400).json({error:'Invalid id. It must be a number'});
    return;
  };

  // (Deduct the transfer amount from the source envelope)
  const deductResult = await pool.query(
    'UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING budget',
    [transferAmount, fromEnvelopeId]
  );
  
  if (deductResult.rowCount === 0) {
    response.status(404).send(`Envelope with ID ${id} not found`);
    return;
  };

  await pool.query(
    'UPDATE envelopes SET budget = budget + $1 WHERE id = $2',
    [transferAmount, toEnvelopeId]
  );

  response.status(200).send(`Budget transfer succesful.`);

} catch(error){
  console.error('Error',error);
  response.status(500).json({ error: "Internal Server Error" });
};
}; 

module.exports = {
  getEnvelopes,
  getEnvelopeById,
  createEnvelope,
  deleteEnvelopeById,
  updateEnvelope,
  transferBudgets,
  getTotalBudget
  };


