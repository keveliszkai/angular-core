import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../api/services/api.service';
import { UserAuthenticationService } from '../../authentication/services/user-authentication.service';
import { Language } from '../models/language.model';
import { LanguageResponse } from '../interfaces/language.response';
import { LanguageFactory } from '../factories/language.factory';
import * as moment from 'moment';
import { Cookie } from 'ng2-cookies';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LanguageService {
  /**
   * This event fires, when the current language is changed.
   *
   * @type {EventEmitter<string>}
   * @memberof LanguageService
   */
  public onLangChanged: EventEmitter<string> = new EventEmitter<string>();

  /**
   * This event fires, when the list of the available languages changed.
   *
   * @type {EventEmitter<void>}
   * @memberof LanguageService
   */
  public onLanguagesListChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly translateService: TranslateService,
    private readonly userService: UserAuthenticationService,
    private readonly apiService: ApiService
  ) {
    this.userService.currentUser.subscribe(() => {
      this.getLanguages().subscribe(res => this.handleLanguagesResponse(res), err => this.handleErrors(err));
    });
  }

  /**
   * Factory of the service.
   *
   * @private
   * @memberof LanguageService
   */
  private readonly factory = new LanguageFactory();

  /**
   * Default/Offline language.
   *
   * @private
   * @type {string}
   * @memberof LanguageService
   */
  private readonly _defaultLocale: string = 'hu';

  /**
   * Default language code.
   *
   * @private
   * @type {string[]}
   * @memberof LanguageService
   */
  private readonly _defaultAvailableLanguages: string[] = ['en', 'hu'];

  /**
   * Default language code.
   *
   * @private
   * @type {string}
   * @memberof LanguageService
   */
  private _defaultLang: string;

  /**
   * Current language code.
   *
   * @private
   * @type {string}
   * @memberof LanguageService
   */
  private _currentLang: string;

  /**
   * Name of the cookie.
   *
   * @private
   * @memberof LanguageService
   */
  private readonly languageCookieName = 'language';

  /**
   * List of the available languages. (Object array)
   *
   * @private
   * @type {Language[]}
   * @memberof LanguageService
   */
  private _availableLanguages: Language[] = [];

  /**
   * Gets the current Core language.
   *
   * @readonly
   * @type {string}
   * @memberof LanguageService
   */
  public get currentLang(): string {
    return this._currentLang || this._defaultLang;
  }

  /**
   * Gets the default Core languge code.
   *
   * @readonly
   * @type {string}
   * @memberof LanguageService
   */
  public get defaultLang(): string {
    return this._defaultLang;
  }

  /**
   * Gets the current available languages.
   *
   * @readonly
   * @type {Language[]}
   * @memberof LanguageService
   */
  public get availableLanguages(): Language[] {
    return this._availableLanguages;
  }

  /**
   * Gets the current available language codes.
   *
   * @readonly
   * @memberof LanguageService
   */
  public get availableKeys() {
    const langs = this.translateService.getLangs().filter(lang => lang !== this.currentLang);
    langs.unshift(this.currentLang);
    return langs;
  }

  /**
   * Initialize the service.
   *
   * @memberof LanguageService
   */
  public initialize() {
    this.getLanguages().subscribe(res => this.handleLanguagesResponse(res), err => this.handleErrors(err));
  }

  /**
   * Sets the default language.
   *
   * @param {string} lang
   * @memberof LanguageService
   */
  public setDefaultLang(lang: string) {
    this._defaultLang = lang;
    this.translateService.setDefaultLang(lang);
  }

  /**
   * Sets the language.
   *
   * @param {string} lang
   * @param {boolean} [doStore=false] True, if you want to store the language in the cookie.
   * @memberof LanguageService
   */
  public setLanguage(lang: string, doStore: boolean = false): void {
    if (doStore) {
      this.setLanguageToCookie(lang);
    }

    // Core
    this._currentLang = lang;

    // moment
    moment.locale(lang);

    // ngx-translate
    this.translateService.use(lang);

    // Gloobal signal
    this.onLangChanged.emit();
  }

  /**
   * Error handler.
   *
   * @private
   * @param {*} err
   * @memberof LanguageService
   */
  private handleErrors(err) {
    this.setDefaults();
    console.error(err);
  }

  /**
   * Api response handler.
   *
   * @private
   * @param {LanguageResponse[]} res
   * @memberof LanguageService
   */
  private handleLanguagesResponse(res: LanguageResponse[]) {
    const actives = res.filter(i => i.active);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.setDefaultLang(actives.filter(i => i.default)[0].locale);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.setLanguage(this.getLanguageFromCookie());

    // Language changed
    this.onLangChanged.emit(this.getLanguageFromCookie());

    // List must be filled
    this._availableLanguages = [];
    actives.forEach(i => this._availableLanguages.push(this.factory.loadFromResponse(i)));
    this.translateService.addLangs(this._availableLanguages.map(i => i.locale));
    this.onLanguagesListChanged.emit();
  }

  /**
   * Gets the languages from the Backend.
   *
   * @private
   * @returns {Observable<LanguageResponse[]>}
   * @memberof LanguageService
   */
  private getLanguages(): Observable<LanguageResponse[]> {
    return this.apiService.getOne<LanguageResponse[]>('/language');
  }

  private setDefaults() {
    this.translateService.addLangs(this._defaultAvailableLanguages);
    this.setLanguage(this.getLanguageFromCookie());
  }

  /**
   * Gets the language from the cookie.
   *
   * @private
   * @returns
   * @memberof LanguageService
   */
  private getLanguageFromCookie() {
    const value = Cookie.get(this.languageCookieName);
    return value ? value : this._defaultLocale;
  }

  /**
   * Sets the cookie for the language.
   *
   * @private
   * @param {string} value
   * @memberof LanguageService
   */
  private setLanguageToCookie(value: string) {
    const additionalTime = 1000;
    const expireDate = new Date().getTime() + additionalTime;
    Cookie.set(this.languageCookieName, value, expireDate);
  }
}
