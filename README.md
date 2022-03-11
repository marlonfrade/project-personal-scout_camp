# Welcome to ScoutCamp Project

Access the Deployed Application:
```
https://thawing-stream-59628.herokuapp.com/
```


<img width="840" alt="image" src="https://user-images.githubusercontent.com/84466506/157891260-14b6a4db-574c-4398-b60b-fa7fb0cb8d18.png">
<img width="840" alt="image" src="https://user-images.githubusercontent.com/84466506/157891042-49bb7cc0-d893-44f1-bc58-237bb9b66aee.png">
<img width="840" alt="image" src="https://user-images.githubusercontent.com/84466506/157891134-fa58669b-70c7-46b6-ad4d-74a174d6e046.png">
<img width="840" alt="image" src="https://user-images.githubusercontent.com/84466506/157891378-0049fda0-0cf4-40fd-ac78-b770959d5a68.png">
<img width="839" alt="image" src="https://user-images.githubusercontent.com/84466506/157891547-79afa7ae-6681-47f9-a027-0b0ca01aada6.png">







ScoutCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Features

- Users can create, edit, and remove campgrounds
- Users can review campgrounds once, and edit or remove their review
- User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
<!-- - Search campground by name or location
- Sort campgrounds by highest rating, most reviewed, lowest price, or highest price -->

## Run it locally

1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/marlonfrade/ScoutCamp-Project.git
cd ScoutCamp-Project
npm install
```

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

```
CLOUDINARY_CLOUD_NAME = <cloud_name>
CLOUDINARY_KEY = <key>
CLOUDINARY_SECRET = <secret>

```

Run `mongod` in another terminal and `npm start` in the terminal with the project.

Then go to [localhost:3000](http://localhost:3000/).

To get google maps working check [this](https://github.com/nax3t/google-maps-api) out.
