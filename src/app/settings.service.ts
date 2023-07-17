import { Injectable } from '@angular/core';
import { DEFAULT_SIZE } from './board/board-state.service';

export interface SettingsModel {
  language: string;
  boardSize: number;
}

const DEFAULT_SETTINGS: SettingsModel = {
  language: 'en',
  boardSize: DEFAULT_SIZE,
};

const SETTINGS_KEY = 'tictactoe-settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settingsInner: SettingsModel;

  constructor() {
    this.settingsInner = this.loadSettings() || DEFAULT_SETTINGS;
  }

  public getSettings(): SettingsModel {
    return this.settingsInner;
  }

  public setLanguage(lang: string) {
    this.settingsInner.language = lang;
    this.saveSettings();
  }

  public setBoardSize(size: number) {
    this.settingsInner.boardSize = size;
    this.saveSettings();
  }

  public loadSettings(): SettingsModel | null {
    const json = localStorage.getItem(SETTINGS_KEY);
    if (!json) {
      return null;
    }

    return JSON.parse(json) as SettingsModel;
  }

  public saveSettings() {
    const json = JSON.stringify(this.settingsInner);
    localStorage.setItem(SETTINGS_KEY, json);
  }
}
