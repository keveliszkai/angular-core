import { AuthenticationUserResponse } from '../interfaces/authentication-user.response';
import { Permission } from '../../permission/models/permission.model';

export class AuthenticationUser {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public permissions: Permission[];

  constructor(response?: AuthenticationUserResponse) {
    this.permissions = (response && response.permissions.map(resp => new Permission(resp))) || [];

    if (response) {
      this.id = response.id;
      this.firstName = response.firstName;
      this.lastName = response.lastName;
      this.email = response.email;
    }
  }

  public get displayName(): string {
    return !!this.firstName && !!this.lastName ? `${this.firstName} ${this.lastName}` : '';
  }
}
