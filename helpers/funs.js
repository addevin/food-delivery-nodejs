
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

module.exports = {
    randomLetters:(length)=>{
      try {
        
        length = Number(length)
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
          counter += 1;
        }
        return result;
      } catch (error) {
        return 'error_detucted_'
      }
    }
    ,appEvents :myEmitter,
    
}