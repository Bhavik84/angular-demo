import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IActivityData } from '../../../shared/interfaces/activity';
import { ApiService } from '../../service/api/api.service';

export const activityDetailResolver: ResolveFn<IActivityData | null> = (route) => {
  const api = inject(ApiService);

  const id = route.paramMap.get('id');
  const lang = route.paramMap.get('lang');
  if (!id) {
    return of(null); // Return null if slug is missing
  }
  return api.get(`${environment.GET_ACTIVITY_DETAILS}/${id}?lang=${lang}&isValid=true`).pipe(
    catchError((error) => {
      console.error('Error fetching article details:', error);
      return of(null); // Handle errors gracefully
    }),
  );
};
