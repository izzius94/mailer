export abstract class Mail {
    /**
     * The mail subject
     */
    protected _subject: string
    /**
     * The mail view
     */
    protected _view: IView
    /**
     * The mail attachments
     */
    protected _attachments: IAttachment[]
    /**
     * The address to reply
     */
    protected _replyTo: string
    /**
     * The mail text
     */
    protected _text: string


    public get subject() {
        return this._subject;
    }
    
    public get view() {
        return this._view;
    }

    public get attachments() {
        return this._attachments;
    }

    public get replyTo() {
        return this._replyTo;
    }

    public get text() {
        return this._text;
    }

    /**
     * Method to build the mail template, here you can set your template config
     */
    public abstract build(): void
}

export interface IView {
    name: string
    data: {[key: string]: any}
}

export interface IAttachment {
    filename: string
    content: Buffer
    contentType?: string
}