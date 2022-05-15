import { Component } from '@angular/core';
import { HceIotCoreService } from '../../hce-iot-core.service';
import { IVideoConfig } from "ngx-video-list-player";
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-alerts-layout',
  templateUrl: './alerts-layout.component.html',
  styleUrls: ['./component.css']
})
export class AlertsLayoutComponent {
  public videoFiles: any [] = [];
  showVideo: boolean = false;
  playbackUrl : string = "";

  config: IVideoConfig = {
    isVideoLoader: true,
    isAutoPlay: false,
    isFirstVideoAutoPlay: false,
    subtitleOffText: "",
    subtitleText: "",
    volumeCookieName: "NgxVideoListPlayerVolume",
    videoIndexCookieName: "NgxVideoListPlayerIndex",
    sources: []          
  };



  constructor(private apiService: HceIotCoreService) {
    this.apiService.getVideoFiles("12").subscribe(res => {  
      let d = res.data;
      this.videoFiles = d.map(items => {return {name: items, created: new Date(parseInt(items.split("_")[2]))}});
      console.log('videos: ' + this.videoFiles)
    })
    setTimeout(() => {
      this.videoFiles.forEach((items, index) => { 
        this.config.sources.push({ src : environment.playVidUrl+items.name, videoName: `Mom and Christi ${index + 1} - feat Chevro`, artist: items.created})
      })
    }, 5000)
  }


  
  onTimeUpdate() {
    console.log("Event: onTimeUpdate");
    // NodePlayer.load(()=>{ })
  }
  
  onCanPlay() {
    this.apiService.showAlert('video is play able', {toast_info: true})
    console.log("Event: onCanPlay")
  }
  
  onLoadedMetadata() {
    console.log("Event: onLoadedMetadata")
  }


  startMedia(fileName) {
    this.apiService.startMedia(fileName).subscribe(res => {
      console.log(res)
      if (res) {
        this.showVideo = true;
        this.playbackUrl = res.data
      }
    })
  }
  deleteVideo() {
    return this.apiService.showAlert('coming soon', {alert_info: true})
  }
 }
