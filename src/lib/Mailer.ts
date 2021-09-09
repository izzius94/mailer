import * as mailer from 'nodemailer';
import {Mail, IAttachment} from './Mail';
import {join} from 'path';
import {renderFile} from 'ejs';

/**
 * Class to interract with nodemailer
 */
export default class {
    /** The message to sent */
    private readonly _message: IMessage
    /** The mail template */
    private readonly _mail: Mail
    /** The sender used by the transporter */
    private readonly _sender: ISender
    /** The path to the views used by ejs */
    private readonly _viewPath: string

    /**
     * 
     * @param sender The sender used by the transporter
     * @param recipients The recipients of the mail
     * @param mail The mail template
     * @param viewPath The path to the views used by ejs
     */
    constructor(sender: ISender, recipients: IRecipients, mail: Mail, viewPath: string = null) {
        mail.build();
        this._mail = mail;
        this._sender = sender;
        this._viewPath = viewPath

        this._message = {
            from: this._sender.from,
            ...recipients,
            subject: this._mail.subject,
            attachments: this._mail.attachments,
            replyTo: this._mail.replyTo,
            text: this._mail.text
        }
    }

    /**
     * Method to send the mail, if in the mail template is defined a view it will use ejs to compile the
     * html code of the mail before actually sending the mail
     * @returns The reselt of the send
     */
    public send(): Promise<any> {
        if (this._viewPath && this._mail.view) {
            return new Promise((resolve, reject) => {
                const path = join(this._viewPath, this._mail.view.name + '.ejs')
                renderFile(path, this._mail.view.data, {}, (err, html) => {
                    if (err) {
                        reject(err);
                    } else {
                        this._message.html = html;
                        this.dispatch().then((response) => {
                            resolve(response)
                        }).catch(e => {
                            reject(e);
                        })
                    }
                });
            });
        } else {
            return this.dispatch();
        }
    }

    /**
     * Method that actually send the mail after creating the transporter
     * @returns 
     */
    private dispatch(): Promise<any> {
        const transport = mailer.createTransport({...this._sender});

        return new Promise((resolve, reject) => {
            transport.sendMail(this._message).then(res => {
                resolve(res);
            }).catch(e => {
                reject(e);
            })
        });
    }
}

interface IMessage extends IRecipients {
    from: string | {
        address: string
        name?: string
    },
    subject?: string
    html?: string
    text?: string
    attachments?: IAttachment[]
    replyTo?: string
}

export interface IRecipients {
    to: string | string[]
    cc?: string | string[]
    bcc?:string | string[]
}

export interface ISender{
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
    from?: {
        address: string
        name?: string
    }
}