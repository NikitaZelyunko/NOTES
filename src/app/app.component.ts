import { Component } from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';

enum types {TEXT, LIST}
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
showMenu(event: MouseEvent) {
  if (this.menu_show === 'selected') {
    this.menu_show = 'menu_hide';
  }
  else {
    this.menu_show = 'selected';
  }
}
}
