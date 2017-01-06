
# Document Management System API

[![Build Status](https://travis-ci.org/andela-cnwankwo/document-management-system.svg?branch=develop)](https://travis-ci.org/andela-cnwankwo/document-management-system)  [![Test Coverage](https://codeclimate.com/github/andela-cnwankwo/document-management-system/badges/coverage.svg)](https://codeclimate.com/github/andela-cnwankwo/document-management-system/coverage)   [![Code Climate](https://codeclimate.com/github/andela-cnwankwo/document-management-system/badges/gpa.svg)](https://codeclimate.com/github/andela-cnwankwo/document-management-system)  


## Introduction

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. 
Each document specifies the date it was published.

## Technology

This application is built using NodeJS, Express and Postgres

## Features
This application has the following features:

### Users:
A user created can either be an admin or a regular user.
- A Regular User can: 
    - Create an account
    - Login
    - Create a document
    - Limit access to a document by specifying an access group `i.e. public, private or role`.
    - View public documents created by other users.
    - View documents created by his access group with access level set as `role`.
    - Edit his record.
    - Search a users public documents.
    - View `public` and `role` access level documents of other regular users.
    - Logout.
    - Delete his details.

- In addition to the general user functions, an admin user can:
    - View all users.
    - View all created documents.
    - Delete any user.
    - Update any user's record.
    - Create a new role.
    - View all created roles.
    - Search for any user.

### Documents:
Documents are created to have various properties.
They include:
- Published date
- Title
- Content
- Access (`private, public or role`)

### Roles:
Roles can also be created, the default roles are `admin` and `regular`

### Authentication:
Users are authentcated and validated using JSON web token (JWT).
By generating a token on registration and login, API endpoints and documents are protected from unauthorised access.
Requests to protected routes are validated using the generated token.

## Installation
- *Steps*:
    - Clone this repository by running the command on the terminal: `git clone https://github.com/andela-cnwankwo/document-management-system.git`
    - Navigate to the project folder and install the packages/modules using: `npm install`
    - Start the server by running: `npm start`
    - Use an API testing platform ( `e.g. Postman `) to test the endpoints ( `see Endpoints Section below` )

## Requirements
This application requires NodeJS, NPM package manager and PostgreSQL installed.

## Usage
Operations are carried out on the application by making API calls (`POST, GET, PUT, DELETE`) to the endpoints shown below.

### Endpoints:

<table> 
<tr>
<th> *Endpoint* </th> <th> *Method* </th> <th> *Action* </th> <th> * Payload Data * </th> <th> * Authorization * </th>
</tr>
<tr>
<td> `/users` </td> <td> `POST` </td> <td> create a new user </td> <td> `username, name: (e.g. name: { first, last }), email, password, roleId` </td> <td> `none` </td>
</tr>
<tr>
<td> `/users` </td> <td> `GET` </td> <td> show all registered users </td> <td> `none` </td> <td> `admin` </td>
</tr>
<tr>
<td> `/login` </td> <td> `GET` </td> <td> login a registered user </td> <td> `username and password as request parameters.` </td> <td> `none` </td>
</tr>
<tr>
<td> `/logout` </td> <td> `GET` </td> <td> logout a user </td> <td> `none` </td> <td> `none` </td>
</tr>
<tr>
<td> `/users/username` </td> <td> `GET` </td> <td> get a user </td> <td> `none` </td> <td> `all users` </td>
</tr>
<tr>
<td> `/users/username` </td> <td> `PUT` </td> <td> Update user record</td> <td> `new user data` </td> <td> `current user and admin` </td>
</tr>
<tr>
<td> `/users/username` </td> <td> `DELETE` </td> <td> Remove a user record</td> <td> `none` </td> <td> `admin` </td>
</tr>
</table>