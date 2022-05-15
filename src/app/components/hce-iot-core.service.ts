import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpService } from '../services';
import { DeviceProfile } from './core.model';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';

@Injectable()
export class HceIotCoreService {

  constructor(private http: HttpService, private dialog: MatSnackBar) { }

  addCameraProfile(profile: DeviceProfile) {
    return this.http.post('/iot/new-device', {device: profile});
  }
  
  updateCameraProfile(profile: DeviceProfile) {
    return this.http.put('/iot/device/'+profile.device_id, {device: profile});
  }

  // addLightProfile(profile: DeviceProfile) {
  //   return this.http.post('/device/light', {light: profile});
  // }

  // addLockProfile(profile: DeviceProfile) {
  //   return this.http.post('/device/light', {lock: profile});
  // }

  getAllCameras() {
    return this.http.get('/iot/devices');
  }

  getCamera(id) {
    return this.http.get(`/iot/device/${id}`);
  }

  searchCams(ip) {
    return this.http.get(`/iot/device/search/${ip}`);
  }

  getAllCameraUser(ownerId) {
    return this.http.get(`/iot/device/owner/${ownerId}`);
  }

  getAllCameraStatus(camIp) {
    let formattedCameraIp = `http://${camIp}/status`

    return this.http.get(formattedCameraIp);
  }

  getCameraSnap(camIp) {
    let formattedCameraIp = `http://${camIp}/capture`
    return this.http.get(formattedCameraIp);
  }


  cameraConfig(ip, query) {
    let formattedCameraIp = `http://${ip}/control?${query}`
    return this.http.cam_get(formattedCameraIp);
  }

  startRecording(url) {
    return this.http.put(`/iot/device/cam_record`, {url: url});
  }

  stopRecording(ffmpegId) {
    return this.http.get(`/iot/kill_rec?&vid_id=${ffmpegId}`);
  }

  startMedia(vidId) {
    return this.http.get(`/iot/start_media?&vid_id=${vidId}`);
  }

  getVideoFiles(userId) {
    return this.http.get(`/iot/videos/${userId}`);
  }

  getLightStatus() {}

  updateLightStatus(ledId) {}

  getLockStatus() {}

  updateLockStatus(lockId) {}

  getUser(id: any){
      return this.http.get(`/admin/user/${id}`);
  }

  showAlert(message, alert_type): void {
    let dialogRef = this.dialog.openFromComponent(AlertDialogComponent, {
      data: { message: message, ...alert_type }, 
      duration: 3000
    });
  
  }

}
