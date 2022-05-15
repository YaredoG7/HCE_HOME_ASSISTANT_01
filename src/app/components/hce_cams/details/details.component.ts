import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DeviceProfile } from '../../core.model';
import { HceIotCoreService } from '../../hce-iot-core.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  searching: boolean = false;
  searchedCameras: DeviceProfile [] =  [];
  loading: boolean = false;
  constructor(private apiService: HceIotCoreService, private router: Router) { }

  ngOnInit() {
  }

  onDelete() {}

  searchCamsLocal() {
    this.searching = true;
    this.apiService.searchCams(environment.hostIp).subscribe(res => {
      if(res.code == 500 ) {
        this.apiService.showAlert(res.message, {toast_danger: true });
        return;
      }
      if(res.code == 200) {
        this.searching = false;
        this.searchedCameras = res.data;
      } else if (res.code == 404) {
        this.apiService.showAlert("No near cameras found", {alert_warn: true });
        this.searching = false;

        setTimeout(() => {
          this.apiService.showAlert("Try again in 10s...", {alert_info: true });
        }, 3000);
        return;
      } 
    })
  }

  registerCamera(camera: DeviceProfile) {
    console.log("Register as new camera: --> ")
    camera.role = "Camera";
    // check if this ip is not in db
    this.apiService.addCameraProfile(camera).subscribe(res => {
      if(res.code == 200) {
        let id = res.data.device_id
        this.apiService.showAlert("Sucess camera saved", {alert_success: true });
        setTimeout(() => {
        this.router.navigate([`/cameras/edit/${id}`]);
        }, 2000)
      }
      console.log(res)
    })
  }



  removeCamera(index) {
    console.log("Remove Camera: --> ", index)
  }
}
