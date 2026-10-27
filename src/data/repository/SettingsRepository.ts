import { AppSettings, AppTheme, FontSize } from '../../domain/model/types';
import { Storage, STORAGE_KEYS, DEFAULT_SETTINGS } from '../local/storage';

type SettingsListener = (settings: AppSettings) => void;

class SettingsRepositoryImpl {
  private settings: AppSettings;
  private listeners = new Set<SettingsListener>();

  constructor() {
    this.settings = Storage.getItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener);
    listener(this.getSettings());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public updateSettings(partial: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...partial };
    Storage.setItem(STORAGE_KEYS.SETTINGS, this.settings);
    this.listeners.forEach((l) => l(this.getSettings()));
    return this.getSettings();
  }

  public setTheme(theme: AppTheme) {
    this.updateSettings({ theme });
  }

  public setFontSize(fontSize: FontSize) {
    this.updateSettings({ fontSize });
  }
}

export const SettingsRepository = new SettingsRepositoryImpl();
