const Device = require("mongoose").model("HCE_IOT_DEVICE");
const { exec, spawn } = require('child_process');
/** VIDEO OPERATIONS */
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises
const format = 'mp4';
const recordingFormat = 'h264'
const dir = 'hce-videos/';
const uuid = require('uuid').v4;
const async = require('async');
var runningCommands = {};
let stuff = {}

  exports.recordVideoStream =  (req, res) => {
    let streamUrl = req.body.url.src;
    let camName = req.body.url.name;
    let frmUrl = new String(streamUrl)
    let processId = uuid();
    let camdate = Date.now();
    let cmd = `ffmpeg -i ${frmUrl} -an -c:a copy -vf "drawtext=text='${camName} %{pts\\:gmtime\\:${Date.now()}\\: %a %b %d %c %Y}': x=10: y=10: fontsize=16: fontcolor=white@0.9: box=1: boxcolor=gray@0.2" -f segment -segment_time 500`;
    // if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
    runningCommands[processId]=  exec(new String(cmd) + ` hce-videos/HCE_VID_${camdate}_%d.mp4`, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
      console.log('Child Process STDOUT: ' + stdout);
      console.log('Child Process STDERR: ' + stderr);
    });
    res.send({ code: 200, message: "Recording has started", data:  {pid: runningCommands[processId]['pid'], processId} });
    return;
  }



  exports.stopRecording = async (req, res) => {
    let processId = req.query['vid_id'];
    if (!(processId in runningCommands)) {
      res.send({ code: 404, message: "No running command to delete", data: [] });
     }
     let pid = runningCommands[processId]['pid'];
    //  let remove = await exec(`kill -9 ${pid + 1} ${pid}`)
      res.send({ code: 200, message: "Process killed", data: process.kill(pid + 1, 'SIGINT') });     
  }


  
  const func = async filenames => {

    for(let fn of filenames) {
      let frmt = {}
      let data = await ffmpeg()
      .addInput(dir+fn)
      .ffprobe(function(err, metadata) {
        if(err) return {}
        frmt = metadata.format
      })

    console.log(frmt)
  }
}

exports.startMedia = (req, res) => {
  let videoId = req.query['vid_id'];
  let stream_id = uuid();
  // ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME  drawtext='fontfile=FreeSans.ttf:text=%{localtime\:%a %b %d %Y}'  
  // drawtext=text='${camName} %{pts\\:gmtime\\:${Date.now()}\\: %a %b %d %c %Y}': x=10: y=10: fontsize=18:fontcolor=white@0.9
  // ffmpeg -re -i hce-videos/HCE_VID_1651516993449_1.mp4 -c:v libx264 -preset veryfast -tune zerolatency -b 500K -f flv rtmp://localhost/live/STREAM_NAME
    let camdate = Date.now();
    let cmd =  `ffmpeg -re -stream_loop -1 -i ${dir+videoId} -c:v copy `;
     exec(new String(cmd) + ` -f flv rtmp://localhost/live/${stream_id}`, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
      console.log('Child Process STDOUT: ' + stdout);
      console.log('Child Process STDERR: ' + stderr);
    });
   res.send({ code: 200, message: "Recording has started", data: `rtmp://localhost/live/${stream_id}` });
     // res.sendFile(path.resolve(path.join(__dirname, `/${cutsId}/${filename}`)));

   return;

}


exports.palyVideo = (req, res) => {
  let videoId = req.query['vid_id'];
  const videoPath = path.join(__dirname, `hce-videos/${videoId}`);
  res.sendFile(path.resolve(videoPath));
  /****START ****************** */
  // const range = req.headers.range;
  //   if (!range) {
  //       res.status(400).send("Requires Range header");
  //   }

  //   const videoPath = path.join(__dirname, `/hce-videos/${videoId}`);
  //   const videoSize = fs.statSync(videoPath).size;

  //   const CHUNK_SIZE = 10 ** 6; // 1MB
  //   const start = Number(range.replace(/\D/g, ""));
  //   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  //   const contentLength = end - start + 1;
  //   const headers = {
  //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
  //     "Accept-Ranges": "bytes",
  //     "Content-Length": contentLength,
  //     "Content-Type": "video/mp4",
  // }
  // const videoStream = fs.createReadStream(videoPath, { start, end });
  // res.writeHead(206, headers);
  // videoStream.pipe(res);

/***********************END OF NODE STREAM PLAYER  ******************** */
}
  
  exports.getRecoededVideos = async (req, res) => {
    let userId = req.params.id;
    const all_videos = await fsPromises.readdir('app/IoT/hce-videos/');
    let dump = all_videos.filter(items => items.indexOf('HCE_VID_') >= 0);
    // let val = await  func(dump)
    // console.log('So process it well : ' + val);
    // setTimeout(() => {
    //   console.log('So process it well : ' + val);
    // }, 5000)
//     dump.forEach((file, index) => { ffmpeg()
//               .addInput(dir+file)
//               .ffprobe(function(err, metadata) {
//                 stuff[index] = metadata.format;})
//                 .on('error', function(err) {
//                   console.log('An error occurred: ' + err.message);
//                 })
//                 .on('end', function() {
//                   console.log('Processing finished !');
//                 })
//       })
//       dump.length == stuff.length ? console.log(stuff) : console.log(dump)
    res.send({code: 200, message: 'HCE video files', data: dump});
  }


