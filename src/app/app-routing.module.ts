import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { NewNotesComponent } from './new-notes/new-notes.component';
import { ArchiveNotesComponent} from './archive-notes/archive-notes.component';
import { FixedNotesComponent } from './fixed-notes/fixed-notes.component';
import { TrashNotesComponent } from './trash-notes/trash-notes.component';
import { SearchComponent} from './search/search.component';
import { NoteComponent } from './note/note.component';

const routes: Routes = [
  { path: '', redirectTo: '/new_notes', pathMatch: 'full' },
  { path: 'new_notes', component: NewNotesComponent },
  { path: 'archive', component: ArchiveNotesComponent },
  { path: 'fixed', component: FixedNotesComponent },
  { path: 'trash', component: TrashNotesComponent },
  { path: 'note/:id', component: NoteComponent },
  { path: 'search/:type/:string', component: SearchComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule {
}
