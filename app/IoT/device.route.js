
const device = require('../IoT/index.controller');

module.exports = function(router) { 
    router.get('/devices', device.listAll)
          .get('/device/:id', device.getDevice)
          .get('/kill_rec', device.stopRecording)
          .get('/start_media', device.startMedia)
          .get('/video_stream', device.palyVideo)
          .get('/device/search/:id', device.searchCamsLocal)
          .get('/device//:id', device.getDeviceByOwner)
          .put('/device/cam_record', device.recordVideoStream)
          .put('/device/:id', device.updateDevice)
          .delete('/device/:id', device.deleteDevice)
          .get('/videos/:id', device.getRecoededVideos)
          .post('/new-device', device.registerDevice)
}