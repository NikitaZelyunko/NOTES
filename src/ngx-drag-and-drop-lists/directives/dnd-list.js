import { Directive, Input, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { DndState, ALL_EFFECTS, MIME_TYPE, EDGE_MIME_TYPE, MSIE_MIME_TYPE, } from '../services';
import { Subject } from 'rxjs';
export var dropAccepted = new Subject();
var DndList = (function() {
    function DndList(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.option = {
            disabled: false,
            effectAllowed: 'move',
            allowedTypes: undefined,
        };
        this.dndDragOver = new EventEmitter();
        this.dndDrop = new EventEmitter();
        this.dndInserted = new EventEmitter();
        this.listSettings = {};
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.placeholder = this.getPlaceholderElement();
    }
    Object.defineProperty(DndList.prototype, "dndPlaceholder", {
        set: function(placeholder) {
            this.placeholder = placeholder;
            placeholder.remove();
        },
        enumerable: true,
        configurable: true
    });
    DndList.prototype.ngOnInit = function() {
        //Added by Zelyunko Nikita
        this.dndAdditionalModel = JSON.parse(JSON.stringify(this.dndModel.slice()));
    };
    DndList.prototype.ngOnDestroy = function() {};
    DndList.prototype.handleDragEnter = function(event) {
        event = event['originalEvent'] || event;
        var mimeType = this.getMimeType(event.dataTransfer.types);
        if (!mimeType || !this.isDropAllowed(this.getItemType(mimeType))) {
            return true;
        }
        event.preventDefault();
        return false;
    };
    DndList.prototype.handleDragOver = function(event) {
        event = event['originalEvent'] || event;
        var mimeType = this.getMimeType(event.dataTransfer.types);
        var itemType = this.getItemType(mimeType);
        if (!mimeType || !this.isDropAllowed(itemType)) {
            return true;
        }
        if (this.placeholder.parentNode !== this.nativeElement) {
            this.nativeElement.appendChild(this.placeholder);
        }
        if (event.target !== this.nativeElement) {
            var listItemNode = event.target;
            while (listItemNode.parentNode !== this.nativeElement && listItemNode.parentNode) {
                listItemNode = listItemNode.parentNode;
            }
            if (listItemNode.parentNode === this.nativeElement && listItemNode !== this.placeholder) {
                var isFirstHalf = void 0;
                var rect = listItemNode.getBoundingClientRect();
                if (this.option.horizontal) {
                    isFirstHalf = event.clientX < rect.left + rect.width / 2;
                } else {
                    isFirstHalf = event.clientY < rect.top + rect.height / 2;
                }
                this.nativeElement.insertBefore(this.placeholder, isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
        }
        var ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        var dropEffect = this.getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none')
            return this.stopDragOver();
        event.preventDefault();
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        this.nativeElement.classList.add('dndDragover');
        event.stopPropagation();
        return false;
    };
    DndList.prototype.handleDrop = function(event) {
        event = event['originalEvent'] || event;
        var mimeType = this.getMimeType(event.dataTransfer.types);
        var itemType = this.getItemType(mimeType);
        if (!mimeType || !this.isDropAllowed(itemType))
            return true;
        event.preventDefault();
        var data = undefined;
        try {
            data = JSON.parse(event.dataTransfer.getData(mimeType));
        } catch (e) {
            return this.stopDragOver();
        }

        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
            itemType = data.type || undefined;
            data = data.item;
            if (!this.isDropAllowed(itemType))
                return this.stopDragOver();
        }
        var ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        var dropEffect = this.getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none')
            return this.stopDragOver();
        var index = this.getPlaceholderIndex();
        if (this.dndDrop) {
            this.invokeCallback(this.dndDrop, event, dropEffect, itemType, index, data);
            if (!data)
                return this.stopDragOver();
        }
        this.dragState.dropEffect = dropEffect;
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        if (data !== true) {
            //Modified by Nikita Zelyunko
            var index_before_drag = indexOfbyFields(data, this.dndModel.slice());
            if (index > index_before_drag) {
                this.dndModel.splice(index + 1, 0, data);
                // this.dndAdditionalModel.splice(index + 1, 0, data);
            } else {
                this.dndModel.splice(index, 0, data);
                //this.dndAdditionalModel.splice(index, 0, data);
            }
            // this.dndAdditionalModel.splice(index_before_drag, 1);
            //Modified by Nikita Zelyunko
        }
        this.invokeCallback(this.dndInserted, event, dropEffect, itemType, index, data);
        dropAccepted.next({ item: data, list: this.dndModel });
        this.stopDragOver();
        event.stopPropagation();
        return false;
    };
    DndList.prototype.handleDragLeave = function(event) {
        event = event['originalEvent'] || event;
        var newTarget = document.elementFromPoint(event.clientX, event.clientY);
        if (this.nativeElement.contains(newTarget) && !event['_dndPhShown']) {
            event['_dndPhShown'] = true;
        } else {
            this.stopDragOver();
        }
    };
    DndList.prototype.getPlaceholderElement = function() {
        var placeholder = undefined;
        if (this.nativeElement.children) {
            for (var i = 1; i < this.nativeElement.children.length; i++) {
                var child = this.nativeElement.children.item(i);
                if (child.classList.contains('dndPlaceholder')) {
                    placeholder = child;
                }
            }
        }
        var placeholderDefault = document.createElement('li');
        placeholderDefault.classList.add('dndPlaceholder');
        return placeholder || placeholderDefault;
    };
    DndList.prototype.getMimeType = function(types) {
        if (!types)
            return MSIE_MIME_TYPE;
        for (var i = 0; i < types.length; i++) {
            if (types[i] === MSIE_MIME_TYPE || types[i] === EDGE_MIME_TYPE ||
                types[i].substr(0, MIME_TYPE.length) === MIME_TYPE) {
                return types[i];
            }
        }
        return null;
    };
    DndList.prototype.getItemType = function(mimeType) {
        if (this.dragState.isDragging)
            return this.dragState.itemType || undefined;

        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE)
            return null;
        return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
    };
    DndList.prototype.isDropAllowed = function(itemType) {
        if (this.option.disabled)
            return false;
        if (this.option.max && this.dndModel.length === this.option.max)
            return false;
        if (!this.option.externalSources && !this.dragState.isDragging)
            return false;
        if (!this.option.allowedTypes || itemType === null)
            return true;
        return itemType && this.option.allowedTypes.indexOf(itemType) !== -1;
    };
    DndList.prototype.getDropEffect = function(event, ignoreDataTransfer) {
        var effects = Object.assign([], ALL_EFFECTS);
        if (!ignoreDataTransfer) {
            effects = this.dndState.filterEffects(effects, event.dataTransfer.effectAllowed);
        }
        if (this.dragState.isDragging) {
            effects = this.dndState.filterEffects(effects, this.dragState.effectAllowed);
        }
        if (this.option.effectAllowed) {
            effects = this.dndState.filterEffects(effects, this.option.effectAllowed);
        }
        if (!effects.length) {
            return 'none';
        } else if (event.ctrlKey && effects.indexOf('copy') !== -1) {
            return 'copy';
        } else if (event.altKey && effects.indexOf('link') !== -1) {
            return 'link';
        } else {
            return effects[0];
        }
    };
    DndList.prototype.stopDragOver = function() {
        this.placeholder.remove();
        this.nativeElement.classList.remove('dndDragover');
        return true;
    };
    DndList.prototype.invokeCallback = function(eventEmitter, event, dropEffect, itemType, index, item) {
        eventEmitter.emit({
            dropEffect: dropEffect,
            event: event,
            external: !this.dragState.isDragging,
            index: index !== undefined ? index : this.getPlaceholderIndex(),
            item: item || undefined,
            type: itemType,
        });
        return true;
    };
    DndList.prototype.getPlaceholderIndex = function() {
        for (var i = 0; i < this.nativeElement.children.length; i++) {
            if (this.nativeElement.children[i].classList.contains('dndDragging')) {
                this.nativeElement.children[i].remove();
                break;
            }
        }
        return Array.prototype.indexOf.call(this.nativeElement.children, this.placeholder);
    };
    DndList.decorators = [{
        type: Directive,
        args: [{
            selector: '[dndList]',
        }, ]
    }, ];
    DndList.ctorParameters = function() {
        return [
            { type: ElementRef, },
            { type: DndState, },
        ];
    };
    DndList.propDecorators = {
        "option": [{ type: Input, args: ['dndList', ] }, ],
        "dndModel": [{ type: Input, args: ['dndModel', ] }, ],
        "dndPlaceholder": [{ type: Input }, ],
        "dndDragOver": [{ type: Output, args: ['dndDragOver', ] }, ],
        "dndDrop": [{ type: Output, args: ['dndDrop', ] }, ],
        "dndInserted": [{ type: Output, args: ['dndInserted', ] }, ],
        "handleDragEnter": [{ type: HostListener, args: ['dragenter', ['$event'], ] }, ],
        "handleDragOver": [{ type: HostListener, args: ['dragover', ['$event'], ] }, ],
        "handleDrop": [{ type: HostListener, args: ['drop', ['$event'], ] }, ],
        "handleDragLeave": [{ type: HostListener, args: ['dragleave', ['$event'], ] }, ],
    };
    return DndList;
}());
export { DndList };

//added for NOTES by Nikita Zelyunko
function isEqualByFields(a, b) {
    var k_a = Object.keys(a);
    var k_b = Object.keys(b);
    if (k_a.length !== k_b.length) {
        return false;
    }
    for (var i = 0; i < k_a.length; i++) {
        if (k_a[i] !== k_b[i]) {
            return false;
        }
        if (a[k_a[i]] !== b[k_b[i]]) {
            return false;
        }
    }
    return true;
}
//added for NOTES by Nikita Zelyunko
function indexOfbyFields(a, b) {
    //b-array
    for (var i = 0; i < b.length; i++) {
        if (isEqualByFields(a, b[i])) {
            return i;
        }
    }
    return -1;
}
//# sourceMappingURL=dnd-list.js.map