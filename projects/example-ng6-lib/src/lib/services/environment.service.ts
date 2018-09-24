import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../interfaces';

/**
 * This service handles the environment in the ../... This work runtime.
 *
 * @export
 * @class EnvironmentService
 */
@Injectable()
export class EnvironmentService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Relative path of the environment.
   *
   * @private
   * @memberof EnvironmentService
   */
  private readonly environmentPath = '/assets/environments/environment.json';

  /**
   * Relative path of the environment in production mode.
   *
   * @private
   * @memberof EnvironmentService
   */
  private readonly environmentProductionPath = '/assets/environments/environment.prod.json';

  /**
   * Internal, stored environment file.
   *
   * @private
   * @type {Environment}
   * @memberof EnvironmentService
   */
  private _environment: Environment;

  /**
   * This function loads the environment runtime. This must be a Promise!
   *
   * @returns
   * @memberof EnvironmentService
   */
  public loadEnvironment() {
    return this.http
      .get(isDevMode() ? this.environmentPath : this.environmentProductionPath)
      .toPromise()
      .then(data => {
        this._environment = data as Environment;
      })
      .catch(console.error);
  }

  /**
   * Public getter of the environment.
   *
   * @readonly
   * @type {Environment}
   * @memberof EnvironmentService
   */
  public get environment(): Environment {
    return this._environment;
  }
}
