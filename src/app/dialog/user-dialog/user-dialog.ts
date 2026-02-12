import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import Dialog
import { MatSelectModule } from '@angular/material/select'; // Import Select
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ModalShellComponent } from '../modal-shell/modal-shell';

// 1. Update Interface to track task usage
interface StatusItem {
  name: string;
  color: string;
  taskCount?: number; // Optional mock property for Logic
}

interface StatusGroup {
  id: string;
  title: string;
  items: StatusItem[];
  isAdding: boolean;
  newStatusName: string;
  newStatusColor: string;
  tempEditName: string;
  tempEditColor: string;
}

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ModalShellComponent,
    MatIconModule,
    DragDropModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule, // Add Dialog Module
    MatSelectModule, // Add Select Module
    FormsModule,
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.css',
})
export class UserProfileDialogComponent {
  // Access the templates in HTML
  @ViewChild('deleteConfirmTemplate') deleteConfirmTemplate!: TemplateRef<any>;
  @ViewChild('reassignDeleteTemplate') reassignDeleteTemplate!: TemplateRef<any>;

  colorOptions = [
    'bg-yellow-600',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-purple-600',
    'bg-green-500',
  ];
  showMobileMenu = false;
  selectedType: 'default' | 'custom' = 'custom';

  activeEditingGroup: StatusGroup | null = null;
  activeEditingIndex: number = -1;

  // Variables for Deletion Logic
  targetDeleteItem: StatusItem | null = null;
  reassignTargetStatus: StatusItem | null = null; // Selected value in dropdown

  defaultGroups = [
    { title: 'New', count: 1, items: [{ name: 'New', color: 'bg-yellow-600' }] },
    {
      title: 'Active',
      count: 2,
      items: [
        { name: 'In-Progress', color: 'bg-teal-500' },
        { name: 'Review', color: 'bg-orange-500' },
      ],
    },
    { title: 'Completed', count: 1, items: [{ name: 'Completed', color: 'bg-green-500' }] },
  ];

  // Updated Data with MOCK taskCounts
  customGroups: StatusGroup[] = [
    {
      id: 'new',
      title: 'New',
      items: [{ name: 'New', color: 'bg-yellow-600', taskCount: 0 }], // 0 Tasks (Safe delete)
      isAdding: false,
      newStatusName: '',
      newStatusColor: 'bg-yellow-600',
      tempEditName: '',
      tempEditColor: '',
    },
    {
      id: 'active',
      title: 'Active',
      items: [
        { name: 'In-Progress', color: 'bg-teal-500', taskCount: 12 }, // 12 Tasks (Needs reassign)
        { name: 'Review', color: 'bg-orange-500', taskCount: 5 },
      ],
      isAdding: false,
      newStatusName: '',
      newStatusColor: 'bg-teal-500',
      tempEditName: '',
      tempEditColor: '',
    },
    {
      id: 'completed',
      title: 'Completed',
      items: [{ name: 'Completed', color: 'bg-green-500', taskCount: 20 }],
      isAdding: false,
      newStatusName: '',
      newStatusColor: 'bg-green-500',
      tempEditName: '',
      tempEditColor: '',
    },
  ];

  templateList = ['Scrum', 'Support', 'Issue Tracker'];
  activeTemplate = 'New Template 1';

  constructor(private dialog: MatDialog) {}

  drop(event: CdkDragDrop<StatusItem[]>) {
    if (this.selectedType === 'default') return;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  // --- ADD NEW STATUS ---
  toggleAdd(group: StatusGroup) {
    group.isAdding = true;
    group.newStatusName = '';
    group.newStatusColor = this.colorOptions[0];
  }

  cancelAdd(group: StatusGroup) {
    group.isAdding = false;
  }

  saveNewStatus(group: StatusGroup) {
    if (group.newStatusName.trim()) {
      group.items.push({ name: group.newStatusName, color: group.newStatusColor, taskCount: 0 });
      group.isAdding = false;
    }
  }

  // --- EDIT STATUS ---
  prepareEdit(group: StatusGroup, index: number, item: StatusItem) {
    this.activeEditingGroup = group;
    this.activeEditingIndex = index;
    group.tempEditName = item.name;
    group.tempEditColor = item.color;
  }

  saveEdit() {
    if (this.activeEditingGroup && this.activeEditingIndex > -1) {
      const group = this.activeEditingGroup;
      if (group.tempEditName.trim()) {
        const originalCount = group.items[this.activeEditingIndex].taskCount; // Preserve count
        group.items[this.activeEditingIndex] = {
          name: group.tempEditName,
          color: group.tempEditColor,
          taskCount: originalCount,
        };
      }
      this.activeEditingGroup = null;
      this.activeEditingIndex = -1;
    }
  }

  // --- NEW DELETION LOGIC ---

  // 1. Called when clicking "Delete" icon in the menu
  onDeleteRequest() {
    if (!this.activeEditingGroup || this.activeEditingIndex === -1) return;

    const itemToDelete = this.activeEditingGroup.items[this.activeEditingIndex];
    this.targetDeleteItem = itemToDelete;
    this.reassignTargetStatus = null; // Reset selection

    if (itemToDelete.taskCount && itemToDelete.taskCount > 0) {
      // Scenario 1: Status in Use -> Open Reassign Modal
      this.dialog.open(this.reassignDeleteTemplate, { width: '500px', disableClose: true });
    } else {
      // Scenario 2: Not in Use -> Open Simple Confirm Modal
      this.dialog.open(this.deleteConfirmTemplate, { width: '400px', disableClose: true });
    }
  }

  // 2. Perform the actual delete
  performDelete() {
    if (this.activeEditingGroup && this.activeEditingIndex > -1) {
      this.activeEditingGroup.items.splice(this.activeEditingIndex, 1);

      // Cleanup
      this.activeEditingGroup = null;
      this.activeEditingIndex = -1;
      this.targetDeleteItem = null;
      this.dialog.closeAll();
    }
  }

  // 3. Helper to get all OTHER statuses for the dropdown
  getAvailableStatuses(): StatusItem[] {
    const allStatuses: StatusItem[] = [];
    this.customGroups.forEach((group) => {
      group.items.forEach((item) => {
        // Exclude the item we are currently deleting
        if (item !== this.targetDeleteItem) {
          allStatuses.push(item);
        }
      });
    });
    return allStatuses;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectColor(group: StatusGroup, color: string, isEditMode: boolean = false) {
    if (isEditMode) {
      group.tempEditColor = color;
    } else {
      group.newStatusColor = color;
    }
  }

  setType(type: 'default' | 'custom') {
    this.selectedType = type;
  }
  saveTemplate() {
    console.log('Template Saved', this.customGroups);
  }
  createProject() {
    console.log('Project Created');
  }
}
