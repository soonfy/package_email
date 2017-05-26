# email-node

## 配置文件

### 邮件发送人配置
> 配置在 **./config/user.json** 文件中  
文件内容格式  
  ```
  {
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
    "text": text,
    "html": html
  }
  ```

## API 接口

### send(to)

### send(to, message)

### send(to, message, template)
> template - 内置模板：info, warn, error, user  

### send(to, message, template, filepath)
> filepath - 文件路径：文件夹路径, 文件名路径  
