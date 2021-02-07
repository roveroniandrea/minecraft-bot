import { createBot } from 'mineflayer';
import { Movements, pathfinder, Pathfinder, goals } from 'mineflayer-pathfinder';
import * as chalk from 'chalk';
import MinecraftData = require('minecraft-data');

/** Versione server minecraft */
const serverVersion = '1.16.4';
/** minecraft data (blocks etc) */
const minecraftData = MinecraftData(serverVersion);

/** Some stupid bot responses */
const botResponses: Array<(name: string) => string> = [
	(name) => `Scusa ${name}, sono impegnato a girare per i tappeti arancioni`,
	(name) => `Che c'è ${name}?`,
	() => `Heilà`,
	(name) => `Dio è morto! L'hai killato tu, ${name}?`,
	() => `Platone chi legge`,
	(name) => `${name}, è un piacere sentirti!`,
	() => `I miei baffoni sono belli quasi quanto le mie teorie filosofiche`,
	() => `Lo sapevi che mi metto a piangere se maltrattano i cavalli?`,
	() => `Sto pensando di iscrivermi ad informatica...`,
	() => `Il rosso è l'impostore!`,
	(name) => `Hey ${name}, vuoi che ti parli di Zarathustra?`,
	() => `Adoro Star Wars`,
	() => `Cor-nietzsche al tuo servizio!`,
	(name) => `Fe-nietzsche ti saluta, ${name}!`,
];

let started = false;
/** Function to start Nietzsche */
export default function StartNietzsche() {
	if (started) {
		return;
	}
	started = true;
	console.log(chalk.yellow(`${new Date().toTimeString()}: Inizializzo il bot...`));

	/** Nietzsche!! */
	const bot = createBot({
		host: 'DestinyUpdating.aternos.me',
		username: 'Nietzsche',
		port: 22692,
		version: serverVersion,
		checkTimeoutInterval: 60 * 1000,
	});

	//Loading pathfinder plugin
	bot.loadPlugin(pathfinder);

	bot.on('chat', function (username, message) {
		if (username === bot.username) return;
		const lowercase = message.toLowerCase();
		// Accepting only chats starting with 'bot'
		if (lowercase.startsWith('bot')) {
			// Sensing a random response
			const chosen = botResponses[Math.floor(Math.random() * botResponses.length)](username);
			bot.chat(chosen);
		}
	});

	bot.on('login', () => {
		console.log(chalk.greenBright(`${new Date().toTimeString()}: Login effettuato!`));
	});

	bot.on('spawn', () => {
		startJob(bot);
	});

	bot.on('end', () => {
		console.log(chalk.yellow(`${new Date().toTimeString()}: Disconnesso dal server!`));
	});

	// Log errors and kick reasons:
	bot.on('kicked', (reason, loggedIn) => {
		if (loggedIn) {
			console.log(chalk.redBright(`${new Date().toTimeString()}: Il bot è stato kickato!`), reason);
		} else {
			console.log(chalk.redBright(`${new Date().toTimeString()}: Il bot è stato kickato durante il login!`), reason);
		}
	});

	bot.on('error', (err) => console.log(chalk.redBright(`${new Date().toTimeString()}: Errore!`), err));

	bot.on('playerJoined', (player) => {
		if (player.username !== bot.username) {
			bot.chat(`Heilà ${player.displayName}!`);
		}
	});
}

function startJob(bot) {
	//Setting gamemode creative is better
	if (bot.player.gamemode != 1) {
		console.log(chalk.yellow(`${new Date().toTimeString()}: Bot settato in creativa`));
		bot.chat(`/gamemode creative`);
		bot.chat('Ho provato a settarmi in creativa, controllate per favore :)');
	}

	/** Array of matching objects */
	const tappeti = bot.findBlocks({
		matching: minecraftData.blocksByName.orange_carpet.id,
		count: 5,
	});

	/** Objects to pathfind */
	const percorso = tappeti.map((block) => new goals.GoalBlock((block as any).x, (block as any).y, (block as any).z));

	if (percorso.length > 0) {
		console.log(chalk.greenBright(`${new Date().toTimeString()}: Ho trovato ${percorso.length} tappeti`));
		bot.chat(`Ho trovato ${percorso.length} tappeti`);
		const movements = new Movements(bot, minecraftData);
		movements.canDig = false;
		movements.scafoldingBlocks = [];
		((bot as any).pathfinder as Pathfinder).setMovements(movements);

		// Selecting random goal to reach
		setInterval(() => {
			const chosen = percorso[Math.floor(Math.random() * percorso.length)];
			((bot as any).pathfinder as Pathfinder).setGoal(chosen);
		}, 10000);
	} else {
		console.log(chalk.redBright(`${new Date().toTimeString()}: Nessun tappeto trovato`));
		bot.chat('Non ho trovato tappeti arancioni. Adoro i tappeti arancioni!');
		setTimeout(() => {
			console.log(chalk.redBright(`${new Date().toTimeString()}: Riprovo ricerca tappeti`));
			bot.chat('Riprovo ricerca tappeti');
			startJob(bot);
		}, 5000);
	}
}
