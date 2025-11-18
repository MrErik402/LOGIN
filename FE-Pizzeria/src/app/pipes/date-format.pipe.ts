import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: string = 'short', locale: string = 'hu-HU'): string {
    if (value === null || value === undefined) {
      return '';
    }

    let date: Date;
    
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case 'short':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'long':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        break;
      case 'date':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'dateLong':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        break;
      case 'time':
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'timeFull':
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        break;
      case 'datetime':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      default:
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
  }

}

