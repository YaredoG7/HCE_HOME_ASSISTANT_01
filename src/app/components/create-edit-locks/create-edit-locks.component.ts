import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceProfile } from '../core.model';
import { HceIotCoreService } from '../hce-iot-core.service';

export enum EditMode {
  Create = 0,
  Edit = 1
}

@Component({
  selector: 'app-create-edit-locks',
  templateUrl: './create-edit-locks.component.html',
  styleUrls: ['./create-edit-locks.component.css']
})
export class CreateEditLocksComponent implements OnInit {

  editMode: EditMode = EditMode.Create;

  constructor(private route: ActivatedRoute, private apiService: HceIotCoreService) { }
  public device: DeviceProfile = <DeviceProfile>{metadata: {resolution: '', vid_record: ''}};
  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.editMode = EditMode.Edit;
       // this.getUser(id);
      }
      else{
        this.editMode = EditMode.Create;
       // this.user = new User();
         }   });
  }
  
  onSave(isValid) {
    if(!isValid) {
      this.apiService.showAlert('Lock profile not completed', {alert_warn: true});
      return;
    }
    console.log(this.device)
  }

}
