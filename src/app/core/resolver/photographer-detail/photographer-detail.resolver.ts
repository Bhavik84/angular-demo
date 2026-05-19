import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PhotographerDetails } from '../../../shared/interfaces/image';
import { constants } from '../../enums/constants';
import { ApiService } from '../../service/api/api.service';

export const photographerDetailResolver: ResolveFn<
  PhotographerDetails | null
> = (route) => {
  const api = inject(ApiService);

  const id = route.paramMap.get('id');
  const lang = route.paramMap.get('lang');
  if (!id) {
    return of(null); // Return null if slug is missing
  }
  return api.get(`${environment.PHOTOGRAPHER_DATA}/${id}?lang=${lang}${constants.API_PARAM}`).pipe(
    catchError((error) => {
      console.error('Error fetching article details:', error);
      return of(null); // Handle errors gracefully
    }),
  );
};
