# PureMatch Backend API

This is a mock backend api made for PureMatch challenge.

## Requirement2

## 1st Subtask

While doing the first requirement I have already added created at property.

## 2nd Subtask

I used moment library to generate time difference relative to post creation time.

## 3rd Subtask

Using multer library I changed my code so that up to 5 images can be uploaded. More than 5 images upload will result in error.
In the picture below you can see the created at field with moment library. Also in the request body you can see 2 files are attached(up to 5). Once they are uploaded to s3, the post is also created in database as well with photo link to s3 Objects.

![alt text](https://i.ibb.co/XZwsZDh/multiple.png)

![alt text](https://i.ibb.co/0V2dHVB/aws.png)

![alt text](https://i.ibb.co/FDR4mw0/dbold.png)

## 4th Subtask

Created new route, controller to update the post. Assuming that user is authenticated with jwt token that comes from cookies. As you can see, once user provides required values for update, they get updated on the database as well.

![alt text](https://i.ibb.co/4Z2F6dN/updatepost.png)

![alt text](https://i.ibb.co/26B6nH2/newdb.png)
