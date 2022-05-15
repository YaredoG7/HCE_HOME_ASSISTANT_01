import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-reset-pin',
  templateUrl: './reset-pin.component.html',
  styleUrls: ['./reset-pin.component.css']
})
export class ResetPinComponent {

  constructor(public dialogRef: MatDialogRef<ResetPinComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
}
