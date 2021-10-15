#!/bin/bash

docker run -d\
    --name tscd-mysql\
    --network tscd\
    -e MYSQL_ROOT_PASSWORD="user42"\
   -v $PWD/volume/mysql:/var/lib/mysql\
    -p 3306:3306\
    mysql:8.0.26
