FROM node:12
WORKDIR /usr/clean-arch
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3333
CMD npm start