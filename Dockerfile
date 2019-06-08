FROM mhart/alpine-node:12
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm ci --prod

FROM mhart/alpine-node:slim-12
WORKDIR /home/node/app
COPY --from=0 /home/node/app .
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]