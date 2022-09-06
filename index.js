const express = require('express');
const http = require('http');
const { createTerminus } = require('@godaddy/terminus');

const app = express();
const port = 5001;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const server = http.createServer(app);

const shutdownRedis = () => {
    return new Promise((resolve) => {
        console.log('>>>> graceful shutdown redis (start)');
        setTimeout(() => {
            console.log('>>>> graceful shutdown redis (end)');
            resolve();
        }, 1000);
    });
};

const shutdownServer = () => {
    return new Promise((resolve) => {
        console.log('>>>> graceful shutdown server (start)');
        server.close(() => {
            console.log('>>>> graceful shutdown server (end)');
            resolve();
        });
    });
};

const onSignal = () => {
    return Promise.all([
        shutdownRedis(),
        shutdownServer()
    ]).then(() => {
        console.log('All tasks done!');
    })
}

const beforeShutdown = () => {
    // given your readiness probes run every 5 second
    // may be worth using a bigger number so you won't
    // run into any race conditions
    console.log('>>>> before shutdown (start)');
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('>>>> before shutdown (end)');
            resolve();
        }, 1000); // 1 second just to test
    })
  }

const onShutdown = () => {
    console.log('>>>> all done');
}

const terminusOptions = {
    signals: ['SIGINT', 'SIGTERM'],
    onSignal: onSignal,
    shutdown: onShutdown,
    beforeShutdown: beforeShutdown
};

createTerminus(server, terminusOptions);
// process.on('SIGINT', onSignal);
// process.on('SIGTERM', onSignal);

server.on('error', (err) => {
    console.log('ERROR 1', err);
});

server.on('error', (err) => {
    console.log('ERROR 2', err);
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Send a SIGTERM`);
    console.log(`  - when starting node locally: "kill -15 ${process.pid}"`);
    console.log(`  - when starting with docker: "docker stop test-docker-signals"`);
});
