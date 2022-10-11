const express = require('express')
const {con} = require('../config/dbconfig')
const verifyJWT = require('../middleware/verifyToken')
const client = require('../config/redisConfig')

const router = express.Router()

//get data from cache if present
async function cacheData(req, res, next) {
    let results;
    try {
      const cacheResults = await client.get("items");
      if (cacheResults) {
        results = JSON.parse(cacheResults);
        res.status(200).send({
          fromCache: true,
          data: results,
        })
      } else {
        next();
      }
    } catch (error) {
      console.error(error)
      res.status(404)
    }
}

router.get('/', cacheData, (req, res) => {
    const query = "SELECT id, name, quantity FROM `items`;";
                
    con.query(query ,async function (err, result) {
        if (err) throw err
     
        if(!result.length) {
            console.log("No items");
            res.status(200).json({message: `No items in the database`})
        }
        await client.set("items", JSON.stringify(result), {
            EX: 180,
            NX: false,
        })
        res.status(200).send({
            fromCache: false,
            data: result,
        })
    })
})

router.post('/updateItem', cacheData, (req, res) => {
  
  const query = "SELECT id, name, quantity FROM `items`;";
              
  con.query(query ,async function (err, result) {
      if (err) throw err
   
      if(!result.length) {
          console.log("No items");
          res.status(200).json({message: `No items in the database`})
      }
      await client.set("items", JSON.stringify(result), {
          EX: 180,
          NX: false,
      })
      res.status(200).send({
          fromCache: false,
          data: result,
      })
  })
})

module.exports = router