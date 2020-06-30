import { HttpClient } from '@angular/common/http';
import { HttpWithLogActionsService } from './server-adapter/http-with-log-actions.service';
import { HttpActionsService } from './server-adapter/http-actions.service';
import { HttpWithLocalReadActionsService } from './server-adapter/http-with-local-read-actions.service';

export function apiFactory(http: HttpClient) {
  //return new HttpActionsService(http);
  //return new HttpWithLocalWriteActionsService(http);
  return new HttpWithLocalReadActionsService(http);
  //return new HttpWithLogActionsService(http);
}