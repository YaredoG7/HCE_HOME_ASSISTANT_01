
// Importing the required modules
const  WebSocketServer = require('ws'); 
// mqqt implemented
const mqtt = require('mqtt')
const uuid = require('uuid').v4;

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })
// create mqqt connection
const client  = mqtt.connect('mqtt://192.168.0.52')

const Message = {
  HCE_GLOBAL     : "presence",
  HCE_LED_INFO   : "HCE_LED_STAT/#",
  HCE_LED_STAT   : "HCE_LED_STAT",
  HCE_NODE_BASE  : "NODE_01/#",
  HCE_LED_BASE   : "NODE_LIGHT/#",
  HCE_NODE_BASE_X: "NODE_01",
  HCE_LED_001    : "HCE_LED_001",
  HCE_LED_002    : "NODE_LIGHT002",
  HCE_LED_003    : "NODE_LIGHT003",
  HCE_LED_004    : "NODE_LIGHT004",
  HCE_LOCK_001   : "NODE_LOCK001",
  HCE_LOCK_002   : "NODE_LOCK002",
  HCE_LOCK_003   : "NODE_LOCK003",
  HCE_WTR_001    : "NODE_WTR001",
  HCE_WTR_002    : "NODE_WTR002",
  HCE_CAM_001    : "NODE_CAM001",
  HCE_CAM_002    : "NODE_CAM002"
}

client.on('connect', function () {
  // subscribe to global 
  client.subscribe(Message.HCE_GLOBAL, function (err) {
    if (!err) {client.publish(Message.HCE_GLOBAL, 'UTOPIA WS web client connected: '+new Date())}
    });
  client.subscribe(Message.HCE_LED_STAT, function (err) {
    if (!err) {client.publish(Message.HCE_LED_STAT, 'UTOPIA subscribed to LIGHTS: '+new Date())}
    });
})

client.on('message', function (topic, message) {
  message = String(message)
  if(topic == Message.HCE_GLOBAL) {
     wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
 }
  if(topic == Message.HCE_LED_STAT) {
     wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
    }
 // console.log(topic + "  AND HERE IS PAYLOAD " + message)
})

wss.on("connection", (ws) => {
//    ws.send("presence#CONNECTED");
    ws.on("message", (data) => {    
      let d = breakout_topic(String(data)); 
      client.publish(d.Topic, d.Action);
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
      console.log("the client has connected");
     // client.end();
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred");
       // client.end();
    }
 });

function breakout_topic(str) {
  if(str.indexOf("#") < 0 ) return str;
  let temp = str.split("#");
  return {Topic: temp[0], Action: temp[1]}
}