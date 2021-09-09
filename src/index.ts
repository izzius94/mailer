/**
 * ok va bene!
 * @module
 */
import {Mail} from './lib/Mail';
import * as Mailer from './lib/Mailer';
import {existsSync} from 'fs';

let _sender: Mailer.ISender;
let _viewPath: string;

/**
 * Function to init the module
 * @param sender The sender to use for sending emails
 * @param viewPath The path containing the views during the render
 */
export function init(sender: Mailer.ISender, viewPath?: string) {
    _sender = sender;
    _viewPath = viewPath;

    if (_viewPath && !existsSync(_viewPath)) {
        throw('View path doesn\'t exists!');
    }
}

/**
 * Send the mail
 * @param recipients The recipients of the mail
 * @param template The template to use to generate the mail content
 * @returns Return a promise based result of the operation
 */
export function send(recipients: Mailer.IRecipients, template: Mail) {
    return new Promise((resolve, reject) => {
        if (_sender) {
            const m = new Mailer.default(_sender, recipients, template, _viewPath);
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

export {Mail};