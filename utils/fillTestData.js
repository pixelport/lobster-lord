var Redis = require("ioredis");
const uuidv4 = require('uuid/v4');

const getRedisConnection = () => {
    return new Redis({
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: "",
        db: 0
    });
};
const redisConn = getRedisConnection()
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


for(let i = 0; i < 40000; i++){
    const key = "jobs:" + randomIntFromInterval(1, 100) + ":" + uuidv4();
    console.log('adding key', key)
    redisConn.set(key, 'test value')
}

/*
for(let i = 0; i < 1000; i++){
    const key = "nested:a" + randomIntFromInterval(1, 4) + ":b" + randomIntFromInterval(1, 10) + ":c"
        + randomIntFromInterval(1, 10) +  ":d" + randomIntFromInterval(1, 10) + ":" + uuidv4();
    console.log('adding key', key)
    redisConn.set(key, 'test value')
}

 */
console.log('done')
