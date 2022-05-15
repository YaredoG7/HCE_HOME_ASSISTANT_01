
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const IncomingForm = require('formidable').IncomingForm
const { createModel, createBucket } = require('mongoose-gridfs');
const User = require("mongoose").model("User");

module.exports = function(router) {
    router
    .post('/user_doc', uploadUserDocs)
    .post('/car_docs', uploadCarDocs)
    .get('/user_doc/:filename', getUserUpload)
    .get('/car_doc/:filename', getCarUpload)
    .post('/profile', uploadProfilePicture)
    .get('/profile/:id', getUserProfile)
         
}


function storeBlobToDB(file) {
  return new Promise((resolve, reject) => {
      // use default bucket
      // console.log(file)
      const Attachment = createModel();
      if(!file.path || file.path == 'undefined') return;
      // write file to gridfs
      const readStream = fs.createReadStream(file.path);
      const options = ({ filename: file.name, mode: 'w', contentType: file.type, metadata: { uploaded: file.uploadBy} });
      Attachment.write(options, readStream, (error, file) => {
          if(error) {
              console.log(`Error: ${error}`)
              reject(error);
          }
      console.log("Log: --> success. File has been written to db")
      resolve(file)
      });
  })
}


function uploadUserDocs(req, res) {
  var form = new IncomingForm();
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl)

  form.on('file', (field, file) => { 

    let imageId = `kyc_doc_${Date.now()}`;
    let splitName = file.name.split('.');
    let docId = imageId+'.'+splitName[1];

    file.name = docId
    file.title = field
    storeBlobToDB(file).then(result => {
      result.title = field;

      res.status(200).send({code: 200, message: url+`/${docId}`, data: result});
      return;
     }).catch(err => {
      res.send({code: 500, message: `Error: writing  file`});
      console.log(err);
      return false;
     })
  })
  form.parse(req);
}

function uploadCarDocs(req, res) {
  var form = new IncomingForm();
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl)

  form.on('file', (field, file) => { 

    let imageId = `vehicle_doc_${Date.now()}`;
    var oldpath = file.path;
    let splitName = file.name.split('.');
    let docId = imageId+'.'+splitName[1];
    file.name = docId
    file.title = field
    storeBlobToDB(file).then(result => {
      result.title = field;

      res.status(200).send({code: 200, message: url+`/${docId}`, data: result});
      return;
     }).catch(err => {
      res.send({code: 500, message: `Error: writing  file`});
      console.log(err);
      return false;
     })
  })
  form.parse(req);
}

function uploadProfilePicture(req, res) {
  var form = new IncomingForm();
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl)
  form.on('file', (field, file) => { 

    let splitName = file.name.split('.');
    file.title = field
    storeBlobToDB(file).then(result => {
      result.title = field;

      User.findOneAndUpdate({hce_id: splitName[0]}, {$set: {profImg: `${file.name}`}}, (err, user) => {
        if(err) {
          console.error(err)
          return;
          ;}
          
          res.send({code: 200, message: url+`/${user.profImg}`, data: file});
          return;
        })

     }).catch(err => {
      res.send({code: 500, message: `Error: writing  file`});
      console.log(err);
      return false;
     })

  });
  form.parse(req);
}

/**** GET FILES FROM GRID*** */
// Get files from mongodb 
function getUserProfile(req, res) {
  let imageFilename = req.params.id;
  const bucket = createBucket();
  bucket.readFile({filename: imageFilename}, function(err, file) {
    if (err) return res.status(400).send(err)
    if(!file) return res.status(404).send('no file found')
    res.set('Content-Disposition', 'attachment; filename="' + file.name + '"');
    res.status(200).send(file)
  })
}

function getUserUpload (req, res) {
    let filename = req.params.filename;
    const bucket = createBucket();
    bucket.readFile({filename: filename}, function(err, file) {
      if (err) return res.status(400).send(err)
      if(!file) return res.status(404).send('no file found')
      res.set('Content-Disposition', 'attachment; filename="' + file.name + '"');
      res.status(200).send(file)
    })
}

function getCarUpload (req, res) {
    let filename = req.params.filename;
    const bucket = createBucket();
    bucket.readFile({filename: filename}, function(err, file) {
      if (err) return res.status(400).send(err)
      if(!file) return res.status(404).send('no file found')
      res.set('Content-Disposition', 'attachment; filename="' + file.name + '"');
      res.status(200).send(file)
    })
}


function generateZip(userId) {
    var fs = require('fs');
    var archiver = require('archiver');
   
   // create a file to stream archive data to.
   var output = fs.createWriteStream(__dirname + `/${userId}.zip`);
   var archive = archiver('zip', {
     zlib: { level: 9 } // Sets the compression level.
   });
   



   // listen for all archive data to be written
   // 'close' event is fired only when a file descriptor is involved
   output.on('close', function() {
    //  console.log(archive.pointer() + ' total bytes');
     // console.log('archiver has been finalized and the output file descriptor has closed.');
   });
   
   // This event is fired when the data source is drained no matter what was the data source.
   // It is not part of this library but rather from the NodeJS Stream API.
   // @see: https://nodejs.org/api/stream.html#stream_event_end
   output.on('end', function() {
    // console.log('Data has been drained');
   });
   
   // good practice to catch warnings (ie stat failures and other non-blocking errors)
   archive.on('warning', function(err) {
     if (err.code === 'ENOENT') {
       // log warning
     } else {
       // throw error
       throw err;
     }
   });
   
   // good practice to catch this error explicitly
   archive.on('error', function(err) {
     throw err;
   });
   
   // pipe archive data to the file
   archive.pipe(output);
   
   // append a file from stream


   const dirpath = path.join(__dirname, '/docs')
   fs.readdir(dirpath, function(err, files) {
       const pdfile = files.filter(item =>  item.includes(userId));
       
       pdfile.forEach(item => {
         //  archive.append(fs.createReadStream(item), { name: item });
         archive.append(fs.createReadStream(dirpath+`/${item}`), { name: item });

       })

       archive.finalize();

       
   })
}