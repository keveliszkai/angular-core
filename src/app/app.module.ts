import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from 'example-ng6-lib';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
