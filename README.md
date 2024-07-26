# fastify-openapi-typescript-generator
Contains utilities to generate fastify types from openapi definition for the fastify framework.
Particurarly generates routes handlers typed and can be used along with the [fastify-openapi-glue](https://www.npmjs.com/package/fastify-openapi-glue) package.

## Installation
`npm i @quinck/fastify-openapi-typescript-generator --save-dev`

## Tests
`npm run test`
The tests are going to be implemented soon.

## Usage
```sh
fastify-openapi-typescript --help

Usage: fastify-openapi-typescript [options]

CLI to generate openapi typscript types from openapi

Options:
  -V, --version         output the version number
  -i, --input <value>   OpenAPI specification path, can be both yaml or json (required)
  -o, --output <value>  Output directory (required)
  -h, --help            display help for command
```

```sh
fastify-openapi-route-configs --help

Usage: fastify-openapi-route-configs [options]

CLI to generate route configs from openapi

Options:
  -V, --version         output the version number
  -i, --input <value>   OpenAPI specification path, can be both yaml or json (required)
  -o, --output <value>  Output directory (required)
  -h, --help            display help for command
```

## Contact
* Quinck: info@quinck.io
* Stefano Righini: stefano.righini@quinck.io