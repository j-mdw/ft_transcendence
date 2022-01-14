FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
	git \
	nodejs

RUN mkdir /app

WORKDIR /app

COPY ./front

EXPOSE 80

CMD npm run dev
