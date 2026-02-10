import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="shell-container">
      
      <div class="shell-header">
        <h2 class="text-xl font-bold m-0">{{ title }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="shell-content">
        <ng-content></ng-content>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .shell-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden; /* Strict no-scroll on the outer box */
    }

    .shell-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .shell-content {
      flex: 1;             /* Fill remaining space */
      overflow: hidden;    /* Hide overflow here so children scroll instead */
      display: flex;       /* ENABLE FLEXBOX FOR CHILDREN */
      flex-direction: column; 
      position: relative;  /* Anchor for absolute children if needed */
    }
  `]
})
export class ModalShellComponent implements OnInit {
  @Input() title: string = '';
  @Input() width: string = 'auto'; // Default
  @Input() height: string = 'auto';

  constructor(private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    // 3. Force the resize. 
    // IMPORTANT: This only works if you pass a real value (e.g. '800px') not 'auto'
    this.dialogRef.updateSize(this.width, this.height);
    this.dialogRef.updatePosition({ top: '5vh' }); // Optional: Adjust vertical position
  }

  close() {
    this.dialogRef.close();
  }
}