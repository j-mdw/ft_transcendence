FROM ubuntu:18.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y vim wget nginx

RUN apt-get install -y mysql-server-5.7 mysql-client-5.7

RUN	apt-get install -y nginx php-fpm php-json php-mbstring php-mysqli php-phar curl

WORKDIR /var/www

RUN	wget https://files.phpmyadmin.net/phpMyAdmin/5.1.1/phpMyAdmin-5.1.1-all-languages.tar.gz

RUN	tar -xf phpMyAdmin-5.1.1-all-languages.tar.gz && \
	rm phpMyAdmin-5.1.1-all-languages.tar.gz && \
	mv phpMyAdmin-5.1.1-all-languages phpmyadmin

COPY conf/nginx.conf /etc/nginx/sites-available

RUN	mv /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-available/default

WORKDIR /

RUN sed -i "s/127.0.0.1/0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf

RUN mkdir /var/run/mysqld

RUN chown -R mysql:mysql /var/lib/mysql /var/run/mysqld && \
	service mysql start; \
	mysql -u root -e "CREATE DATABASE trenscandance;"; \
	mysql -u root -e "GRANT ALL PRIVILEGES ON trenscandance.* TO 'user'@'%' IDENTIFIED BY 'password';"; \
	mysql -u root -e "FLUSH PRIVILEGES;";


# RUN mkdir /app

# EXPOSE 3000 5000

