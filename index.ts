/**
 * Mailer 
 */
import {Mail} from './lib/Mail';
import * as Mailer from './lib/Mailer';
import {existsSync} from 'fs';

let sender: Mailer.ISender;
let viewPath: string;

export function send(recipients: Mailer.IRecipients, template: Mail) {
    return new Promise((resolve, reject) => {
        if (sender) {
            const m = new Mailer.default(sender, recipients, template, viewPath);
            m.send().then((response) => {
                resolve(response);
            }).catch(e => {
                reject(e);
            })
        } else {
            reject('No sender defined')
        }
    });
}

export function init(params: Mailer.ISender, path: string = null) {
    sender = params;
    viewPath = path;

    if (viewPath && !existsSync(viewPath)) {
        throw('View path doesn\'t exists!');
    }
}

export {Mail};