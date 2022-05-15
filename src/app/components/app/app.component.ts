import { Component } from '@angular/core';
import { ThemeService } from '../../services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  providers: [ ThemeService ]
})
export class AppComponent  {

  constructor(private themeService: ThemeService){
    themeService.loadSavedTheme();
  }
  

  // handle app level mqqt and ws here



}
