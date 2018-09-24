import { PermissionResponse } from '../interfaces/permission.response';
import { PermissionType } from './permission-type.enum';

export class Permission {
  public id: number;
  public name: string;
  public type: PermissionType;

  constructor(response?: PermissionResponse) {
    if (response) {
      this.id = response.id;
      this.name = response.name;
      this.type = response.type;
    }
  }
}
