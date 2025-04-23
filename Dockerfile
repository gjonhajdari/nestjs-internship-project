# Common build stage
FROM node:18.13.0 as common-build-starter

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install node-gyp && CXX=g++-12 npm install argon2@0.30.3 && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules app/
WORKDIR /app
ADD . /app

EXPOSE 3000

# Dvelopment build stage
FROM common-build-starter as development-build-starter

ENV NODE_ENV development

CMD ["npm", "run", "start:dev"]

# Production build stage
FROM common-build-starter as production-build-starter

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]
