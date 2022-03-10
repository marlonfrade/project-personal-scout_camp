# Welcome to ScoutCamp Project

<img width="839" alt="image" src="https://user-images.githubusercontent.com/84466506/157689713-29e639f0-b8be-4ccf-b3b2-b8983a015bcf.png">
<img width="838" alt="image" src="https://user-images.githubusercontent.com/84466506/157690328-438e7192-2cb3-48c8-a3a7-fa2782cbe380.png">


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
