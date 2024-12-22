# pulsefeed-api
API service for pulsefeed frontend applications.

## Setup
```bash
$ cp .env.local .env
$ npm install
```

## Run
```bash
$ npm run start
```

## Test
```bash
$ npm run test
```

## Post-Build
### Copy generated prisma client to dist folder
- During post-build stage, we manually copy the generated prisma client to dist folder.
  This is done by including the generated client directory as assets in `nest-cli.json`.
