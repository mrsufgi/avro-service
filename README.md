### Solution by Ori Avraham (mrsufgi)

# How to run

## Locally

install deps

```
npm install
```

start

```
npm start
```

test

```
npm test
```

Env parameters:

| param       | type   |
| ----------- | ------ |
| folder_path | String |

Example:

```
folder_path=./schemas npm start
```

## Docker

```
docker-compose up -d
```

with env:

```
folder_path=./schemas docker-compose up -d
```
