const assert = require('assert');
const {
    addToDatabase, envelopes_db
  } = require('./envelopes_db');
const envelopesRouter = require ('./envelopes_routes');


describe ('envelopesRouter.get',()=>{
    it('gets all envelopes', ()=>{
        const expected = envelopes_db;
        const result = envelopesRouter.get('/', (req,res,next)=>{
            res.json(envelopes_db)
        });
        assert.equal(expected,result)
    })
});