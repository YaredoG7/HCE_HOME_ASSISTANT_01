const mongoose = require('mongoose');
const pass = process.env.MONGO_PASS || 'HahuBetty123%23';
const dbURI = `mongodb+srv://yaredyaregal:${pass}@cluster0-m0xp9.mongodb.net/moged?retryWrites=true&w=majority`;
// const dbURI = 'mongodb://localhost:27017/moged'
const readLine = require('readline');

const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {useNewUrlParser: true}), 100);
}

mongoose.connection.on('connected', () => {
    console.log('connected');
});

mongoose.connection.on('error', err => {
    console.log('error: ' + err);
    return connect();
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
  });
  
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.on ('SIGINT', () => {
      process.emit("SIGINT");
    });
}

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
      console.log(`Mongoose disconnected through ${msg}`);
      callback();
    });
  };
  
  process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
  process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
      process.exit(0);
    });
  });
  process.on('SIGTERM', () => {
    gracefulShutdown('MOGED app shutdown', () => {
      process.exit(0);
    });
  });
  
  connect();
  require('../../auth/model/user.model');
  require('../../app/admin/model/car.model');
  require('../../app/IoT/index.model');
  

