# PureMatch Backend API

This is a mock backend api made for PureMatch challenge.

## Requirement3

## 1st Subtask

I added pagination to posts. Now users can request how many posts they wanna see per page, and which page they wanna see.

![alt text](https://i.ibb.co/jJW3qbb/pagination.png)

## 2nd Subtask

Users can add friends now. I created new route and controllers for adding friends. The logic works so that once you add someone as friend they will be in your friend list. You will also be in their friend list as well. In order to add a friend you need to send post request with body of the email of person that you wanna add. Post request returns the added friend.

![alt text](https://i.ibb.co/L1YGhYR/addfr.png)

![alt text](https://i.ibb.co/r6VTg9Y/friendb.png)

## 3rd Subtask

I added friendList endpoint that returns list of friends that user has. And each friend in list shows information about their name, email, posts and number of mutual friends.

![alt text](https://i.ibb.co/3mcyG76/friendlist.png)
