import { Component, OnInit } from '@angular/core';
import { DeviceProfile } from '../../core.model';
import { HceIotCoreService } from '../../hce-iot-core.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  devices: DeviceProfile [] = [];

  private allUsersChecked: boolean = false;
  
  constructor(private apiService: HceIotCoreService) { }


  ngOnInit() {
    this.loadDevices();
  }

  private loadDevices(): void{
    this.apiService.getAllCameras().subscribe(data => {
      // filter by device type 
      this.devices = data.data
      console.log(data)
    });
  }


  onRefresh(){ }

  checkAll() {
    this.allUsersChecked = !this.allUsersChecked;
    for (let i in this.devices) {
      this.devices[i].selected = this.allUsersChecked;
    }
  }
}
