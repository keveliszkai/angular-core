import { KeyValues } from '../key-value';

export interface ListParameters {
  page?: number;
  size?: number;
  order?: KeyValues;
  search?: string;
  filter?: KeyValues;
}
