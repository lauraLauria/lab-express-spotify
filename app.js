require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  // Render your home page template here
  res.render("home");
});

app.get("/artist-search", (req, res) => {
    const artistName = req.query.artistName;
  
    // Check if artistName is provided in the query
    if (!artistName) {
      return res.status(400).send('No artist name provided');
    }
  
    // Use the Spotify API to search for artists
    spotifyApi
      .searchArtists(artistName)
      .then((data) => {
        // Log the received data from the API
        console.log('The received data from the API: ', data.body);
        // Render the search results page or handle the search in a controller
        res.render("search-results", { artistName, artists: data.body.artists.items });
      })
      .catch((err) =>
        console.log('The error while searching artists occurred: ', err)
      );
  });
  

  spotifyApi
  .searchArtists(artistName)  // Use artistName instead of queryArtist
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
