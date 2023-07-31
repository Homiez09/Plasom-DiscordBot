FROM node:18-alpine AS dependencies
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
RUN npm install -g nodemon ts-node typescript
RUN chown -R node /app
USER node
CMD ["npm", "start"]
