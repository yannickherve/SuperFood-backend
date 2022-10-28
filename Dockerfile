FROM node:14.16-alpine

LABEL author="Yannick Dogne" description="Dockerfile superfood app"

WORKDIR /superfood-backend

COPY . /superfood-backend

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]



