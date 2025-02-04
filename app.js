require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
app.get("/", (req, res) => {
    res.render("index")
})


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/artist-search", (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'      
            res.render("artist-search-results", { data: data.body.artists.items })
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res) => {

    const { id } = req.params

    spotifyApi
        .getArtistAlbums(id)

        .then(album => res.render("albums", { album: album.body.items }))
        .catch(err => console.error(err))
})

app.get("/tracks/:id", (req, res) => {

    const { id } = req.params
    //console.log('-----------------------------', id);

    spotifyApi
        .getAlbumTracks(id)
        .then(track => {
            //console.log(track.body.items)
            const tracks = track.body.items
            res.render("tracks", { tracks })
        })
        .catch(err => console.error(err))
})
















app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));



