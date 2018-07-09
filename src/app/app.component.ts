import { Component, Output, EventEmitter} from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';
import { Router } from '@angular/router';

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
  @Output() createNote: EventEmitter<number> = new EventEmitter<number>();

  constructor (public router: Router) {
    
  }

showMenu(event: MouseEvent) {
  this.createNote.emit(1);
  if (this.menu_show === 'selected') {
    this.menu_show = 'menu_hide';
  }
  else {
    this.menu_show = 'selected';
  }
}
}
