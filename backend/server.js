const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const songChord = require("./data");
const rp = require("request-promise");
const cheerio = require("cheerio"); 
const API_PORT = 3001;
const app = express();
const router = express.Router();
require('express-async-await')(app)

// this is our MongoDB database
const dbRoute = "mongodb://FengyangZ:VivaLaVida1@ds035965.mlab.com:35965/ghelperdb";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));



function getPath(url){
  var _include_headers = function(body, response, resolveWithFullResponse) {
    return {'headers': response.headers, 'data': body};
  };
  var options = {
    method: 'GET',
    url: url,
    json: true,
    transform: _include_headers,
  }
  return rp(options)
  .then(function(response) {
    var result = getUrl(response.data);
    let url_list = [];
    result.forEach(e => {
      url_list.push(e.url);
    });
    return url_list;
  })
  .catch(function(err) {
    return err;
  });
}

function getUrl(data) {
  let list = [];
  const $ = cheerio.load(data);
  $(".topContent img")
    .each(async (i, e) => {
      let obj = {
        name: e.attribs.alt,
        url: e.attribs.src
      };
      list.push(obj);
    });
  return list;
}

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
    songChord.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getChordImage", async function(req, res){
  const {chord} = req.query;
  const url = "https://www.chordie.com/voicings.php?tuning=EADGBE&chord="+chord;
  return res.json(await getPath(url));
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new songChord();

  const { songName, singerName, mode, chords, genre} = req.body;

  data.songName = songName;
  data.singerName = singerName;
  data.mode = mode;
  data.chords = chords;
  data.genre = genre;
  
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  songChord.findOneAndUpdate({'_id': id}, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  songChord.findOneAndDelete({'_id': id}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));