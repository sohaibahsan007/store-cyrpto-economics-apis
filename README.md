# store-cyrpto-economics-apis

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Setup environment variable

Before you can run the API, you need to set the variables which includes db, baserow and coingecko env values. You can find the `environment.ts` under `src/environments/environment.ts`.

Test variables:

```
  NODE_ENV: "DEV",
  DB_HOST: "",
  DB_PORT: "",
  DB_USER: "",
  DB_PASSWORD: "",
  DB_NAME: "",
  DB_URL: "",
  BASEROW_TOKEN: "",
  BASEROW_BASE_URL: "",
  BASEROW_TOKEN_INFO_TABLE: "",
  COINGECKO_BASE_URL: "",
  DEFAULT_TOKEN_SYMBOL: "",
```


## Baserow Setup.

I have used `https://baserow.oracle.storecloud.org/database/123/table/469` table for this test. You can use it as well, just copy the token and API URL and set them in `src/environments/environment.ts` file.



## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Supported endpoints:

* Refresh/Pull Crypto Prices from Coingecko `/refresh/crypto-prices`
* Refresh/Pull Token Info from Baserow table `/refresh/token-info`
* Get $STORE Token Info `/token/$store/info`
* Get $STORE Token Market Cap `/token/$store/market_cap/{unit}`. Pass unit as usd, bitcoin or ethereum to get $STORE token market cap in that unit
* Get $STORE Token Price `/token/$store/price/{unit}`. Pass unit as usd, bitcoin or ethereum to get $STORE token market cap in that unit
* Get $STORE Token Supply `/token/$store/supply`

You can check available endpoints by opening http://localhost:3000/explorer/ as well. Where you can test the endpoints.


## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

