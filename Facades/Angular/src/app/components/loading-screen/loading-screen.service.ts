import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

  private loading = false;
  loadingStatus = new Subject();

  get getLoading(): boolean {
    return this.loading;
  }

  set setLoading(value: boolean) {
    this.loading = value;
    this.loadingStatus.next(value);
  }

  startLoading() {
    this.setLoading = true;
  }

  stopLoading() {
    this.setLoading = false;
  }
}
