/**
 * Module dependencies.
 */
// const io = require('./app').io;
// const redis = require('socket.io-redis');
// io.adapter(redis({ host: 'localhost', port: 6379 }));

const os = require('os');
const cluster = require('cluster');

/**
 * Cluster setup.
 */

// Setup the cluster to use app.js
cluster.setupMaster({
    exec: 'app.js'
});

// Listen for dying workers
cluster.on('exit', (worker) => {
    console.log('Worker ' + worker.id + ' died');
    // Replace the dead worker
    cluster.fork();
});

// Fork a worker for each available CPU
for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}