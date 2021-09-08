import * as mailer from 'nodemailer';
import {Mail, IAttachment, IView} from './Mail';
import {join} from 'path';
import {renderFile} from 'ejs';

export default class {
    private readonly _message: IMessage
    private readonly _mail: Mail
    private readonly _sender: ISender
    private readonly _viewPath: string

    constructor(sender: ISender, recipients: IRecipients, mail: Mail, viewPath: string = null) {
        mail.build();
        this._mail = mail;
        this._sender = sender;
        this._viewPath = viewPath

        console.log(this._mail)
        this._message = {
            from: this._sender.from,
            ...recipients,
            subject: this._mail.subject,
            attachments: this._mail.attachments,
            replyTo: this._mail.replyTo,
            text: this._mail.text
        }
    }

    public send(): Promise<void> {
        if (this._viewPath && this._mail.view) {
            return new Promise((resolve, reject) => {
                const path = join(this._viewPath, this._mail.view.name + '.ejs')
                renderFile(path, this._mail.view.data, {}, (err, html) => {
                    if (err) {
                        console.log('qua');
                        reject(err);
                    } else {
                        this._message.html = html;
                        this.dispatch().then((response) => {
                            console.log('passo di qui')
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