import { Pipe, PipeTransform } from '@angular/core';
import { constants } from '../../core/enums/constants';
import { filter } from '../interfaces/alabern-portal';

@Pipe({
  name: 'searchFilterData',
  standalone: true,
})
export class SearchFilterDataPipe implements PipeTransform {
  transform(
    items: filter[],
    filterBy?: string | null,
    sort: string = constants.SORT_BY.ASC,
  ): filter[] {
    if (!items || !filterBy) {
      return items;
    }
    const normalizedFilter = this.normalizeName(filterBy.toLowerCase());

    // Filter the items
    const filterData = items.filter((item) =>
      this.normalizeName(item.name.toLowerCase()).includes(normalizedFilter),
    );

    return sort === constants.SORT_BY.ASC
      ? this.sortAsendingData(filterData)
      : this.sortDesendingData(filterData);
  }

  normalizeName(name: string): string {
    const encodingFixMap: Record<string, string> = {
      Á: 'A',
      À: 'A',
      Â: 'A',
      Ä: 'A',
      Ã: 'A',
      Å: 'A',
      á: 'a',
      à: 'a',
      â: 'a',
      ä: 'a',
      ã: 'a',
      å: 'a',
      É: 'E',
      È: 'E',
      Ê: 'E',
      Ë: 'E',
      é: 'e',
      è: 'e',
      ê: 'e',
      ë: 'e',
      Í: 'I',
      Ì: 'I',
      Î: 'I',
      Ï: 'I',
      í: 'i',
      ì: 'i',
      î: 'i',
      ï: 'i',
      Ó: 'O',
      Ò: 'O',
      Ô: 'O',
      Ö: 'O',
      Õ: 'O',
      ó: 'o',
      ò: 'o',
      ô: 'o',
      ö: 'o',
      õ: 'o',
      Ú: 'U',
      Ù: 'U',
      Û: 'U',
      Ü: 'U',
      ú: 'u',
      ù: 'u',
      û: 'u',
      ü: 'u',
      Ñ: 'N',
      ñ: 'n',
      Ç: 'C',
      ç: 'c',
    };

    return name
      .split('')
      .map((char) => encodingFixMap[char] || char)
      .join('');
  }

  sortAsendingData(data: filter[]): filter[] {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortDesendingData(data: filter[]): filter[] {
    return data.sort((a, b) => {
      const startYearA = parseInt(String(a.id).split('-')[0]);
      const startYearB = parseInt(String(b.id).split('-')[0]);
      return startYearB - startYearA;
    });
  }
}
