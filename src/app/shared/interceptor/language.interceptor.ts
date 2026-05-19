import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../../core/service/local-storage/local-storage.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const currentLang = inject(LocalStorageService).getItem('language');
  const langId = currentLang ? currentLang : '2';
  const modifiedRequest = req.clone({
    setHeaders: {
      lang: langId,
    },
  });
  return next(modifiedRequest);
};
