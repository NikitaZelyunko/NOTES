import { TestBed, inject } from '@angular/core/testing';

import { NoteOrderService } from './note-order.service';

describe('NoteOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteOrderService]
    });
  });

  it('should be created', inject([NoteOrderService], (service: NoteOrderService) => {
    expect(service).toBeTruthy();
  }));
});
