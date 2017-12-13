

var Keys = require('./keys.js')
var Twitter = require('twitter')
var Spotify = require('node-spotify-api')
var request = require('request')
var fs = require('fs')

var client = new Twitter({
    consumer_key: Keys.twitterKeys.consumer_key,
    consumer_secret: Keys.twitterKeys.consumer_secret,
    access_token_key: Keys.twitterKeys.access_token_key,
    access_token_secret: Keys.twitterKeys.access_token_secret
})


var spotify = new Spotify({
    id: Keys.spotifyKeys.id,
    secret: Keys.spotifyKeys.secret
})

var commend = process.argv[2]
var nameOfSongOrMovie = process.argv[3]
var globalOrder

order(commend)

function order(commend) {
    switch (commend) {
        case "my-tweets":
        myTweet()
        break
        case "spotify-this-song":
        aboutSong()
        break
        case "movie-this":
        myMovie()
        break
        case "do-what-it-says":
        doWhatItSay()
        break
        default:
        break
    }
}




function myTweet() {
    client
    .get('/statuses/user_timeline.json', {count:5 ,creen_name: 'MoMo55555751' }, function(error, tweets, response){
        //console.log("We have requested and getting some data")
        if(error){
            console.log(error)
        } else {
            console.log(tweets[0].text)
            logging('my-tweets', 'nothing', tweets[0].text)
        }
    })
}


function aboutSong() {
    if(nameOfSongOrMovie){
        spotifyFunc(nameOfSongOrMovie)
        
    } else {
        spotifyFunc(globalOrder)
    }
}

function spotifyFunc(title){
    spotify
    .search({ type: 'track', query: title, limit:1 })
    .then(function(response) {
        var songLists = response.tracks.items
        //var songListsObj = []
        for(var i = 0; i < songLists.length; i++){
            var info = "Artist(s): " + songLists[i].album.artists[0].name +
            "\nName: " + songLists[i].name +
            "\nPreview URL: " + songLists[i].preview_url +
            "\nAlbum: " + songLists[i].album.name
            console.log(info)

            logging('spotify-this-song', title, info)
        }
        //console.log(songListsObj)
    })
    .catch(function(err) {
        console.log(err);
    })
}


function myMovie(){
    if(nameOfSongOrMovie){
        movieFunc(nameOfSongOrMovie)
        
    } else {
        movieFunc(globalOrder)
    }

    
}

function movieFunc(title) {
    var url = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece"
    
    request.get({
        method: "GET",
        url: url
    }, function(error, response, body){
        if(error){
            console.log(error)
        } else {
            if(body){
                var json = JSON.parse(body)
                var info = 
                "Title: " + json.Title +
                "\nYear: " + json.Year + 
                "\nIMDB Rating: " + json.imdbRating + 
                "\nRotten Tomatoes Rating: " + json.Ratings[1].Value +
                "\nCountry: " + json.Country + 
                "\nLanguage: " + json.Language +
                "\nPlot: " + json.Plot + 
                "\nActors: " + json.Actors
                console.log(info)
                logging('movie-this', title, info)

            } else {
                var substitute = "Mr.Nobody"
                url = "https://www.omdbapi.com/?t=" + substitute + "&y=&plot=short&apikey=40e9cece"

                request.get(url, function(error, response, body){
                    if(error){
                        console.log(error)
                    } else {
                        var json = JSON.parse(body)
                        var info = "Title: " + json.Title +
                        "\nYear: " + json.Year + 
                        "\nIMDB Rating: " + json.imdbRating + 
                        "\nRotten Tomatoes Rating: " + json.Ratings[1].Value +
                        "\nCountry: " + json.Country + 
                        "\nLanguage: " + json.Language +
                        "\nPlot: " + json.Plot + 
                        "\nActors: " + json.Actors
                        console.log(info)
                        logging('movie-this', substitute, info)

                    }
                })

            }
        }
        
    })

}

function doWhatItSay() {
    fs.readFile('random.txt', 'utf8', function(error, data){
        if(error){
            return console.log(error)
        } else {
            var dataArray = data.split(',')
            
            var commend = dataArray[0]
            var what = dataArray[1].substr(1,dataArray[1].length-2)
            console.log(commend)
            console.log(what)

            globalOrder = what
            order(commend)
        }
    })

}

function logging(commend, title, info) {
    fs.appendFile('log.txt', '\n\n\n' + commend + ', ' + title + '\n' + info, function(error){
        if(error){
            console.log(error)
        }
    })

}