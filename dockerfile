FROM node:14

WORKDIR /myfolder/
COPY ./package.json /myfolder/
# COPY ./yarn.lock /myfolder/
RUN npm install

COPY . /myfolder/

#RUN node index.js 
#여러번 
CMD npm run start:dev
#한번 입력 