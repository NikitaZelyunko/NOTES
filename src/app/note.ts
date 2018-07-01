enum body_types {TEXT= 0, LIST= 1}
enum note_types {NEW= 0, FIXED= 1, ARCHIVE= 2}

export class Note {
    id;
    title;
    note_type;
    body_type;
    body;

    constructor
    (
        id: number,
        title: string,
        note_type: note_types,
        body_type: body_types,
        body: string
    ) {
        this.id = id;
        this.title = title;
        this.note_type = note_type;
        this.body_type = body_type;
        this.body = body;
    }

    static fromJSON(id: number, item: object ): Note {
        let title = '';
        let note_type: note_types = note_types.NEW;
        let body_type: body_types = body_types.TEXT;
        let body = '';
        if (item['title'] !== undefined) {
          title = item['title'];
        }
        if (item['note_type'] !== undefined) {
            if (note_type[item['note_type']] !== undefined) {
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
        return new Note(id, title, note_type, body_type, body);
    }

    static default_instance(): Note {
        return new Note(-1, '', 0, 0, '');
    }
    isDefault(): boolean {
        if ( this.id === -1 ) {
            if ( this.title === '' ) {
                if ( this.note_type === 0 ) {
                    if ( this.body_type === 0 ) {
                        if ( this.body === '' ) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    toJSON(): Object {
        return {
            id: this.id,
            object: {
                title: this.title,
                note_type: this.note_type,
                body_type: this.body_type,
                body: this.body
            }
        };
    }
}
