/*const inputArray=[];

const Calculate = {
sum(inputArray) {

    return inputArray.reduce((sum, value) => {
      return sum + value;
    })
  }}

  console.log(Calculate.sum(inputArray))*/

  const envelopes_db = [
    {total_budget: "0"},
    {id:"1",budget:"100"},
    {id:"2",budget:"100"}

];

const totalBudget = envelopes_db[1].budget
const fromEnvelope = envelopes_db.find(envelope => envelope.id === "1");

//console.log(fromEnvelope);
console.log("6661"+2)