import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-locks',
  templateUrl: './locks.component.html',
  styleUrls: ['./locks.component.css']
})
export class LocksComponent implements OnInit {

  newPin: number;
  oldPin: number;
  LOCK_NAME: '';
  LOCK_NAME2: '';
  LOCK_NAME3: '';
  HCE_LOCK_001: boolean = false;
  HCE_LOCK_002: boolean = false;
  HCE_LOCK_003: boolean = false;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  RestePin(name): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Unlock '+name, message: ``, unlockpin: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
