import { createBot } from 'mineflayer';

console.log('Inizializzo il bot...');
let timer;

const bot = createBot({
  host: 'DestinyUpdating.aternos.me',
  username: 'Nietzsche',
  port: 22692,
  version: '1.16.4',
  checkTimeoutInterval: 60 * 1000,
});

bot.on('chat', function (username, message) {
  if (username === bot.username) return;
  const lowercase = message.toLowerCase();
  if (lowercase.startsWith('bot')) {
    let command = lowercase.slice(3);
    bot.chat(command);
  }
});

bot.on('login', () => {
  console.log('Login effettuato!');
  timer = setInterval(() => {
    bot.setControlState('sneak', true);
  }, 1000 * 10);
});

bot.on('end', () => {
  console.log('Disconnesso dal server!');
  clearInterval(timer);
});

// Log errors and kick reasons:
bot.on('kicked', (reason, loggedIn) => {
  if (loggedIn) {
    console.log('Il bot è stato kickato!', reason);
  }
  else {
    console.log('Il bot è stato kickato durante il login!', reason);
  }
});

bot.on('error', (err) => console.log('Errore!', err));
