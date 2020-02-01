import { getRedisConnection } from './connection'

var express = require('express');
var router = express.Router();
const split = require('split-string');

router.post('/', async function(req, res, next){
  const { command } = req.body
  if(typeof command !== "string"){
    return res.status(422).end("wrong input")
  }

  const redisArgs = split(command, {separator: ' ', quotes: ['"'] })

  const redisConn = getRedisConnection(req)
  await redisConn.call(...redisArgs, (err, data) => {
    console.log('err, data', err, data)
    if(err)
      return
    return res.json({result: data})
  })
    .catch(err =>  res.json({result: err.message}))
});



module.exports = router;
