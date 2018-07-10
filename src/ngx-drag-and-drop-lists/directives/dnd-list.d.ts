import { OnDestroy, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { DndState, DndListSettings } from '../services';
import { Subject } from 'rxjs';
export declare const dropAccepted: Subject<any>;
export declare class DndList implements OnInit, OnDestroy {
    private element;
    private dndState;
    option: DndListSettings;
    dndModel: any[];
    dndAdditionalModel: any[] //Added by ZelyunkoNikita
    dndPlaceholder: Element;
    dndDragOver: EventEmitter<any>;
    dndDrop: EventEmitter<any>;
    dndInserted: EventEmitter<any>;
    private dragState;
    private nativeElement;
    private listSettings;
    private placeholder;
    constructor(element: ElementRef, dndState: DndState);
    ngOnInit(): void;
    ngOnDestroy(): void;
    handleDragEnter(event: DragEvent): boolean;
    handleDragOver(event: DragEvent): boolean;
    handleDrop(event: DragEvent): boolean;
    handleDragLeave(event: DragEvent): void;
    private getPlaceholderElement();
    private getMimeType(types);
    private getItemType(mimeType);
    private isDropAllowed(itemType);
    private getDropEffect(event, ignoreDataTransfer);
    private stopDragOver();
    private invokeCallback(eventEmitter, event, dropEffect, itemType, index?, item?);
    private getPlaceholderIndex();
}
