# PureMatch Backend API

This is a mock backend api made for PureMatch challenge.

## Requirement3

## 1st Subtask

I added pagination to posts. Now users can request how many posts they wanna see per page, and which page they wanna see. They do that by sending page size and page number on request query. Added extra checks if user enters page that do not exist or empty.

![alt text](https://i.imgur.com/AcgDJjI.png)

## 2nd Subtask

Users can add friends now. I created new route and controllers for adding friends. The logic works so that once you add someone as friend they will be in your friend list. You will also be in their friend list as well. In order to add a friend you need to send post request with body of the email of person that you wanna add. Post request returns the added friend.

![alt text](https://i.imgur.com/XfwO9MQ.png)

![alt text](https://i.imgur.com/J1EBgEb.png)

## 3rd Subtask

I added friendList endpoint that returns list of friends that user has. And each friend in list shows information about their name, email, posts and number of mutual friends. I found number of mutual friends using nested loops which might not be the most efficient way.

![alt text](https://i.imgur.com/GeESTqB.png)
