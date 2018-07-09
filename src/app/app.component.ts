import { Component, Output, EventEmitter} from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

const SEARCH_ROUTE_PREFIX = 'search';
const EMPTY_SEARCH_TYPE = '0';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
  trigger('selected', [
    // Custom state
    state('selected',
    style({
    left: 0,
    })
    ),
    state('menu_hide',
    style({
    left: -200,
    })
    ),
    // When the element goes from 'selected' state to whatever... 
    transition('selected <=> menu_hide', [
    animate('300ms ease-in')
    ])
   ])
]
})
export class AppComponent {
  title = 'app';
  menu_show = 'menu_hide';
  type_search = 'text';
  search_string = '';

  constructor (
    public router: Router,
    private location: Location) {
  }

showMenu(event: MouseEvent) {
  if (this.menu_show === 'selected') {
    this.menu_show = 'menu_hide';
  }
  else {
    this.menu_show = 'selected';
  }
}
searchNotes(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    if (this.search_string.length === 0) {
      this.router.navigate([SEARCH_ROUTE_PREFIX + '/' + EMPTY_SEARCH_TYPE + '/' + ' ']);
      this.type_search = EMPTY_SEARCH_TYPE;
    }
    else {
      this.router.navigate([SEARCH_ROUTE_PREFIX + '/' + this.type_search + '/' + this.search_string]);
      this.type_search = 'text';
    }
    this.search_string = '';
  }
}
showSearch() {
  if (this.search_string.length === 0) {
    this.router.navigate([SEARCH_ROUTE_PREFIX + '/' + this.type_search + '/' + ' ']);
  }
  else {
    this.router.navigate([SEARCH_ROUTE_PREFIX + '/' + this.type_search + '/' + this.search_string]);
  }

}
goBack() {
  this.router.navigate(['new_notes']);
  this.search_string = '';
  this.type_search = '0';
}
}
