export abstract class Mail {
    /** The mail subject */
    protected _subject: string
    /** The mail view */
    protected _view: IView
    /** The mail attachments */
    protected _attachments: IAttachment[]
    /** The address to reply */
    protected _replyTo: string
    /** The mail text */
    protected _text: string

    public get subject() {
        return this._subject
    }
    
    public get view() {
        return this._view
    }

    public get attachments() {
        return this._attachments
    }

    public get replyTo() {
        return this._replyTo
    }

    public get text() {
        return this._text
    }

    /**
     * Method to build the mail template, here you can set your template config
     */
    public abstract build(): void
}

/**
 * Describe the structure of the view used by the template
 */
export interface IView {
    /** The name of the the view without the extension */
    name: string
    /** The data to pass to the view */
    data: {[key: string]: any}
}

/**
 * Describe the structure of an attachment
 */
export interface IAttachment {
    /** The name of the attachment */
    filename: string
    /** The content of the attachment */
    content: Buffer
    /** The content type of the attachment */
    contentType?: string
}
