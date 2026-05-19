import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { CommonService } from '../../core/service/common/common.service';

@Injectable({
  providedIn: 'root',
})
export class CustomDateAdapter extends NativeDateAdapter {
  constructor(private common: CommonService) {
    super();
  }

  override format(date: Date, displayFormat: object | string): string {
    if (displayFormat === 'calendarHeader') {
      const longMonth = date.toLocaleString(this.common.activeLanguage, {
        month: 'long',
      });
      const year = date.getFullYear();
      return `${longMonth} ${year}`;
    } else if (displayFormat === 'inputFormat') {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } else {
      return date.toDateString();
    }
  }
}
