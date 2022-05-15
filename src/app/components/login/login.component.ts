import { Component } from '@angular/core';
import { MatSnackBar,MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition, } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from '../../services';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent{
  public _u = { email: '', password: '' };

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  
  constructor(private dialog: MatSnackBar,private router: Router, private apiService: HttpService) {}
  ngOnInit(): void {
  }
  loginUser(valid) {
    if(!valid) {
      // test toaster 
      this.showAlert("No credentials provided", {toast_danger: true});
      return false;
    }
    this.apiService.post('/auth/login', this._u).subscribe(res => {
      if (res.code == 200) {
        // save user detail
        localStorage.setItem('HCE_IOT_USER', JSON.stringify(res.data));
        // time track
        localStorage.setItem('HCE_TR', Date.now().toString()) 
        // save auth token
        localStorage.setItem('X_HCE_IOT', res.token);
        // this.spinner.hide(); Üdvözöljük, 
        
        this.showAlert("Willkommen, እንኳን ደህና መጡ", {alert_success: true});
        this.router.navigate(["/home"]);
      }
    },
    err => {
      // this.spinner.hide();
      this.router.navigate(["/login"]);
    }
    )
  }


  showAlert(message, alert_type): void {
    let dialogRef = this.dialog.openFromComponent(AlertDialogComponent, {
      data: { message: message, ...alert_type }, 
      duration: 3000
    });
  
  }
 }
