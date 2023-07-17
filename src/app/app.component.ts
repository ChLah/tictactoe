import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {
    translateService.setDefaultLang('en');

    const { language } = settingsService.getSettings();
    translateService.use(language);
  }

  curLang$ = this.translateService.onLangChange.pipe(map((e) => e.lang));
  setLang(lang: string) {
    this.translateService.use(lang);
    this.settingsService.setLanguage(lang);
  }
}
