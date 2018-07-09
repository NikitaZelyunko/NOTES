import { Component, OnInit} from '@angular/core';
import { NoteStorageService } from '../note-storage.service';
import { NoteOrderService } from '../note-order.service';
import { Note } from '../note';
import { Router, ActivatedRoute } from '@angular/router';

const NOTE_ROUTE_PREFIX = 'note';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search_res: any = [];
  notes: any = [];
  menu_items_visible = [];
  search_string = '';
  search_type = 'text';

  availible_colors = [
  '#FFFFFF', //white
  '#FF0000', //red
  '#FF8C00', //darkOrange
  '#FFFF00', //yellow
  '#008000', //green
  '#008080', //teal
  '#0000FF', //blue
  '#00008B', //darkBlue
  '#800080', //purple
  '#FF69B4', //hotPink
  '#CD853F', //peru
  '#808080'  //gray
];

  constructor(
    private noteStorageService: NoteStorageService,
    private noteOrderService: NoteOrderService,
    private activatedRoute: ActivatedRoute,
    private routing: Router) { }

   ngOnInit() {
    this.searchNotes();
    document.addEventListener('keypress', this.update_search_string(this, 0));
    document.addEventListener('click', this.update_search_string(this, 1));
  }

  update_search_string(component: SearchComponent, type: number) {
    let comp = component;
    function upd_on_enter(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        comp.search_type = comp.activatedRoute.snapshot.paramMap.get('type');
        comp.search_string = comp.activatedRoute.snapshot.paramMap.get('string');
        comp.searchNotes();
      }
    }
    function upd_on_click(event: Event) {
      if (event.target['id'] === 'search_icon') {
        comp.search_type = comp.activatedRoute.snapshot.paramMap.get('type');
        comp.search_string = comp.activatedRoute.snapshot.paramMap.get('string');
        comp.searchNotes();
      }
    }
    if (type === 0) {
      return upd_on_enter;
    }
    if (type === 1) {
      return upd_on_click;
    }
  }
  searchNotes() {
    
    if (this.search_type !== '0') {
      if (this.search_string !== '') {
        console.log('search', this.search_type, this.search_string );
        this.search_res = this.noteStorageService.searchNote(this.search_string, {});
        this.notes = [];
        this.get_search_notes();
      }
    }
  }

  private get_search_notes() {
    console.log(this.search_res);
    this.notes = [];
    this.menu_items_visible = [];
    let note;
    for (let i = 0; i < this.search_res.length; i++) {
      if ((this.search_res[i].title.length !== 0) || (this.search_res[i].body.length !== 0)) {
        note = this.noteStorageService.get_note(i).toJSON();
        this.notes.push(note);
        this.init_menu_bar(i);
      }
    }
  }

  private init_menu_bar(order_num: number) {
    this.menu_items_visible[order_num] = {
      'changer_color_visible': false,
      'menu_bar_visible': false,
      'pin_visible': false
    };
  }

  private delete_menu_bar(order_num: number) {
    this.menu_items_visible.splice(order_num, 1);
  }

  public removeNote(note: object, notes: any[]): void {
    let last_index = this.notes.indexOf(note);
    notes.splice(last_index, 1);
    this.reorder();
    this.update_order_notes();
  }
  private reorder() {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i]['order_num'] !== i) {
        this.noteOrderService.changeOrderNum(this.notes[i]['id'], this.notes[i]['note_type'], i);
        this.notes[i]['order_num'] = i;
      }
    }
  }
  private update_order_notes() {
    for (let i = 0; i < this.notes.length; i++) {

      this.noteStorageService.update_or_create_note(Note.fromJSON(this.notes[i]));
    }
  }
  /*
  addNote(): (id: number) => void {
    let comp = this;
    function add_note(id: number): void {
      console.log('id', id);
      let order_num = comp.noteOrderService.getOrder(id);
      let note = comp.noteStorageService.get_note(id);
      comp.notes.splice(order_num, 0, note);
    }
    return add_note;
  }
  */

  show_note(order_num: number, event: Event) {
    let class_name = event.target['className'];
    let show = false;
    switch (class_name) {
      case 'note ng-star-inserted': show = true; break;
      case 'note_header ': show = true; break;
      case 'note_body ': show = true; break;
    }
    if (show) {
      this.routing.navigate([NOTE_ROUTE_PREFIX + '/' + this.notes[order_num]['id'].toString()]);
    }
  }


deleteNote(order_num: number) {
  this.notes.splice(order_num, 1);
  //this.delete_menu_bar(order_num);
  //this.reorder();
}

showMenuBar(order_num: number) {
  let keys = Object.keys(this.menu_items_visible[order_num]);
  keys.splice(keys.indexOf('menu_bar_visible'), 1);
  //cкрываем элементы меню которые хотим
  this.setAllValues(this.menu_items_visible[order_num], keys, false);
  this.menu_items_visible[order_num]['menu_bar_visible'] = true;
  this.menu_items_visible[order_num]['pin_visible'] = true;
}
hideMenuBar(order_num: number) {
  let keys = Object.keys(this.menu_items_visible[order_num]);
  this.setAllValues(this.menu_items_visible[order_num], keys, false);
}
showChangerColor(order_num: number) {
  let keys = Object.keys(this.menu_items_visible[order_num]);
  keys.splice(keys.indexOf('changer_color_visible'), 1);
  keys.splice(keys.indexOf('menu_bar_visible'), 1);
  this.setAllValues(this.menu_items_visible[order_num], keys, false);
  this.menu_items_visible[order_num]['changer_color_visible'] = true;
}
hideChangerColor(order_num: number) {
  this.menu_items_visible[order_num]['changer_color_visible'] = false;
}
changeColor(note: any, color: string) {
  note.color = color;
  this.commitChanges(this.notes.indexOf(note));
}
archivateUnarchivate(note: any) {
  if (note['note_type'] !== 2) {
    note['note_type'] = 2;
    this.commitChanges(this.notes.indexOf(note));
    this.noteOrderService.toArchive(
      note['id'],
      0
    );
  }
  else {
    note['note_type'] = 0;
    this.commitChanges(this.notes.indexOf(note));
    this.noteOrderService.toNew(
      note['id'],
      0
    );
  }
  this.deleteNote(this.notes.indexOf(note));
}
fixedUnfixed(note: any) {
  if (note['note_type'] !== 1) {
    note['note_type'] = 1;
    this.commitChanges(this.notes.indexOf(note));
    this.noteOrderService.toFixed(
      note['id'],
      0
    );
  }
  else {
    note['note_type'] = 0;
    this.commitChanges(this.notes.indexOf(note));
    this.noteOrderService.toNew(
      note['id'],
      0
    );
  }
  this.deleteNote(this.notes.indexOf(note));
}
trashUntrash(note: any) {
  if (note['note_type'] !== 3) {
    note['note_type'] = 3;
    this.commitChanges(this.notes.indexOf(note));
    this.noteOrderService.toTrash(
      note['id'],
      0
    );
  }
  else {
    note['note_type'] = 0;
    this.commitChanges(this.notes.indexOf(note));
    this.noteOrderService.toNew(
      note['id'],
      0
    );
  }
  this.deleteNote(this.notes.indexOf(note));
}

commitChanges(order_num) {
  this.noteStorageService.update_or_create_note(
    Note.fromJSON(this.notes[order_num]));
}

private setAllValues(obj: object, keys: Array<string>, set_value: any) {
  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = set_value;
  }
}

}
