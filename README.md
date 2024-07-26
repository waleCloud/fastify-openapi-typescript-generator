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
openapi --help

  Usage: openapi [options]

Options:
  -i, --input <value>   OpenAPI specification path, can be both yaml or json (required)
  -o, --output <value>  Output directory (required)
  -h, --help            display help for command

  Examples
    $ openapi --input ./spec.json --output ./generated
    $ openapi --input ./spec.yaml --output ./generated
```


## Contact
* Quinck: info@quinck.io
* Stefano Righini: stefano.righini@quinck.io