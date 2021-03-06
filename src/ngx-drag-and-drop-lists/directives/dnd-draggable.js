import { Directive, Input, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { DndState } from '../services';
import { ALL_EFFECTS, MIME_TYPE, EDGE_MIME_TYPE, MSIE_MIME_TYPE, } from '../index';
import { dropAccepted } from './dnd-list';
var DndDraggable = (function () {
    function DndDraggable(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.option = { draggable: true };
        this.dndDragStart = new EventEmitter();
        this.dndDragEnd = new EventEmitter();
        this.dndCopied = new EventEmitter();
        this.dndLinked = new EventEmitter();
        this.dndMoved = new EventEmitter();
        this.dndCanceled = new EventEmitter();
        this.dndSelected = new EventEmitter();
        this.draggableString = 'draggable';
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');
        this.nativeElement.onselectstart = function () {
            if (this.dragDrop)
                this.dragDrop();
        };
    }
    Object.defineProperty(DndDraggable.prototype, "disableDrag", {
        set: function (disable) {
            if (disable !== undefined) {
                this.nativeElement.setAttribute(this.draggableString, (!disable).toString());
            }
        },
        enumerable: true,
        configurable: true
    });
    DndDraggable.prototype.ngOnInit = function () {
        var _this = this;
        this.dropSubscription = dropAccepted.subscribe(function (_a) {
            var item = _a.item, list = _a.list;
            if (JSON.stringify(_this.dndObject) === JSON.stringify(item)) {
                var cb = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
                _this[cb[_this.dragState.effectAllowed]].emit();
                _this.dndDragEnd.emit();
            }
        });
    };
    DndDraggable.prototype.ngOnDestroy = function () {
        this.dropSubscription.unsubscribe();
    };
    DndDraggable.prototype.handleDragStart = function (event) {
        var _this = this;
        if (this.nativeElement.getAttribute(this.draggableString) === 'false')
            return;
        this.dragState.isDragging = true;
        this.dragState.itemType = this.dndType;
        this.dragState.dropEffect = 'none';
        this.dragState.effectAllowed = this.option.effectAllowed || ALL_EFFECTS[0];
        event.dataTransfer.effectAllowed = this.dragState.effectAllowed;
        var mimeType = MIME_TYPE + (this.dragState.itemType ? ('-' + this.dragState.itemType) : '');
        try {
            event.dataTransfer.setData(mimeType, JSON.stringify(this.dndObject));
        }
        catch (e) {
            var data = JSON.stringify({ item: this.dndObject, type: this.dragState.itemType });
            try {
                event.dataTransfer.setData(EDGE_MIME_TYPE, data);
            }
            catch (e) {
                var effectsAllowed = this.dndState.filterEffects(ALL_EFFECTS, this.dragState.effectAllowed);
                event.dataTransfer.effectAllowed = effectsAllowed[0];
                event.dataTransfer.setData(MSIE_MIME_TYPE, data);
            }
        }
        this.nativeElement.classList.add('dndDragging');
        setTimeout((function () { return _this.nativeElement.style.display = 'none'; }));
        if (event._dndHandle && event.dataTransfer.setDragImage) {
            event.dataTransfer.setDragImage(this.nativeElement, 0, 0);
        }
        this.dndDragStart.emit();
        event.stopPropagation();
    };
    DndDraggable.prototype.handleDragEnd = function (event) {
        var _this = this;
        this.dragState.isDragging = false;
        this.nativeElement.classList.remove('dndDragging');
        this.nativeElement.style.removeProperty('display');
        event.stopPropagation();
        setTimeout((function () { return _this.nativeElement.classList.remove('dndDraggingSource'); }), 0);
    };
    DndDraggable.prototype.handleClick = function (event) {
        if (this.nativeElement.hasAttribute('dndSelected'))
            return;
        event = event['originalEvent'] || event;
        this.dndSelected.emit();
        event.stopPropagation();
    };
    DndDraggable.prototype.findElementWithAttribute = function (element, attr) {
        if (element.hasAttribute(attr))
            return element;
        if (element.parentElement === null)
            return;
        return this.findElementWithAttribute(element.parentElement, attr);
    };
    DndDraggable.decorators = [
        { type: Directive, args: [{
                    selector: '[dndDraggable]',
                },] },
    ];
    DndDraggable.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: DndState, },
    ]; };
    DndDraggable.propDecorators = {
        "option": [{ type: Input, args: ['dndDraggable',] },],
        "dndType": [{ type: Input, args: ['dndType',] },],
        "dndObject": [{ type: Input, args: ['dndObject',] },],
        "disableDrag": [{ type: Input, args: ['dndDragDisabled',] },],
        "dndDragStart": [{ type: Output, args: ['dndDragStart',] },],
        "dndDragEnd": [{ type: Output, args: ['dndDragEnd',] },],
        "dndCopied": [{ type: Output, args: ['dndCopied',] },],
        "dndLinked": [{ type: Output, args: ['dndLinked',] },],
        "dndMoved": [{ type: Output, args: ['dndMoved',] },],
        "dndCanceled": [{ type: Output, args: ['dndCanceled',] },],
        "dndSelected": [{ type: Output, args: ['dndSelected',] },],
        "handleDragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
        "handleDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
        "handleClick": [{ type: HostListener, args: ['click', ['$event'],] },],
    };
    return DndDraggable;
}());
export { DndDraggable };
//# sourceMappingURL=dnd-draggable.js.map