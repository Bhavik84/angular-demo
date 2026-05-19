import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICollectionData } from '../../../shared/interfaces/collection';
import { constants } from '../../enums/constants';
import { ApiService } from '../../service/api/api.service';

export const artworkDetailResolver: ResolveFn<ICollectionData | null> = (route) => {
  const api = inject(ApiService);

  const lang = route.paramMap.get('lang');
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null); // Return null if slug is missing
  }
  return api
    .get(`${environment.GET_COLLECTION_DETAIL}/${id}?lang=${lang}${constants.API_PARAM}`)
    .pipe(
      catchError((error) => {
        console.error('Error fetching article details:', error);
        return of(null); // Handle errors gracefully
      }),
    );
};
