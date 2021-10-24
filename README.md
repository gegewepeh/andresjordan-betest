# andresjordan-betest

## Base URL

https://andresjordan-betest.herokuapp.com

## Available Endpoints

**POST** /admin/get-token </br>
*generate new token (1 hour expiry time) </br>
example body: </br>
```
{
    "name": "andres",
    "password": "secretadminpassword"
}
``` 
</br>

**ALL Endpoints below need an Authorization header** e.g. Authorization: Bearer xxxx
</br>
</br>

**GET** /users </br>
Get all users data </br>
*\*paging, sort and filter not implemented yet*

**GET** /users/identity-number/{identity number} </br>
Get all user by identity number </br>

**GET** /users/account-number/{account number} </br>
Get all user by account number </br>

**POST** /users </br>
Register a new user
```
{
  "userName": "user1",
  "accountNumber": 110001,
  "emailAddress": "user1@mail.com",
  "identityNumber": 1
}
or
{
  "userName": "user1",
  "accountNumber": [12345, 11020455],
  "emailAddress": "user1@mail.com",
  "identityNumber": 1
}
```
</br>
*account number can be a number or arrays
If you register the same user with the same data except different account number, it will add that new account number to the user instead
</br>
</br>

**PUT** /users/{identity-number} </br>
Edit user by their identity number
The body is the same as registering new user

**PATCH**
*\*not implemented yet*

**DELETE** /users/{identity-number} </br>
Delete user by their identity number