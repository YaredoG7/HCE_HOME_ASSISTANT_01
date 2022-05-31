import { Component, ViewChild } from '@angular/core';
import { DeviceProfile } from '../../core.model';
import { HceIotCoreService } from '../../hce-iot-core.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  devices: DeviceProfile [] = [];
  currentCams: any [] = [];
  currentRes: any [] = ['Full-HD', 'HD', 'SVGA', 'VGA'];
  feed_1_url: string = "";
  feed_2_url: string ="";
  cam1: string ="";
  cam1Name: string = "";
  cam2: DeviceProfile = <DeviceProfile>{};
  cam1Streaming: boolean = false;
  cam2Streaming: boolean = false;
  loading: boolean = false;  


  // startDate = Date.now() - (15 * 1000); // current time minus 15 seconds
  // duration = 60 * 1000; // 1 minute

  startDate = Date.now() - 10 * 60 * 60 * 1000; // current time minus 10 hours
  duration = 2 * 24 * 60 * 60 * 1000; // 2 days


  constructor(private apiService: HceIotCoreService) { 
    this.loadDevices()
  }

  private loadDevices(): void{
    this.apiService.getAllCameras().subscribe(data => {
      // filter by device type 
      this.devices = data.data.filter(items => items.role == 'Camera');
      // this.devices = data.data;
      this.currentCams = this.devices.map(item => { return { name : item.device_name, ip: item.device_ip}})
      // console.log("All device data loaded: --> ",data);
      // console.log("Cameras: -->", this.currentCams)
    });
  }

  onTimerComplete(): void {
    console.log('timer completed!');
  }

  public streamFeed1() {
    this.cam1Streaming = !this.cam1Streaming
    if(!(this.cam1.length > 10)) {
      this.cam1Streaming = false;
     return false;
    }

    this.feed_1_url = `http://${this.cam1}:81/stream`;
    return this.apiService.showAlert("Feed 1 streaming ", {toast_success: true});
  }

  stopFeed1() {
    this.cam1Streaming = !this.cam1Streaming;
    this.apiService.showAlert("Feed 1 stream stopped! ", {toast_info: true});
    return this.feed_1_url = this.formatSnapUrl(this.cam1);
  }

  public formatSnapUrl(ip): string {
    return `http://${ip}/capture?_cb=1651398316998`
  }

  adjustCamera(res, ip) {
    let val = 5;
    switch (res){
      case 'Full-HD':
        val = 9
        break;
      case 'HD':
        val = 8
        break;
      case 'SVGA':
        val = 7
        break;
      case 'VGA':
        val = 6
        break;
    }
    let query = `var=framesize&val=${val}`
    this.apiService.cameraConfig(ip, query).subscribe(res => {
      console.log(res)
    });
  }



  private cam_1_process: string = "0bc517e0-1db6-4f60-933c-d74febb2ba5d";
  public recording: boolean = false;
  private cam_1_pid : number = 0;

  startRecord() {
    let url =  {src: `http://${this.cam1}:81/stream`, name: this.cam1Name};
    this.apiService.startRecording(url).subscribe(res => {
      this.cam_1_process = res.data.processId;
      this.cam_1_pid = res.data.id
      if(res.code == 200) this.recording = true; this.feed_1_url = '../../../../assets/record.png'; return this.apiService.showAlert("Recording started...", {alert_info: true}); ;
    }, err => {
      this.apiService.showAlert("unable to record, server came back with error!", {alert_info: true})
      return;
    });
  }


  stopRecord() {
    this.apiService.stopRecording(this.cam_1_process).subscribe(res => {
      if(res.code==200) this.recording = false; return this.apiService.showAlert("Recording stopped, you can view the video in Files menu", {alert_info: true});
    }, err => {
      this.recording = true;
      this.apiService.showAlert("Recording not stopped", {alert_danger: true});
      console.log(err);
      return;
    });
  }
}
