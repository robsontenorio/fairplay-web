FROM node:8

LABEL maintainer="Robson Tenório <robsontenorio@me.com>"

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:

WORKDIR /var/www
# RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible


# RUN yarn build
# RUN rm -rf ./build

EXPOSE 3000
# CMD ["/bin/bash"]
