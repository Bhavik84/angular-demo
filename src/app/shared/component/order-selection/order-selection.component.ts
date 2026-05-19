import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { constants } from '../../../core/enums/constants';
interface order {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-order-selection',
  standalone: true,
  imports: [
    MatFormFieldModule,
    TranslateModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './order-selection.component.html',
  styleUrl: './order-selection.component.scss',
})
export class OrderSelectionComponent {
  options: order[] = [
    { value: '', viewValue: 'ORDER_SELECTION.LABLE_1' },
    { value: constants.SORT_BY.ASC, viewValue: 'ORDER_SELECTION.LABLE_2' },
    { value: constants.SORT_BY.DESC, viewValue: 'ORDER_SELECTION.LABLE_3' },
  ];
  @Input() activeType: string = '';
  @Output() selectionChange = new EventEmitter();

  constructor() {}

  changeOrder(event: string) {
    this.selectionChange.emit(event);
  }
}
