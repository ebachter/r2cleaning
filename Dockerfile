# FROM public.ecr.aws/docker/library/node:14-alpine
FROM public.ecr.aws/docker/library/node:18.12.1-alpine3.17
################################################################################

STOPSIGNAL SIGINT
WORKDIR /app
ENV \
  TZ=Europe/Berlin \
  WEB_PORT=80
EXPOSE 80
ENTRYPOINT ["pm.bash", "node", "service.js"]

# Install necessary tools for pm.bash
RUN apk add --no-cache bash inotify-tools
# Copy process manager
COPY bin/pm.bash /usr/local/bin/pm.bash

# Only copy files necessary to install the dependencies.
# We're doing this to make better use of the Docker build cache.
COPY package.json yarn.lock .yarnrc.yml lerna.json tsconfig.base.json tsconfig.json ./
COPY libraries libraries
COPY services services

# Copy Yarn PnP directory so we can offline-install all dependencies
COPY .yarn .yarn
# Install dependencies
RUN yarn --immutable --immutable-cache

# We enter the service and start the build process
ARG TARGET_SERVICE=none
WORKDIR /app/services/${TARGET_SERVICE}
RUN echo ">>> ${PWD} <<< " && yarn build