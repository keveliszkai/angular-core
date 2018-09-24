import { PermissionResponse } from '../../permission/interfaces/permission.response';

export interface AuthenticationUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  permissions: PermissionResponse[];
}
