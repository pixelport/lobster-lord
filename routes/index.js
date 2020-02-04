import { getRedisConnection } from './connection'

var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');

router.get('/scan/:pattern/:cursor', async function(req, res, next){
  console.log(req.params)
  const redisConn = getRedisConnection(req)
  let cursor = req.params.cursor || '0'
  let allKeys = []
  for(let i = 0; i < 100; i++) {
    const [cursorRes, keys] = await redisConn.scan(cursor, 'MATCH', req.params.pattern || '*', 'COUNT', 1000)
    cursor = cursorRes
    allKeys = [...allKeys, ...keys]
    if (cursor === '0') {
      break;
    }
  }
  return res.json({
    cursor: cursor,
    keys: allKeys,
  })
});

async function getKeyInfo(key, redisConn){
  const [keyTypeRes, ttlRes] = await redisConn.pipeline().type(key).ttl(key).exec()
  const type = keyTypeRes[1]
  const ttl = ttlRes[1]

  let value = null
  if(type === 'string'){
    value = await redisConn.get(key)
  }
  else if(type === 'list'){
    value = await redisConn.lrange(key, 0, -1)
  }
  else if(type === 'set'){
    value = await redisConn.smembers(key)
    value = value.sort()
  }
  else if(type === 'zset'){
    value = await redisConn.zrange(key, 0, -1, 'WITHSCORES')
    let flattenedValue = []
    for(let i = 0; i < value.length; i += 2){
      flattenedValue.push({member: value[i], score: value[i + 1]})
    }
    value = flattenedValue
  }
  else if(type === 'hash'){
    value = await redisConn.hgetall(key)
  }

  return {
    type: type,
    ttl: ttl,
    value,
    key,
  }
}

router.post('/key/new', async function(req, res, next){
  const { key, type } = req.body
  const redisConn = getRedisConnection(req)

  try {
    if (type === 'string') {
      await redisConn.set(key, '')
    } else if (type === 'list') {
      await redisConn.lpush(key, '')
    } else if (type === 'set') {
      await redisConn.sadd(key, '')
    } else if (type === 'zset') {
      await redisConn.zadd(key, 0, '')
    } else if (type === 'hash') {
      await redisConn.hset(key, '', '')
    } else {
      throw new Error('type not supported')
    }
  }
  catch(e){
    return res.json({err: e.message})
  }
  return res.json({result: 'ok'})
})

router.get('/key/:key', async function(req, res, next){
  const { key } = req.params
  console.log(req.params)
  const redisConn = getRedisConnection(req)
  const keyInfo = await getKeyInfo(key, redisConn)

  return res.json(keyInfo)
});

router.get('/delete/key/:key', async function(req, res, next){
  const { key } = req.params
  console.log(req.params)
  const redisConn = getRedisConnection(req)
  await redisConn.del(key)

  const keyInfo = await getKeyInfo(key, redisConn)
  return res.json(keyInfo)
});

router.post('/rename/key/:key/newKey/:newKey', async function(req, res, next){
  const { key, newKey } = req.params
  console.log(req.params)
  const redisConn = getRedisConnection(req)
  await redisConn.rename(key, newKey)

  const keyInfo = await getKeyInfo(key, redisConn)
  return res.json(keyInfo)
});

router.post('/set/key/:key', async function(req, res, next){
  const { key } = req.params
  const { value } = req.body
  if(typeof value !== "string"){
    return res.status(422).end("wrong input")
  }
  const redisConn = getRedisConnection(req)
  await redisConn.set(key, value)

  return res.json({
    result: 'ok'
  })
});

/* Lists */
router.post('/lset/key/:key', async function(req, res, next){
  const { key } = req.params
  const { value, index } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.lset(key, index, value)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

router.post('/ldel/key/:key', async function(req, res, next){
  const { key } = req.params
  const { index } = req.body

  const redisConn = getRedisConnection(req)
  const toombstone = uuidv4()
  await redisConn.lset(key, index, toombstone)
  await redisConn.lrem(key, 0, toombstone)

  return res.json({
    result: 'ok',
    ...(await getKeyInfo(key, redisConn))
  })
});

router.post('/rpush/key/:key', async function(req, res, next){
  const { key } = req.params
  const { value } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.rpush(key, value)

  return res.json({
    result: 'ok',
    ...(await getKeyInfo(key, redisConn))
  })
});

/* Sets */
router.post('/sadd/key/:key', async function(req, res, next){
  const { key } = req.params
  const { value, index } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.sadd(key, value)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

router.post('/srem/key/:key', async function(req, res, next){
  const { key } = req.params
  const { value } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.srem(key, value)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

router.post('/sset/key/:key', async function(req, res, next){
  const { key } = req.params
  const { oldMember, newMember } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.srem(key, oldMember)
  await redisConn.sadd(key, newMember)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

/* sorted sets */

router.post('/zset/key/:key', async function(req, res, next){
  const { key } = req.params
  const { oldMember, newMember, score } = req.body

  const redisConn = getRedisConnection(req)
  if(oldMember !== undefined && oldMember !== newMember)
    await redisConn.zrem(key, oldMember)
  await redisConn.zadd(key, score, newMember)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

router.post('/zrem/key/:key', async function(req, res, next){
  const { key } = req.params
  const { member } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.zrem(key, member)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

/* hashes */
router.post('/hset/key/:key', async function(req, res, next){
  const { key } = req.params
  const { oldHashKey, newHashKey, value } = req.body

  const redisConn = getRedisConnection(req)
  if(oldHashKey !== undefined && oldHashKey !== newHashKey){
    await redisConn.hdel(key, oldHashKey)
  }
  await redisConn.hset(key, newHashKey, value)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

router.post('/hrem/key/:key', async function(req, res, next){
  const { key } = req.params
  const { hashKey } = req.body

  const redisConn = getRedisConnection(req)
  await redisConn.hdel(key, hashKey)

  return res.json({
    ...(await getKeyInfo(key, redisConn)),
    result: 'ok'
  })
});

module.exports = router;
