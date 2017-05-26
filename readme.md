# email-node

## 配置文件

### 邮件发送人配置
> 配置在 **./config/user.json** 文件中  
文件内容格式  
  ```
  {
    "host": host,
    "auth": {
      "user": address,
      "pass": pass
    }
  }
  ```

### 邮件模板配置
> 配置在 **./config/email.json** 文件中  
文件内容格式  
  ```
  {
    "from": from,
    "to": to,
    "subject": subject,
    "html": html
  }
  ```

## API 接口
异步发送，返回Promise对象。

### send(to)

### send(to, message)

### send(to, message, template)
> template - 内置模板：info, warn, error, user  

### send(to, message, template, filepath)
> filepath - 文件路径：文件夹路径, 文件名路径  

## 示例
1. 发件人邮箱要开启 **POP3/SMTP/IMAP** 服务，一般是在 邮箱设置 功能中，并且记录下邮箱的 **服务器SMTP地址host**，以备配置发件人模板  
2. 在 **./config/user.json** 文件中配置发件人模板，**host** 和 **auth**  
3. 在 **./config/email.json** 文件中配置邮件模板，**from, to, subject, html**  
4. 发送邮件  
  ```
  const emailSender = require('email-node');
  emailSender.send(to).then(data => {
    console.log(data);
  }).catch(error => {
    console.error(error);
  })
  ```
