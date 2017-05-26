import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

let user_config = {
  "host": "smtp.sina.com",
  "port": 25,
  "secureConnection": true,
  // "logger": true,
  auth: {
    user: 'dnyocxbosl@sina.com',
    pass: 'qpzm1234'
  }
},
  email_config,
  user_file = './config/user.json',
  email_file = './config/email.json';

/**
 *  发件人信息
 */
try {
  fs.accessSync(user_file);
  let data = fs.readFileSync(user_file, 'utf-8');
  let user_info = JSON.parse(data);
  let auth = user_info.auth;
  if (auth) {
    let {user, pass} = auth;
    if (user && pass) {
      let host = 'smtp.' + user.slice(user.lastIndexOf('@') + 1);
      user_info.host = user_info.host || host;
      user_info.port = user_info.port || 25;
      user_info.secureConnection = user_info.secureConnection || true;
      user_config = user_info;
    }
  }
} catch (error) {
  // console.error(error);
  console.error(`发件人邮箱信息(${user_file})未找到，使用默认邮件人信息。`);
}

/**
 *  邮件信息
 */
try {
  fs.accessSync(email_file);
  let data = fs.readFileSync(email_file, 'utf-8');
  email_config = JSON.parse(data);
} catch (error) {
  // console.error(error);
  console.error(`邮件信息(${email_file})未找到，使用邮件模板。`);
}

const mail_info = {
  from: email_config && email_config.from || user_config.auth.user,
  to: email_config && email_config.to,
  subject: ` ✅  info  ✅ `,
  text: `这是一条 info 邮件，传递一些系统运行的基本信息。`,
  html: `这是一条<strong>  ✅  info  ✅  </strong>邮件，传递一些系统运行的基本信息。`
};

const mail_warn = {
  from: email_config && email_config.from || user_config.auth.user,
  to: email_config && email_config.to,
  subject: ` ⚠️  warning  ⚠️ `,
  text: `这是一条 warning 邮件，传递一些系统运行的警告信息。`,
  html: `这是一条<strong>  ⚠️  warning  ⚠️  </strong>邮件，传递一些系统运行的警告信息。`
};

const mail_error = {
  from: email_config && email_config.from || user_config.auth.user,
  to: email_config && email_config.to,
  subject: ` ❎  error  ❎ `,
  text: `这是一条 error 邮件，传递一些系统运行的错误信息。`,
  html: `这是一条<strong>  ❎  error  ❎  </strong>邮件，传递一些系统运行的错误信息。`
};

const mail_user = {
  from: email_config && email_config.from || user_config.auth.user,
  to: email_config && email_config.to,
  subject: email_config && email_config.subject,
  text: email_config && email_config.text,
  html: email_config && email_config.html
};

/**
 *
 *  发送邮件方法，返回Promise
 *
 */
const send = (to, message = '', type = 'info', file = '') => {
  if (to && typeof to === 'object') {
    type = to;
    to = null;
  } else if (message && typeof message === 'object') {
    type = message;
    message = null;
  }
  let mail_options;
  switch (type.trim()) {
    case 'info':
      mail_options = mail_info;
      break;
    case 'warn':
      mail_options = mail_warn;
      break;
    case 'error':
      mail_options = mail_error;
      break;
    case 'user':
      mail_options = mail_user;
      break;
    default:
      mail_options = mail_info;
      break;
  }
  to ? mail_options.to = to : mail_options.to;
  message ? mail_options.subject = mail_options.subject + '\r\n' + message : mail_options.subject;
  message ? mail_options.text = mail_options.text + '\r\n' + message : mail_options.text;
  message ? mail_options.html = mail_options.html + '<br>' + message : mail_options.html;
  try {
    if (file) {
      let attachments = [];
      let stat = fs.lstatSync(file);
      if (stat.isDirectory()) {
        let files = fs.readdirSync(file);
        for (let _file of files) {
          let filepath = file + '/' + _file;
          let temp = {
            filename: _file,
            content: fs.readFileSync(filepath),
            path: filepath
          }
          attachments.push(temp);
          temp = null;
        }
      } else if (stat.isFile()) {
        let temp = {
          filename: path.basename(file),
          content: fs.readFileSync(file),
          path: file
        }
        attachments.push(temp);
        temp = null;
      } else {
        console.error(`附件路径(${file})不正确。`);
      }
      mail_options.attachments = attachments;
    }
  } catch (error) {
    console.error(error);
    console.error(`附件路径(${file})不正确。`);
  }

  return new Promise((resolve, reject) => {
    if (!mail_options || !mail_options.to) {
      reject({
        id: 'error',
        message: '没有传递收件人信息。'
      })
    }
    const transporter = nodemailer.createTransport(user_config);
    transporter.sendMail(mail_options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        let result = {
          id: info.messageId,
          message: info.response
        }
        resolve(result);
      }
    });
  })
}

export { send };
