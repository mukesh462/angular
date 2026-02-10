import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Table } from '../table/table';

@Component({
  selector: 'app-form-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Table],
  templateUrl: './form-page.html',
  styleUrl: './form-page.css',
})
export class FormPage implements OnInit {
  form = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(''),
  });

  student: Array<{ name: string | null; price: string | null }> = [];
  @Input() data: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {}
  addStudent() {
    this.student.push({
      name: this.form.controls.name.value,
      price: this.form.controls.price.value,
    });
    this.form.reset();
  }

  setData() {
    this.data.emit(this.student);
  }
}
