import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HceIotCoreService } from '../hce-iot-core.service';
import {Subscription} from "rxjs";
import { ObservableService } from '../../services/observable.service';
import { HceSocketService } from '../../services';
import { Topics } from '../core.model';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  messageFromServer: string;
  wsSubscription: Subscription;                                        
  status;          
  currentTime: Date;
  
  lineChartData: Array<any> = [[59, 60, 57, 75, 80, 87, 90], [3, 10, 5, 9, 15, 3, 12]];
  lineChartLabels: Array<any> = ['Solar', 'Electric', 'March', 'April', 'May', 'June', 'July'];
  lineChartColors = [{ backgroundColor: 'transparent', borderColor: '#01579B' }, 
                      { backgroundColor: 'transparent', borderColor: '#009688' },
                      { backgroundColor: 'transparent', borderColor: '#D50000' }]


  // update this for camera status
  pieChartData: Array<any> = [0, 0, 0, 0];

  pieChartLabels: Array<any> = ['Cameras', 'Lights', 'Locked', 'Running Pumps'];
  pieChart2Data: Array<any> = [[112,55]];
  pieChart2Labels: Array<any> = ['Active', 'Inactive'];
  pieChart2Colors: any[] = [{ backgroundColor: ['#00E676', '#B71C1C'] }];
  pichartColors: any[] = [{ backgroundColor: ['#01579B', '#CDDC39', '#B71C1C','#00C853'] }];

  bubbleChartColors: any[] = [{ backgroundColor: ['#EF5350', '#B71C1C', '#D32F2F'] }];
  /*** FOR power */
  public powerChartOptions = {
    responsive: true,
    scales: {

      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
        }
      }]
    },
  };

  /*** FOR INTRUSION */
  public bubbleChartOptions = {
    responsive: true,
    scales: {

      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
        }
      }]
    },
    title: {
      display: true,
      text: 'Intrusion detection'
    }
  };
  public bubbleChartType = 'bubble';
  public bubbleChartLegend = true;
  public bubbleChartData = [
    {
      data: [
        { x: 45, y: 75, r: 10 },
        { x: 25, y: 35, r: 10 },
        { x: 76, y: 22, r: 10 },
      ],
      label: 'Camera Triggered' +'some_data',
      borderColor: "#00C853",
      backgroundColor: 'rgba(0, 200, 83, 0.5)'
    },
    {
      data: [
        { x: 30, y: 50, r: 10 },
        { x: 65, y: 18, r: 10 },
      ],
      label: 'Lock Triggered',
      borderColor: "rgb(3, 155, 229)",
      backgroundColor: 'rgba(3, 155, 229, 0.5)'
    }
  ];

  
  private addItem = async (key, item) =>{
    let value = this.cookieService.get(key);
    let newVal = value ? JSON.parse(value) : [];
    console.log(newVal)
    var index = newVal.findIndex(x => x.id == item.id)
    if (index === -1) {
      newVal.push(item);
    }else {
      console.log("object already exists")
    }
  }


  constructor(private iotService: HceSocketService, private observableService: ObservableService, private cookieService: CookieService, private dialog: MatDialog) { 

  }
  ngOnInit(): void {
    this.iotService.deviceStatusChanged$.subscribe(data => {
      if(data === undefined) {return false}
      const updateChart = data.message;
      if(updateChart.indexOf('::')> 0) {
       let joined = updateChart.split('::');
       let v = joined[0].slice(-7);
       if(v.includes('LED')) {
         console.log(v);
       }
       if(v.includes('CAM')) {}
       if(v.includes('LOCK')) {}
       if(v.includes('PMP')) {}
      }
      let msg = updateChart.split('_');

      if(data.message)

      console.log('new data has been emitted------>', data)
    })
  }

  onRefresh(){
    this.loading = true;
    this.observableService.createObservableService()           
    .subscribe(data => {
      this.currentTime = data
    });   
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }  

  showSnap(): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'HCE_CAM_001', message: `url is here`, url: 'https://hahucomputers.com/img/HAHU_LOGO.png', isSnap: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  unlcokMain(): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'HCE_MAIN_LOCK', message: ``, unlockpin: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  
}
