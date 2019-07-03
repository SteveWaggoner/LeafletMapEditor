import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';
import { AgGridModule } from 'ag-grid-angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { LabelService } from './label.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    LeafletModule,
    HttpModule
  ],
  providers: [
    LabelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

