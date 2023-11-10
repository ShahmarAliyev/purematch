# PureMatch Backend API

This is a mock backend api made for PureMatch challenge.

## Requirement1

## 1st Subtask

As requested I created a restful api with NodeJs and Express.
Connected to PostgresSQL database using Sequelize.
I chose ElephantSQL as database host in order to have faster development experience.

## 2nd Subtask

I created routes and controllers to have MVC model and organize my code in a better way. Server gets the requests, directs them to routers, and routers use controllers to handle the requests. I checked and validated required fields for registering users. Also added bcrypt library to hash user password so plain passwords are not saved in the database.
You can see results of registering users down below

![alt text](https://i.ibb.co/LhTx4Kx/register.png)

![alt text](https://i.ibb.co/VvzZYhL/register-db.png)

## 3rd Subtask

Added jsonwebtoken library to generate jwt tokens.
I added cookie-parser library so that users can save the jwt tokens in cookies and use it to authenticate themselves for other actions.
Reason I am returning jwt token in response is because of demonstration purposes. Also for further requests that requires authentication , I am assuming users send jwt token with cookie headers, and cookie name being 'jwt'.

![alt text](https://i.ibb.co/YDJSV4M/login.png)

## 4th Subtask

To make sure only logged in users can create a post I added authentication middleware and checked the cookie headers send with request to see if the request is coming from an actual user in database by verifying jwt token.
For posts, I used multer middleware to be able to accept image files on the server, and save them to S3 Bucket.
After images are uploaded to s3 bucket with aws-sdk library , a post is created in database associated with the user and as a photo field it gets the link of the uploaded image on s3, then images get deleted from server. Of course images can be resized/compressed before storing them in s3 or they can be directly uploaded to s3.

![alt text](https://i.ibb.co/gDK4Hpj/create-post.png)

![alt text](https://i.ibb.co/QDTXRYq/s3-object.png)
