docker run -d \
    --name tscd-phpmyadmin \
    --network  tscd\
    -e PMA_HOST=tscd-mysql \
    -p 8080:80 \
    phpmyadmin/phpmyadmin:5.1.1
