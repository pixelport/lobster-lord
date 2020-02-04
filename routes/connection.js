var express = require('express');
const uuidv4 = require('uuid/v4');
var router = express.Router();
var Redis = require("ioredis");

export const getRedisConnection = (req) => {
  const connectionId = req.query.connection
  if(!connectionId || !req.session)
    return null

  const connection = req.session.connections.find((conn) => conn.id === connectionId)
  return new Redis(connection.server, {
    password: connection.password
  });
};

router.post('/new', function(req, res, next) {
  // only allow specific attributes to be saved in session
  const newConnectionId = uuidv4()
  req.session.connections = [
    ...(req.session.connections || []),
    {
      server: req.body.server,
      password: req.body.password,
      name: req.body.name,
      id: newConnectionId,
      publicId: uuidv4().split('-')[0],
      canUserAccess: true, /* indicates if user can view server and password and can edit this connection */
    }
  ]
  return res.json({success: true, newConnectionId: newConnectionId, connections: getConnectionsForClient(req.session)})
});

router.post('/update', function(req, res, next){
  const connectionIn = req.body

  const i = req.session.connections.findIndex(conn => conn.id === connectionIn.id)
  if(i === -1){
    return res.status(404)
  }
  else{
    req.session.connections[i] = connectionIn
    return res.json({success: true, connections: getConnectionsForClient(req.session)})
  }
})

router.post('/delete', function(req, res, next){
  const { id: connIdToDelete } = req.body

  req.session.connections = req.session.connections.filter(conn => conn.id !== connIdToDelete)
  return res.json({success: true, connections: getConnectionsForClient(req.session)})
})

router.get('/all', function (req, res, next) {
  return res.json(getConnectionsForClient(req.session))
})

function getConnectionsForClient(session){
  return (session.connections || []).map(conn => {
    return {
      id: conn.id, /* secret connection token */
      publicId: conn.publicId, /* non secret connection id */
      name: conn.name,
      server: conn.server,
      ...(conn.canUserAccess ? conn : {})
    }
  })
}

module.exports = router;
