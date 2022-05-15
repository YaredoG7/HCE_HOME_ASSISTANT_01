import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceProfile } from '../../../core.model';
import { HceIotCoreService } from '../../../hce-iot-core.service';

export enum EditMode {
  Create = 0,
  Edit = 1
}


@Component({
  selector: 'app-create-edit-cam',
  templateUrl: './create-edit-cam.component.html',
  styleUrls: ['./create-edit-cam.component.css']
})
export class CreateEditCamComponent implements OnInit {

  public device: DeviceProfile = <DeviceProfile>{metadata: {resolution: '', vid_record: ''}};
  editMode: EditMode = EditMode.Create;
  constructor(private apiService: HceIotCoreService, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.editMode = EditMode.Edit;
        this.getCamera(id);
      }
      else{
        this.editMode = EditMode.Create;
        this.device = <DeviceProfile>{metadata: {resolution: '', vid_record: ''}}
      }
  });

  console.log('EditMode in Camera: ', EditMode[this.editMode], this.editMode);
  }
  

  private getCamera(id: any){
    this.apiService.getCamera(id).subscribe(data => {
      this.device = data.data
      if(!data.metadata) this.device.metadata = {resolution: '', vid_record: ''}
      console.log('EditMode in Camera: ', data.data);

    });
  }

  onSave(isValid) {
    if(!this.device.device_ip) {
      this.apiService.showAlert('Camera Ip Address is required', {alert_success: true});
      return;
    }

    if(this.editMode == 0) {
    this.device.role = "Camera"
    this.apiService.addCameraProfile(this.device).subscribe(res => {
      if (res.code == 200) { 
        this.apiService.showAlert('camera profile saved', {alert_success: true});
        setTimeout(() => {
          this.device = <DeviceProfile>{metadata: {resolution: '', vid_record: ''}}
        }, 3000)
      } else {
        this.apiService.showAlert('unable to save camera profile', {alert_warn: true});
      }
    })
    }


    if(this.editMode == 1) {
      this.apiService.updateCameraProfile(this.device).subscribe(res => {
        if (res.code == 200) { 
          this.apiService.showAlert('camera profile saved', {alert_success: true});
          setTimeout(() => {
            this.device = <DeviceProfile>{metadata: {resolution: '', vid_record: ''}}
          }, 3000)
        } else {
          this.apiService.showAlert('unable to save camera profile', {alert_warn: true});
        }
      })
    }

  }

}
