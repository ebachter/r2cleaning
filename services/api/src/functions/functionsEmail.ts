import {ses, SendEmailCommand} from '@remrob/aws';

const createSendEmailCommand = (
  subject: string,
  recepients: string[],
  bodyHtml?: string,
  bodyText?: string,
) => {
  return new SendEmailCommand({
    Source: Bun.env.SES_NOREPLY_EMAIL || '',
    Destination: {
      ToAddresses: recepients, // email
    },
    // subject: 'Registration',
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          // Data: text[lang]
          Data: bodyText,
        },
        Html: {
          Charset: 'UTF-8',
          // Data: text[lang]
          Data: bodyHtml,
        },
      },
    },
  });
};

interface INameToValueMap {
  en: string;
  de: string;
}

export const sendEmailForReset = async (
  email: string,
  sidForEmail: string,
  lang: string,
) => {
  if (!email || !sidForEmail || !lang) {
    throw new Error('sendEmailForReset vars undefined');
  }
  try {
    const text: INameToValueMap = {
      en: `Hello,\n\nto reset your password please follow the link:\n${Bun.env.FRONTEND_ORIGIN}/reset/${sidForEmail}\n\nREMROB Team`,
      de: `Hallo,\n\num Ihr Passwort zurückzusetzen, klicken Sie bitte auf den folgenden Link:\n${Bun.env.FRONTEND_ORIGIN}/reset/${sidForEmail}\n\nREMROB Team`,
    };
    const html = {
      en: `
            Hello,<br/><br/>
            to reset your password please follow the link:<br/>
            <a href="${Bun.env.FRONTEND_ORIGIN}/reset/${sidForEmail}">Reset password</a><br/><br/>
            REMROB Team`,
      de: `
            Hallo,<br/><br/>
            um Ihr Passwort zurückzusetzen, klicken Sie bitte auf den folgenden Link:<br/>
            <a href="${Bun.env.FRONTEND_ORIGIN}/reset/${sidForEmail}">Passwort zurücksetzen</a><br/><br/>
            REMROB Team
          `,
    };

    let subject = '';
    let textStr = '';
    let htmlStr = '';
    if (lang === 'de') {
      subject = 'Passwort zurücksetzen';
      textStr = text.de;
      htmlStr = html.de;
    } else if (lang === 'en' || !lang) {
      subject = 'Reset password';
      textStr = text.en;
      htmlStr = html.en;
    }

    const sendCmd = createSendEmailCommand(subject, [email], htmlStr, textStr);
    await ses.send(sendCmd);
  } catch (err) {
    // console.log("Error:", err)
    throw err;
  }
};

export const sendEmailForSignup = async (
  email: string,
  sidForEmail: string,
  lang: string,
) => {
  if (!email || !sidForEmail || !lang) {
    throw new Error('sendEmailForSignup vars undefined');
  }
  try {
    const subject: any = {
      en: 'Confirm registration',
      de: 'Registrierung bestätigen',
    };
    const text = {
      en: `Hello,\n\nto complete your registration please follow the link: \n${Bun.env.FRONTEND_ORIGIN}/signup/${sidForEmail}\n\nREMROB Team`,
      de: `Hallo,\n\num den Registierungsprozess abzuschließen, klicken Sie auf den folgenden Link:\nn${Bun.env.FRONTEND_ORIGIN}/signup/${sidForEmail}\n\nREMROB Team`,
    };

    const html = {
      en: `
            Hello,<br/><br/>
            to complete your registration please follow the link:<br/>
            <a href="${Bun.env.FRONTEND_ORIGIN}/signup/${sidForEmail}">Confirm account</a><br/><br/>
            REMROB Team`,
      de: `
            Hallo,<br/><br/>
            uum den Registierungsprozess abzuschließen, klicken Sie auf den folgenden Link:<br/>
            <a href="${Bun.env.FRONTEND_ORIGIN}/signup/${sidForEmail}">Account bestätigen</a><br/><br/>
            REMROB Team
          `,
    };

    let textStr = '';
    let htmlStr = '';
    if (lang === 'de') {
      textStr = text.de;
      htmlStr = html.de;
    } else if (lang === 'en' || !lang) {
      textStr = text.en;
      htmlStr = html.en;
    }

    const sendCmd = createSendEmailCommand(subject, [email], htmlStr, textStr);
    await ses.send(sendCmd);
  } catch (err) {
    console.log('sendEmail Error:', err);
    throw err;
  }
};
