# NestJs TypeScript starter

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
````
Node Version 18.13.0
````
## Installation

```bash
# first:
$ npm install
# then:
$ npm run prepare
```

## Logs
If the NODE_ENV variable is set to 'localhost' then the logs will be printed
in the terminal, otherwise the logs will be saved to a file called application_logs.log.
This is only for the starter because we need to provide <b>Winston</b> with another
transporter like logtail (Log Manager), etc, or clear the file every <b>X</b> hours and send them to
s3, etc.

## Running the app using node server (the normal way)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
#### If you are on windows use this command for migration:
```bash
npx typeorm migration:create ./src/common/db/migrations/[filename]
# Example: npx typeorm migration:create ./src/common/db/migrations/UpdatePost
```
#### Instead of :
```bash
npm run migration:create --FILE=[filename]
# Example: npm run migration:create --FILE=UpdatePost
```

### .env file
See the .env.example file and then create new .env file based on that file.
Make sure to set up .env variables in order to adjust to your environment.
If you plan to use local database (no docker) change TYPEORM_HOST=pgsql to TYPEORM_HOST=localhost in .env.

## Using Docker Compose

```sh
# Build the docker image
$ docker-compose build

# Start and login to the container
$ docker-compose up -d
$ docker-compose exec app sh
```
### Connect pgadmin container to psql image container
If you need to connect pgadmin to your psql then you will have to login to pgadmin ( read docker-compose.yml - pgadmin service ) and type the 'host' based on your .env variable TYPEORM_HOST

## Other useful Docker commands

```sh
# Get the container ID
$ docker ps

# View logs
$ docker logs <container id>

# Enter the container (In alpine, use sh because bash is not installed by default)
$ docker exec -it <container id> /bin/sh

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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
