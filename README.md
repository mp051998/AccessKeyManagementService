# Access Key Management Service

## Description

This is a simple nest app to allow admins to generate custom access keys to users. This service acts as a middleware of sorts and enforces rate limiting on the access keys. The access keys are stored in a redis datastore and the rate limiting is enforced using custom logic in the access key service.

## Installation

```bash
$ npm install
```

TODO: Add instructions to setup and run redis

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
