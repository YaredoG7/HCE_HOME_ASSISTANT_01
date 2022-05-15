import { Component, Inject, OnInit } from '@angular/core';
import {  MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent  {

  constructor(public dialogRef: MatSnackBarRef<AlertDialogComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) { 
  }

}
