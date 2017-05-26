import * as sender from './index';

sender.send('soonfy@163.com').then(data => {
  console.log(data);
}).catch(error => {
  console.error(error);
})