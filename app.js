const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');
const cors = require('cors');
require('./config/db/db');
// bring in passport for auth
require('./auth/config/passport')(passport);
const socketCom = require('./app/IoT/socket.controller')
  /** Routes */
const authRoute = require('./auth/routes/auth.routes');
const adminRoute = require('./app/admin/routes/admin.routes');
const hceIotRoute = require('./app/IoT/index.route');
const upload = require('./app/upload/upload.routes')

const ffmpeg = require('fluent-ffmpeg');
let dir = 'app/IoT/hce-videos/';
let format = "mp4";

  /** SET API VERSION **/
  const apiVesion = '/api/v1/';


// init express app 
const app = express();


const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)
nms.run();

// videosInit();

app.use(logger('dev'));
app.use(express.json());
// Set up CORS
app.use(cors({origin: [
  "https://moged-bdr.azurewebsites.net",
  "http://localhost:3000" ,
  "http://localhost:4200" 
], credentials: true}));

// dev tool
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true 
}));

app.use(session({
  saveUninitialized: true, 
  resave: true, 
  secret: 'shh'
}));

app.use(passport.initialize());
app.use(passport.session());



// middleware

const isAuthenticated = function  (req, res, next) {
    let token = req.headers.authorization;
    let secret = process.env.JWT_SECRET || 'secret';
    let url = req.originalUrl;
    if (token) {
      // console.log(jwt.verify(token, secret).role)
      // if(jwt.verify(token, secret).role === '') {
        next();
      // }
     // console.log(url);
    } else {
    //  console.log(url);
      res.status(500).send({code: 500, message: 'Not Authenticated'})
      return;
    }
  }


app.use(apiVesion +'auth', authRoute);
app.use(apiVesion +'admin', isAuthenticated, adminRoute);
app.use(apiVesion +'iot',  hceIotRoute);
app.use(apiVesion +'upload',  upload);


const PORT = process.env.port || 3000;
const SC_PORT = process.env.SC_PORT || 3030;



// build pipeline for ng build and mv to the public folder 
app.use(express.static(__dirname + '/public/moged', {redirect: false}));
app.get('/', function (req, res) {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  res.sendFile(__dirname + '/public/moged/index.html');
});

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/public/moged/index.html');
});

app.listen(PORT, () => {
   console.log(`server started on ${PORT}`)
});

// ffmpeg.getAvailableFilters(function(err, filters) {
//   console.log("Available filters:");
//   console.dir(filters);
// });

function videosInit() {
  let rVideoFileDir = `${dir}FRMTD_`
   fs.readdir(dir, (err, files) => {
    files.forEach((file, index) => {
      // console.log(file);
      // re-encode  -f h264 -i test.h264 -c:v copy test.mp4
      if(index > 12 ) { 
        // file limit that is transcoded at the start is above limit 
         return false
        }
      ffmpeg()
      .addInput(dir+file)
      .outputOptions(['-c:v libx264', '-preset slow', '-crf 17', '-c:a aac', '-b:a 160k', '-vf format=yuv420p'])
      .on('start', function(cmd) {
        console.log('ffmpeg re-encoding to mp4 with command: ', cmd)
      })
      .on('error', function(err) {
        console.log('ffmpeg re-encoding to mp4 with command: ', err.message)
        // res.status(500).send({ code: 500, message: err.message });
        return false;
      })
      .on('end', function() {
        // let tempFile = fs.stat(file)
        console.log('ffmpeg re-encoding finished: ');
      }).save(rVideoFileDir+file)
    });
  });
}