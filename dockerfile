#Build the Frontend (dist folder)

#copy the dist folder content in Backend/public folder 

#Build the backend 

FROM node:20-alpine as frontend-builder 

COPY ./Frontend /app

WORKDIR /app 

RUN npm install 

RUN npm run build 

#Build the backend now 

FROM node:20-alpine

COPY ./Backend /app 

WORKDIR /app 

RUN npm install 

COPY --from=frontend-builder /app/dist /app/public

CMD ["node" , "server.js"]


