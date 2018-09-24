import { NgModule } from '@angular/core';
import { ApiService } from './services/api.service';
import { OauthService } from './services/oauth.service';
import { BlobService } from './services/blob.service';
import { ErrorService } from './services/error.sevice';
import { NotificationModule } from '../notification';

@NgModule({
  imports: [NotificationModule],
  providers: [ApiService, BlobService, ErrorService, OauthService]
})
export class ApiModule {}
