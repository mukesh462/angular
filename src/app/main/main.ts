import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDialogComponent } from '../dialog/user-dialog/user-dialog';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  name = 'Anto';
  // onChange(event: Event) {
  //   this.name = (event.target as HTMLInputElement).value;
  // }
  constructor(private dialog: MatDialog) {}
  @Output() titleValue: EventEmitter<string> = new EventEmitter(undefined);
  passValue(e: string) {
    this.titleValue.emit(this.name);
    console.log('');
  }
  openDialog() {
    this.dialog.open(UserProfileDialogComponent, {
      width: 'auto',
      maxWidth: '100vw',
      disableClose: true, // Force user to use the X button
      maxHeight: '95vh',
      autoFocus: false
    });
  }
}
