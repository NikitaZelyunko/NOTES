import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';
import { DndListModule} from 'ngx-drag-and-drop-lists';

import { AppComponent } from './app.component';
import { NoteComponent } from './note/note.component';
import { NewNotesComponent } from './new-notes/new-notes.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';
import { ContenteditableDirective } from 'ng-contenteditable';


@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    NewNotesComponent,
    ContenteditableDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DndListModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
