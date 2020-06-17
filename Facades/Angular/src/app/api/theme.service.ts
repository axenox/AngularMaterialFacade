import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StyleManagerService } from './style-manager.service';
import { Observable } from 'rxjs';

@Injectable()
export class ThemeService {
  constructor(
    private http: HttpClient,
    private styleManager: StyleManagerService
  ) {}

  setTheme(themeToSet: string) {
    this.styleManager.setStyle(
      'theme',
      themeToSet
    );
  }
}
