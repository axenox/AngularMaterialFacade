import { HttpClient } from '@angular/common/http';
import { HttpWithLogActionsService } from './server-adapter/http-with-log-actions.service';
import { HttpActionsService } from './server-adapter/http-actions.service';
import { HttpWithLocalReadActionsService } from './server-adapter/http-with-local-read-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpWithLocalWriteActionsService } from './server-adapter/http-with-local-write-actions.service';
import { environment } from 'src/environments/environment';

export function apiFactory(http: HttpClient, translate: TranslateService) {
  switch (environment.apiClass) {
    case 'HttpWithLocalReadActionsService': return new HttpWithLocalReadActionsService(http, translate);
    case 'HttpWithLocalWriteActionsService': return new HttpWithLocalWriteActionsService(http, translate);
    case 'HttpActionsService':
    default:
      return new HttpActionsService(http, translate);
      //return new HttpWithLogActionsService(http, translate);
  }
}