import { BrowserModule } from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NoteComponent } from './note/note.component';
import { NewNotesComponent } from './new-notes/new-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    NewNotesComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
