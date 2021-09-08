import {Mail} from '../lib/Mail';
import * as mail from '..';
import {readFileSync} from 'fs';

class Template extends Mail {
    public build() {
        this._subject = 'Test email 2';
        this._view = {name: 'view', data: {text: 'This is a test'}};
        this._text = 'This is a test for text based email'
        this._replyTo = 'reply1@test.it';
        this._attachments = [{
            filename: 'image',
            content: readFileSync('/home/izzius/yarn-error.log')
        }]
    }
}

const sender = {
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
        user: null,
        pass: null
    },
    from: {
        name: 'Sender',
        address: 'sender@test'
    }
}

mail.init(sender, __dirname);

mail.send({to: 'account@test'}, new Template()).then(res => {
    console.log(res);
}).catch(e => {
    console.log(e);
});

