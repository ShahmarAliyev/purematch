# PureMatch Backend API

This is a mock backend api made for PureMatch challenge.

## Requirement1

## 1st Subtask

As requested create a restful api with NodeJs and Express.
Connected to PostgresSQL database using Sequelize.
I chose ElephantSQL as database host in order to have faster development experience.

## 2nd Subtask

I created routes and controllers to have MVC model and organize my code in a better way.
I checked and validated required fields for registering users.
Also added bcrypt library to hash user password so plain passwords are not save in the database.
You can see results of registering users down below

![alt text](https://ibb.co/Kzt2Cn2)
![alt text](https://ibb.co/FByM4fh)

## 3rd Subtask

Added jsonwebtoken library to generate jwt tokens.
I added cookie-parser library so that users can save the jwt tokens and use it to authenticate themselves for other actions.
Reason I am returning jwt token in response is because of demonstration purposes.

![alt text](https://ibb.co/pWNTk68)

## 4th Subtask

To make sure only logged in users can create a post I added authentication middleware and checked the cookie headers send with request to see if the request is coming from an actual user in database.
For posts, I used multer middleware to be able to accept image files and save them to S3 Bucket.
After images are uploaded to s3 bucket with aws-sdk library , a post is created in database associated with the user and as a photo it gets the link of the uploaded image, then images get deleted. Of course images can be resized/compressed before storing them in s3 or they can be directly uploaded to s3.

![alt text](https://ibb.co/tbrLktm)
![alt text](https://ibb.co/41XJG4D)