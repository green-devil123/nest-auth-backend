FROM node:18.17.1
COPY . /
RUN rm -rf node_modules && rm -rf package-lock.json && npm install --force
#RUN npm install 
RUN npm -v 
EXPOSE 5000
RUN npm i -g rimraf
RUN npm install -g @nestjs/cli
RUN nest -v 
RUN npm run build
CMD ["npm","run","start:dev"]