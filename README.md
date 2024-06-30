# Access Key Management Service

## Description

This is a simple nest app to allow admins to generate custom access keys to users. This service acts as a middleware of sorts and enforces rate limiting on the access keys. The access keys are stored in a redis datastore and the rate limiting is enforced using custom logic in the access key service.

## Installation

```bash
$ npm install
```

### Setup Redis

Follow the instructions [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/) to install redis on your machine.

### Setup Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```bash
PORT=3000 # Port the app will run on

# NOTE: This must match the PUBSUB channel in the Web3TokenInformationService as well
REDIS_HOST=localhost # Redis host
REDIS_PORT=6379 # Redis port
REDIS_PUBSUB_CHANNEL=access-keys # Redis pubsub channel

# MongoDB related
MONGO_CONNECTION_STRING=mongodb://localhost:27017 # MongoDB connection string

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Collection (Thunder Client):

NOTE: This collection is for the local environment. The base URL is set to `http://localhost:3000`. Change the base URL to the deployed URL if you want to use it in a deployed environment.
Can be found [here](./thunder-collection.json)
