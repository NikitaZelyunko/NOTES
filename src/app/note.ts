enum body_types {TEXT= 0, LIST= 1}
enum note_types {NEW= 0, FIXED= 1, ARCHIVE= 2, TRASH= 3}

export class Note {
    private id: number;
    title: string;
    note_type: number;
    body_type: number;
    body: any;
    color: string;

    constructor
    (
        id: number,
        title: string,
        note_type: number,
        body_type: number,
        body: string,
        color: string
    ) {
        this.id = id;
        this.title = title;
        this.note_type = note_type;
        this.body_type = body_type;
        this.body = body;
        this.color = color;
    }
    static fromJSON(item: Object ): Note {
        let id = 0;
        let title = '';
        let note_type: note_types = note_types.NEW;
        let body_type: body_types = body_types.TEXT;
        let body = '';
        let color = '#FFFFFF';
        if (item['id'] !== undefined) {
            id = item['id'];
          }
        if (item['title'] !== undefined) {
          title = item['title'];
        }
        if (item['note_type'] !== undefined) {
            if (note_types[item['note_type']] !== undefined) {
                note_type = item['note_type'];
            }
        }
        if (item['body_type'] !== undefined) {
            if (body_types[item['body_type']] !== undefined) {
                body_type = item['body_type'];
            }
        }
        if (item['body'] !== undefined) {
          body = item['body'];
        }
        if (item['color'] !== undefined) {
            if (item['color'].length === 7 && item['color'][0] === '#') {
                color = item['color'];
            }
        }
        return new Note(id, title, note_type, body_type, body, color);
    }

    static copyNote(note: Note) {
        return new Note(
        note.id,
        note.title,
        note.note_type,
        note.body_type,
        note.body,
        note.color
        );
    }

    static default_instance(): Note {
        return new Note(-1, '', 0, 0, '', '#FFFFFF');
    }
    getId(): number {
        return this.id;
    }
    isDefault(): boolean {
        if ( this.id === -1 ) {
                if ( this.title === '' ) {
                    if ( this.note_type === 0 ) {
                        if ( this.body_type === 0 ) {
                            if ( this.body === '' ) {
                                if ( this.color === '#FFFFFF') {
                                    return true;
                                }
                            }
                        }
                    }
                }
        }
        return false;
    }
    isArchive(): boolean {
        if (this.note_type === note_types.ARCHIVE) {
            return true;
        }
        return false;
    }
    isNew(): boolean {
        if (this.note_type === note_types.NEW) {
            return true;
        }
        return false;
    }
    isFixed(): boolean {
        if (this.note_type === note_types.FIXED) {
            return true;
        }
        return false;
    }
    isTrash(): boolean {
        if (this.note_type === note_types.FIXED) {
            return true;
        }
        return false;
    }
    toArchive() {
        this.note_type = note_types.ARCHIVE;
    }
    toNew() {
        this.note_type = note_types.NEW;
    }
    toFixed() {
        this.note_type = note_types.FIXED;
    }
    toTrash() {
        this.note_type = note_types.FIXED;
    }
    toJSON(): Object {
        return {
            id: this.id,
            title: this.title,
            note_type: this.note_type,
            body_type: this.body_type,
            body: this.body,
            color: this.color
        };
    }
}
