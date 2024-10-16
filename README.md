For deploying the project in a virtual machine using **SSL**:
1. Clone the project. 
2. Checkout web-docker-deployment branch. 
3. Modify nginx/default.conf file with your domain in "server_name".
4. Install docker. 
5. Execute docker-compose up --build -d.
6. Execute npx prisma db push inside app container to create database.
7. Execute npx prisma db seed inside container to feed the users to users table.
8. Execute "certbot certonly --webroot --webroot-path=/var/www/certbot -d yourdomain.com -d www.yourdomain.com" in certbot container. 
9. Uncomment ssl_certificate's and replace with your domain.
10. Uncomment listen 443 ssl;
11. Comment listen 80; 
12. Execute docker-compose down && docker-compose up --build -d
