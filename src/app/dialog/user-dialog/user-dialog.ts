import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; 
import { 
  DragDropModule, 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem 
} from '@angular/cdk/drag-drop';
import { ModalShellComponent } from '../modal-shell/modal-shell';

// 1. Define Interfaces
interface StatusItem {
  name: string;
  color: string;
}

interface StatusGroup {
  id: string;
  title: string;
  items: StatusItem[];
  
  // ADDING STATE:
  isAdding: boolean;      
  newStatusName: string;  
  newStatusColor: string; 
  
  // EDITING STATE:
  editingIndex: number; // -1 means nothing is being edited
  editStatusName: string;
  editStatusColor: string;
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
    FormsModule,
  ], 
  templateUrl: './user-dialog.html',
  styleUrls: ['./user-dialog.css']
})
export class UserProfileDialogComponent {
  
  colorOptions = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-gray-500'];
  showMobileMenu = false;

  // 2. Main Data Structure with Edit State Initialized
  groups: StatusGroup[] = [
    {
      id: 'open',
      title: 'Open',
      items: [
        { name: 'OPEN', color: 'bg-blue-500' },
        { name: 'IN-PROGRESS', color: 'bg-yellow-500' }
      ],
      isAdding: false,
      newStatusName: '',
      newStatusColor: 'bg-gray-500',
      editingIndex: -1, // Default: No edit
      editStatusName: '',
      editStatusColor: ''
    },
    {
      id: 'closed',
      title: 'Closed',
      items: [
        { name: 'COMPLETED', color: 'bg-green-500' }
      ],
      isAdding: false,
      newStatusName: '',
      newStatusColor: 'bg-gray-500',
      editingIndex: -1,
      editStatusName: '',
      editStatusColor: ''
    },
     {
      id: 'custom',
      title: 'Custom',
      items: [
        { name: 'ON-HOLD', color: 'bg-red-500' }
      ],
      isAdding: false,
      newStatusName: '',
      newStatusColor: 'bg-gray-500',
      editingIndex: -1,
      editStatusName: '',
      editStatusColor: ''
    },
  ];

  templateList = ["Support", "Sales", "HR", "IT", "Marketing", "Finance", "Operations", "Legal", "R&D", "Admin", "Customer Service", "Product", "Design", "QA", "DevOps", "Security", "Data Science", "Analytics", "Business Intelligence", "Project Management", "Content", "Social Media", "Public Relations", "Event Planning", "Training", "Recruitment", "Employee Relations", "Compensation & Benefits", "Compliance", "Risk Management", "Facilities Management", "Procurement", "Supply Chain", "Logistics", "Inventory Management"];

  // 3. Drop Logic
  drop(event: CdkDragDrop<StatusItem[]>) {
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

  // --- ADD LOGIC ---
  toggleAdd(group: StatusGroup) {
    this.cancelEdit(group); // Close any active edits first
    group.isAdding = true;
    group.newStatusName = '';
    group.newStatusColor = 'bg-gray-500';
  }

  cancelAdd(group: StatusGroup) {
    group.isAdding = false;
  }

  saveNewStatus(group: StatusGroup) {
    if (group.newStatusName.trim()) {
      group.items.push({
        name: group.newStatusName,
        color: group.newStatusColor
      });
      group.isAdding = false;
    }
  }

  // --- EDIT LOGIC (New) ---
  
  // 1. Enter Edit Mode
  startEdit(group: StatusGroup, index: number, item: StatusItem) {
    // Close add form if open
    group.isAdding = false; 
    
    // Set edit state
    group.editingIndex = index;
    group.editStatusName = item.name;
    group.editStatusColor = item.color;
  }

  // 2. Cancel Edit Mode
  cancelEdit(group: StatusGroup) {
    group.editingIndex = -1;
    group.editStatusName = '';
    group.editStatusColor = '';
  }

  // 3. Save Changes
  saveEdit(group: StatusGroup) {
    if (group.editStatusName.trim() && group.editingIndex > -1) {
      // Update the item in the array
      group.items[group.editingIndex] = {
        name: group.editStatusName,
        color: group.editStatusColor
      };
      
      // Exit edit mode
      this.cancelEdit(group);
    }
  }

  // Helper for color picker
  selectColor(group: StatusGroup, color: string, isEditMode: boolean = false) {
    if (isEditMode) {
      group.editStatusColor = color;
    } else {
      group.newStatusColor = color;
    }
  }

  saveAll() {
    console.log('Final Structure:', this.groups);
  }
}