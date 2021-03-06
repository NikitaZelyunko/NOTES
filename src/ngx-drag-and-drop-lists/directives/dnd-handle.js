import { Directive, ElementRef, HostListener } from '@angular/core';
import { DndState, } from '../services';
var DndHandle = (function() {
    function DndHandle(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.draggableString = 'draggable';
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');
    }
    DndHandle.prototype.handleDragStart = function(event) {
        event = event['originalEvent'] || event;
        event['_dndHandle'] = true;
    };
    DndHandle.prototype.handleDragEnd = function(event) {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
            event.stopPropagation();
        }
    };
    DndHandle.decorators = [{
        type: Directive,
        args: [{
            selector: '[dndHandle]',
        }, ]
    }, ];
    DndHandle.ctorParameters = function() {
        return [
            { type: ElementRef, },
            { type: DndState, },
        ];
    };
    DndHandle.propDecorators = {
        "handleDragStart": [{ type: HostListener, args: ['dragstart', ['$event'], ] }, ],
        "handleDragEnd": [{ type: HostListener, args: ['dragend', ['$event'], ] }, ],
    };
    return DndHandle;
}());
export { DndHandle };
//# sourceMappingURL=dnd-handle.js.map