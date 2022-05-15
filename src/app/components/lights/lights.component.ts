import { Component, OnInit } from '@angular/core';
import { HceSocketService } from '../../services';
import {Subscription} from "rxjs";
import { environment } from '../../../environments/environment';
import { HceIotCoreService } from '../hce-iot-core.service';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.css']
})
export class LightsComponent implements OnInit {

  private DEVICE_NODE = '/NODE_01';   // this basically reps the esp 
  public LIGHTS: any [] = [
    {title: "Living_Room * የሳሎን መብራት",    name: 'HCE_LED_001', class: 'example-card-1', status: false, mqqtStatus: false},
    {title: "Outdoor_Main * የውጭ መብራት",   name: 'HCE_LED_002', class: 'example-card-2', status: false, mqqtStatus: false},
    {title: "Bed_Room * የምኝታ መብራት",      name: 'HCE_LED_003', class: 'example-card-3', status: false, mqqtStatus: false},
    {title: "LED Strips * ረዥም መብራቶች",   name: 'HCE_LED_004', class: 'example-card-4', status: false, mqqtStatus: false, desc: 'ሀይል ቆጣቢ * power efficient (1-3 meter)'},
  ]
  centered = false;
  disabled = false;
  unbounded = false;

// ws ops

messageFromServer: string;
wsSubscription: Subscription;                                        
status;          



  radius: number;
  color: string;
  
  constructor(private wsService: HceSocketService, private iotService: HceIotCoreService,) { }

  ngOnInit() {}


  draginign() {
    console.log('drag end...')
  }


  // LED 1
  public loading: boolean = false;
  public led1_status: boolean = false;
  public LED_1_STAT_SERV : boolean = false;


  public TOGGLE_LED(name, id): void{
    this.LIGHTS[id].mqqtStatus = true;
    this.LIGHTS[id].status = !this.LIGHTS[id].status;
    let LED_ACTION = this.LIGHTS[id].status ? name+"#XLON": name+"#XLOFF" 
    this.wsService.sendMessage(LED_ACTION);
    setTimeout(() => {
      this.LIGHTS[id].mqqtStatus = false;
    }, 1000);
   // console.log('sending... '+ LED_ACTION)
  }


  // LED 2




  // LED 3



  // LED 4

}
