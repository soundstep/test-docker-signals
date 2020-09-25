# Test docker signals

## Install

```
pnpm install
```

## Unix signal output

When the signals are handled properly, the output in this app should be:

```
>>>> before shutdown (start)
>>>> before shutdown (end)
>>>> graceful shutdown redis (start)
>>>> graceful shutdown server (start)
>>>> graceful shutdown server (end)
>>>> graceful shutdown redis (end)
All tasks done!
```

## Usage with local node

Start server:

```
node index.js
```

### Send SIGTERM

```
kill -15 <PID>
```

### Send a SIGINT:

Press CTRL + C

## Usage with docker

Build and run

```
docker build . -t test-docker-signals:latest
docker run -it -p 5000:5000 --name test-docker-signals test-docker-signals
```

Cleanup

```
docker rm test-docker-signals
```

### Send SIGTERM

Send a `SIGTERM`:

```
docker stop test-docker-signals
```