exports.registerDevice = (req, res, next) => {
    let _main = req.body.device
    let new_device = new Device(_main);
    let possibleId = "HHID_" + (Math.random() * 1000).toFixed();
    Device.setHceId(possibleId, null, function (generatedId) {
        new_device.device_id = generatedId;
        new_device.save((err, data) => {
          if (err) {
            console.log(err)
            res.status(500).send({ code: 500, message: err.message });
            return;
          } else {
            // send password
            let sms = {
              // to: car.owner.phone,
            //  message: `Your car with plate # ${new_car.plate_num} has been signed up for Moged Car Rental Solutions, Welcome!`,
            };
  
            // MogedEMail(mail);
            res.send({code: 200, message: 'new camera obj', data: data});
            return;
          }
        });
      },
      (err) => {
        console.log(err)
        res.send({ code: 500, message: "unable to create device" });
      }
    );
  };

exports.listAll = (req, res) => {
    Device.find({},  (err, devices) => {
        if (err) {
            res.send({code: 500, message: 'unable to get active customers'})
            return
          }
          if (!devices) {
            res.json({
              code: 404,
              message: "No devices found "
            });
            return;
          }
          if(devices) {
            res.send({code: 200, message: 'user obj', data: devices})
            return;
          }
    }).select('-password -salt')
}


exports.getDevice = (req, res) => {
    let deviceId = req.params.id
    Device.findOne({device_id: deviceId}, (err, device) => {
        if (err) {
            res.send({code: 500, message: 'unable to get active customers'})
            return
          }

          if(device) {
            res.send({code: 200, message: 'user obj', data: device})
            return;
          }
    }).select('-password -salt')
}   

exports.getDeviceByOwner = (req, res) => {
    let ownerId = req.params.owner;
    Device.findOne({ owner: ownerId })
    .populate('owner')
    .exec(function(err, devices) {
            if (err) {
            res.send({ code: 500, message: "unable to owner devices" });
            return;
            }
            if (!devices) {
            res.json({
                code: 404,
                message: "No owner devices ",
            });
            return;
            }
            if (devices) {
            // console.log(cars)
            res.send({ code: 200, message: "owner devices", data: devices });
            return;
            }
    })
}

exports.updateDevice = (req, res) => {
    let data = req.body.device;
    console.log(data)
    let id = req.params.id;
    Device.updateOne({device_id: id}, data, (err, device) => {
      if (err) {
        res.status(500).send({ code: 500, message: err.message });
        return;
      } else {
           res
          .status(200)
          .send({
            code: 200,
            message: "device has been updated successfully",
            data: device
          });
        return;
      }
    })
  
  }

  exports.deleteDevice = (req, res ) => {
    let id = req.pramas.device_id;
    Device.findOneAndDelete({device_id: id}, (err, d) => {
      if (err) {
        res.status(500).send({ code: 500, message: err.message });
        return;
      } else {
        res
          .status(200)
          .send({
            code: 200,
            message: "device has been deleted successfully",
          });
        return;
      }
    })
  }
  

  // Search camera route

  exports.searchCamsLocal = async (req, res) => {
    const port = 81;
    let hostIp = req.params.id;
   await exec(`nmap -p81 ${hostIp} --open`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`exec error: ${error}`);
        res.status(500).send({ code: 500, message: error || stderr });
        return;
      }
      // console.error(`exec stdout: ${stdout}`);
      var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/; //http://www.regular-expressions.info/examples.html
      let strDump = stdout.split("\n");
      let st = strDump.map(item => item.match(r)).filter(item => item !== null);
      if (st.length > 0) {
        let default_cams = [];
        for (let [ip, index] of st) {
          let new_cam = {
            device_name: "HCE_IOT_CAM_00"+index,
            device_port: port,
            device_ip: ip,
            device_img_src: `http://${ip}/capture?_cb=1651398316998`,
            status: "Default",
            role: "Camera",}

          default_cams.push(new_cam);
        }
        res.send({ code: 200, message: "HCE-IoT Cams", data: default_cams });
        return;
      } else {
        res.send({ code: 404, message: "No cameras found", data: [] });
        return;
      }
    });
  }

