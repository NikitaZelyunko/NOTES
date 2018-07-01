import { TestBed, inject } from '@angular/core/testing';

import { NoteStorageService } from './note-storage.service';

describe('NoteStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteStorageService]
    });
  });

  it('should be created', inject([NoteStorageService], (service: NoteStorageService) => {
    expect(service).toBeTruthy();
  }));
});
