# CurryCompare API Specification
**v0.1.0**

## Base URL
The base URL for the CurryCompare API is `https://www.currycompare.com/api`

## Endpoints

### Submit a curry review
 - **Endpoint:** `/review`
 - **Method:** `POST`
 - **Roles:** `CONSUMER`
 - **Description:** Allows users to submit a review for a curry.
 - **Request Body:**
   - **`curryHouseId`** (String): The uuid of the curry house.
   - **`rating`** (Number): The overall rating of the review, out of 10, and up to 1 decimal place.
   - `comment` (String): User-written text as part of the review.
   - `chillies` (Number): Integer between 0 and 4 representing the heat of the curry.
   - `size` (String): `'SMALL' | 'MEDIUM' | 'LARGE'`
   - `taste` (Number): Integer between 1 and 5 representing the taste rating of the curry.
   - `value` (Number): Integer between 1 and 5 representing the value for money of the curry.
 - **Response:** `201 Created` with review details.

### Update a curry review
 - **Endpoint:** `/review/{reviewId}`
 - **Method:** `PUT`
 - **Roles:** `CONSUMER`
 - **Description:** Update a curry review
 - **Request Body:**
   - **`rating`** (Number): The rating of the updated review.
   - `comment` (String): User-written text as part of the user-written review.
   - `chillies` (Number): Integer between 0 and 4 representing the heat of the curry.
   - `size` (String): `'SMALL' | 'MEDIUM' | 'LARGE'`
   - `taste` (Number): Integer between 1 and 5 representing the taste rating of the curry.
   - `value` (Number): Integer between 1 and 5 representing the value for money of the curry.
 - **Response:** `200 OK` with review details.
  
### Delete a curry review
 - **Endpoint:** `/review/{reviewId}`
 - **Method:** `DELETE`
 - **Roles:** `CONSUMER | GLOBAL_ADMIN`
 - **Description:** Deletes a curry review.
 - **Response:** `204 No Content`

### See a user's curry reviews
 - **Endpoint:** `/user/{userId}/reviews`
 - **Method:** `GET`
 - **Roles:** `GUEST | CONSUMER`
 - **Description:** See a user's curry reviews.
 - **Response:** `200 OK`, with an array of curry reviews with the following structure:
   - **`curryHouseId`** (String): The uuid of the curry house.
   - **`rating`** (Number): The overall rating of the review, out of 10, and up to 1 decimal place.
   - `comment` (String): User-written text as part of the review.
   - `chillies` (Number): Integer between 0 and 4 representing the heat of the curry.
   - `size` (String): `'SMALL' | 'MEDIUM' | 'LARGE'`
   - `taste` (Number): Integer between 1 and 5 representing the taste rating of the curry.
   - `value` (Number): Integer between 1 and 5 representing the value for money of the curry.

### Search for curry houses
 - **Endpoint:** `/curryhouses`
 - **Method:** `GET`
 - **Roles:** `GUEST | CONSUMER`
 - **Description:** Get a list of curries within a circular area.
 - **Query Parameters:**
   - **`lng`** (Number): The longitude of the centre of the search area.
   - **`lat`** (Number): The latitude of the centre of the search area.
   - **`rad`** (Number): The radius of the search area.
   - `curry_id` (Number): A curry id for if the user wants to filter by a certain curry.
   - `takeaway` (Boolean): A flag which indicates whether the user is searching for a takeaway.
   - `byob` (Boolean): A flag which indicates whether the user is searching for a byob curry house.
   - `free_poppadoms` (Boolean): A flag which indicates whether the user is searching for a curry house with free poppadoms.
 - **Response:** `200 OK`, with an array of curry houses in the following structure:
    - **`curryHouseId`** (String): The id of the curry house. 
    - **`title`** (String): The name of the curry house.
    - **`rating`** (Number): The average rating of the curry house.
    - **`lat`** (Number): The latitude of the curry house.
    - **`lng`** (Number): The longitude of the curry house.

### Create a curry house application
 - **Endpoint:** `/curryhouse/application`
 - **Method:** `POST`
 - **Roles:** `ADMIN`
 - **Description:** Submit a curry house application - a precursor to getting a curry house listed on curry compare.
 - **Request Body:**
   - **`title`** (String): The name of the curry house.
   - **`phoneNumber`** (String): The phone number consumers can use to contact the curry house.
   - **`lat`** (Number): The latitude of the curry house.
   - **`lng`** (Number): The longitude of the curry house.
   - **`contactEmail`** (String): The email that will be used for correspondance between CurryCompare and the curry house.
   - `websiteUrl` (String): The URL users can use to access your website.
   - `description` (String): A description of the curry house.
 - **Response:** `204 No Content`

### Review a curry house application
 - **Endpoint:** `/curryhouse/application/{applicationId}`
 - **Method:** `PATCH`
 - **Roles:** `GLOBAL_ADMIN`
 - **Description:** Submit a verdict on the curry house application.
 - **Request Body:**
   - **`approved`** (Boolean): Whether or not the application has been approved.
 - **Response:** `204 No Content`

### Get a single curry house's details
 - **Endpoint:** `/curryhouse/{curryHouseId}`
 - **Method:** `GET`
 - **Roles:** `*`
 - **Description:** Retrieves the details of the curry house that has the supplied `curryHouseId`.
 - **Response:** `200 OK` with the curry house's details:
   - **`title`** (String): The name of the curry house.
   - **`rating`** (String): The average rating of the curry house.
   - **`phoneNumber`** (String): The phone number consumers can use to contact the curry house.
   - **`lat`** (Number): The latitude of the curry house.
   - **`lng`** (Number): The longitude of the curry house.
   - `websiteUrl` (String): The URL users can use to access your website.
   - `description`(String): A description of the curry house.

### Update a curry house's details
 - **Endpoint:** `/curryhouse/{curryHouseId}`
 - **Method:** `PUT`
 - **Roles:** `ADMIN`
 - **Description:** Updates the details of the curry house
 - **Response:** `200 OK` with the curry house details:
   - **`title`** (String): The name of the curry house.
   - **`phoneNumber`** (String): The phone number consumers can use to contact the curry house.
   - **`lat`** (Number): The latitude of the curry house.
   - **`lng`** (Number): The longitude of the curry house.
   - **`contactEmail`** (String): The email that will be used for correspondance between CurryCompare and the curry house.
   - `websiteUrl` (String): The URL users can use to access your website.
   - `description` (String): A description of the curry house.







