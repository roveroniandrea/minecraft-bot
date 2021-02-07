import * as chalk from 'chalk';
import express = require('express');
import StartNietzsche from './bot';

const app = express();
const serverPort = 8000;

app.listen(serverPort, () => {
	console.log(chalk.greenBright(`${new Date().toTimeString()}: Server in ascolto sulla porta ${serverPort}`));
});

app.get('', (_, res) => {
	StartNietzsche();
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send('Nietzsche è pronto all\'azione!');
});


/*
let confirmButton = document.querySelector('#confirm');
let restartButton = document.querySelector('#restart');
if(window.location.pathname === '/server/'){
	alert('Il bot si può avviare da solo!');
}
let myinterval = setInterval(() => {
  if(getComputedStyle(confirmButton).display === 'block'){
	confirmButton.click();
  }
  if(getComputedStyle(restartButton).display === 'block'){
	$.ajax('http://localhost:8000');
  }
}, 1000 * 10);
*/
