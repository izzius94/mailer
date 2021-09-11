import * as mail from '../dist';
import {config} from 'dotenv';

const testConfig = config({path: __dirname + '/.env'});

if (testConfig.error) {
    throw testConfig.error;
}

class Template extends mail.Mail {
    public build() {
        this._subject = 'Test email 2';
        this._view = {name: 'view', data: {text: 'This is a test'}};
        this._text = 'This is a test for text based email'
        this._replyTo = 'reply1@test.it';
    }
}

const sender = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: !!process.env.MAIL_SECURE,
    auth: {
        user: 'user',
        pass: 'password'
    },
    from: {
        name: process.env.MAIL_FROM_NAME,
        address: process.env.MAIL_FROM_ADDRESS
    }
}

describe('Mailer', () => {
    it('Should send the mail without problems', function(done) {
        mail.init(sender, __dirname);
        mail.send({to: 'account@test'}, new Template()).then(res => {
            done();
        }).catch(e => {
            done(e);
        });
    });
});
