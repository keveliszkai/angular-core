import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Components
import {
  SortableTableDirective,
  SortableColumnComponent,
  SortableColumnService,
  UploaderComponent,
  LoaderComponent,
  PaginatorComponent
} from './components';

import { ControlMessageComponent } from './components/control-message/control-message.component';

// Pipes
import { TruncatePipe, FilenamePipe, SafePipe, SafeHtmlPipe, GetLangPipe } from './pipes';

// Confirmation
import { ConfirmationModule, ConfirmationModalComponent } from './confirmation';

// Plugins
import { FileUploadModule } from 'ng2-file-upload';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { LanguageModule } from './language';
import { NotificationModule } from './notification';
import { ApiModule } from './api';
import { AuthenticationModule } from './authentication';
import { PermissionModule } from './permission';

// Extensions
import './extensions/array.extension';
import './extensions/date.extension';

// EnvironmentService
import { EnvironmentService } from './services/environment.service';

import { ValidationService } from './services/validation.service';
import { SlugService } from './services/slug.service';
import { CoreService } from './services/core.service';

import { CustomTranslateLoader } from './language/loader/custom-translate.loader';
import { GlobalErrorHandler } from './services/error.hanlder';

// This function makes the i18n.json load
// Must be an export function (AOT)
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// This function loads the runtime configuration
// Must be an export function (AOT)
export function appInitializerFn(environmentService: EnvironmentService) {
  return () => {
    return environmentService.loadEnvironment();
  };
}

@NgModule({
  declarations: [
    LoaderComponent,
    SortableColumnComponent,
    SortableTableDirective,
    UploaderComponent,
    PaginatorComponent,
    ConfirmationModalComponent,
    TruncatePipe,
    FilenamePipe,
    SafePipe,
    SafeHtmlPipe,
    GetLangPipe,
    ControlMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // Plugins
    NgxPaginationModule,
    FileUploadModule,
    NgbModule,

    {
      ngModule: ToastrModule,
      providers: [
        {
          provide: 'positionClass',
          useValue: 'toast-bottom-right'
        },
        {
          provide: 'progressBar',
          useValue: true
        }
      ]
    },

    {
      ngModule: TranslateModule,
      providers: [
        {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader
        }
      ]
    },

    /*ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressBar: true
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader
      }
    }),*/

    RouterModule,

    // Modules
    LanguageModule,
    NotificationModule,
    ApiModule,
    AuthenticationModule,
    ConfirmationModule,
    PermissionModule
  ],
  exports: [
    LoaderComponent,
    SortableColumnComponent,
    ConfirmationModalComponent,
    SortableTableDirective,
    UploaderComponent,
    FilenamePipe,
    TruncatePipe,
    SafePipe,
    SafeHtmlPipe,
    GetLangPipe,
    FileUploadModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule,
    TranslateModule,
    RouterModule,
    PaginatorComponent,
    ConfirmationModule,
    AuthenticationModule,
    PermissionModule,
    NgbModule,
    ControlMessageComponent
  ],
  providers: [
    SortableColumnService,
    GetLangPipe,
    ValidationService,
    SlugService,
    CoreService,
    EnvironmentService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [EnvironmentService]
    },
    [
      {
        provide: ErrorHandler,
        useClass: GlobalErrorHandler
      }
    ]
  ]
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule
    };
  }
}
