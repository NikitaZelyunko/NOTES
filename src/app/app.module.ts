import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { DndListModule} from 'ngx-drag-and-drop-lists';

import { NoteStorageService } from './note-storage.service';
import { NoteOrderService } from './note-order.service';

import { AppComponent } from './app.component';
import { NoteComponent } from './note/note.component';
import { NewNotesComponent } from './new-notes/new-notes.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';
import { ContenteditableDirective } from 'ng-contenteditable';
import { NoteAddComponent } from './note-add/note-add.component';


@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    NewNotesComponent,
    ContenteditableDirective,
    NoteAddComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DndListModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [
    NoteStorageService,
    NoteOrderService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
