import { Component, EventEmitter, OnInit, Input, Output, Inject } from '@angular/core';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiService, OauthService } from '../../api';
import { Environment } from '../../interfaces';
import { ErrorService } from '../../api/services/error.sevice';

@Component({
  selector: 'uploader',
  styleUrls: ['uploader.component.css'],
  templateUrl: './uploader.component.html'
})
export class UploaderComponent implements OnInit {
  @Input()
  public url = '';
  @Input()
  public image = '';
  @Input()
  public title = '';
  @Input()
  public alias = 'avatar';
  @Input()
  public method = 'POST';

  @Input()
  public showImage = false;
  @Input()
  public onButton = false;

  @Input()
  public upload: EventEmitter<object> = new EventEmitter<object>();

  @Output()
  public uploaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public fileChanged: EventEmitter<string> = new EventEmitter<string>();

  public uploader: FileUploader;

  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor(
    @Inject('config') private readonly environment: Environment,
    private readonly apiService: ApiService,
    private readonly errorService: ErrorService,
    private readonly oauthService: OauthService
  ) {}

  public startUpload(file: FileItem, fileChanged: EventEmitter<string>) {
    // Access-Control-Allow-Origin solve
    file.withCredentials = false;

    if (fileChanged && file) {
      fileChanged.emit(file.file.name);
    }

    if (!this.onButton) {
      file.upload();
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public ngOnInit() {
    const options: FileUploaderOptions = {
      url: this.environment.apiUrl + this.url,
      authToken: `Bearer ${this.oauthService.getToken()}`,
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ],
      itemAlias: this.alias,
      method: this.method
    };

    this.upload.subscribe(o => this.handleUpload(o));

    this.uploader = new FileUploader(options);

    this.uploader.onAfterAddingFile = () => this.startUpload(this.uploader.queue.length ? this.uploader.queue[0] : null, this.fileChanged);

    this.uploader.onCompleteItem = (item: any, response: string) => {
      console.log(item);
      this.uploader.queue = [];
      this.apiService.handleResponse(JSON.parse(response));
      this.uploaded.emit(true);
    };

    this.uploader.onErrorItem = (item: any, response: string) => {
      console.error(item);
      this.uploader.queue = [];
      const resp = new HttpErrorResponse({ error: JSON.parse(response) });
      this.errorService.errorHandling<any>(resp);
      this.uploaded.emit(false);
    };
  }

  private handleUpload(o: object) {
    if (o) {
      this.uploader.options.additionalParameter = o;
    }

    if (this.uploader.queue.length) {
      this.uploader.queue[0].upload();
    }
  }
}
