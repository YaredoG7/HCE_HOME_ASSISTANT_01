import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/filter';
import { HceIotCoreService } from '../../components/hce-iot-core.service';
import {Subscription} from "rxjs";
import { ObservableService } from '../../services/observable.service';
import { HceSocketService } from '../../services';
import { Topics } from '../../components/core.model';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;

  sidenavMode: string;
  isSidenavOpen: boolean = true;
  navigationSubscription: ISubscription;


  loading: boolean = false;
  messageFromServer: string;
  wsSubscription: Subscription;                                        
  status;          
  currentTime: Date;
  
  constructor(private router: Router, private apiService: HceIotCoreService,private wsService: HceSocketService,private observableService: ObservableService) { }

  /**
  * Gets current side nav mode for page refresh, if any.
  * Sidenav mode is stored in localStorage for later use.
  */
  private wasSidenavOpen(): boolean {
    let savedState = localStorage.getItem("sidenavOpen");

    if (savedState) {
      return JSON.parse(savedState);
    }

    return true;
  }

  /**
  * Sets correct sidenav mode based on window size.
  */
  private setSidenavMode() {
    if (window.innerWidth < 768) {
      this.sidenavMode = 'over';
      this.isSidenavOpen = false;

      this.sidenav.close();
    }
    else {
      this.sidenavMode = 'side';
      this.isSidenavOpen = this.wasSidenavOpen();
      if (this.isSidenavOpen)
        this.sidenav.open();
    }
  }

  /**
  * Creates subscription to navigation change event.
  * Used to toggle side menu if one is in "over" mode.
  */
  private subscribeToRouteChangeEvent() {
    // Hide sidenav on route change if using 'over' mode
    this.navigationSubscription = this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        if (this.sidenav.mode === 'over')
          this.sidenav.close();
      });
  }

  /**
  * Handes window resilze.
  *
  * @param event Event args.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSidenavMode();
  }

  /**
  * Method executed on component initialization.
  */
  ngOnInit() {
    this.subscribeToRouteChangeEvent();
    this.setSidenavMode();
    // subsribe to some message
    // this.apiService.showAlert('UTOPIA Home Assistant is ON!', {alert_info: true})
    this.wsSubscription = this.wsService.createObservableSocket()      
    .subscribe(_d => {
      const data = JSON.parse(_d)
      switch (data.topic) {
       case Topics.HCE_GLOBAL:
         this.wsService.deviceStatusChanged$.next(data)
         this.apiService.showAlert('SERVICES INFO: '+data.message , {toast_success: true})
         break;
       case Topics.LED_INFO:
         // assign data here 
         this.apiService.showAlert(data.message, {alert_info: true})
         break;
         case Topics.PMP_INFO:
          // assign data here 
          this.apiService.showAlert(data.message, {alert_info: true})
          break;
          case Topics.LOCK_INFO:
            // assign data here 
            this.apiService.showAlert(data.message, {alert_info: true})
            break;
         case Topics.CAM_INFO:
          // assign data here 
         this.apiService.showAlert(data.topic, {toast_info: true})
         break;
       default:
         break;
     }}, err => {
       this.apiService.showAlert("☠️ : Broker or Ws server disconnected.", {alert_warn: true})
     },
     () =>  this.apiService.showAlert('connection closed. WS service not unavailable ', {toast_warn: true})
   );
  }

  private showSysMessage(raw) {
    const topic = raw.topic;

    const msg = raw.message;
    let struct = topic.split('_');
    let txt = msg.indexOf('::') > 0 ? msg.split("::") : msg.split('_'); // expects messages to be in "HCE_LED_IS_ACTIVE, IS_XLON, IS_XLOFF ", 
    let deviceInfo = {type: struct[1], node: struct[2]}
    console.log(txt, 'and deviceinfo', deviceInfo)
  }

  // closeSocket(){
  //   this.wsSubscription.unsubscribe();   
  //   this.iotService.showAlert('connection closed. WS service not unavailable ', {toast_warn: true});                              
  //   this.status = 'The socket is closed';
  // }

  // ngOnDestroy() {
  //   this.closeSocket();
  // }

  // onRefresh(){
  //   this.loading = true;
  //   this.observableService.createObservableService()           
  //   .subscribe(data => {
  //     this.currentTime = data
  //   });   
  //   this.wsService.sendMessage("ping");
  //   console.log('sent ping to node...')
  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 2000);
  // }  

  /**
  * Method executed on component destroy.
  */
  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  /**
  * Toggles sidenav based on current sidenav settings.
  */
  toggleSidenav() {
    if (this.sidenavMode === 'side') {
      this.sidenav.toggle();
      this.isSidenavOpen = !this.isSidenavOpen;

      // Keep open state for desktops only
      localStorage.setItem("sidenavOpen", JSON.stringify(this.isSidenavOpen));
    }
    else {
      this.sidenav.open();
    }
  }
}
