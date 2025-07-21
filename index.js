const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const pino = require("pino");
const { exec } = require('child_process');

// Utility functions
const sleep = (ms, variation = 0) => new Promise(resolve => {
    setTimeout(resolve, ms + (variation ? Math.floor(Math.random() * variation) : 0));
});

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout,
        terminal: true
    });
    return new Promise(resolve => {
        process.stdout.write('\x1B[K');
        rl.question(text, ans => {
            rl.close();
            resolve(ans);
        });
    });
};

const typeEffect = async (text, delay = 20) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN", { font: "ANSI Shadow" });
    console.log(gradient.instagram.multiline(banner));
    await typeEffect(chalk.magenta("[⚙️] WhatsApp Spam Tools Suite - DRAVIN Edition"));
    await typeEffect(chalk.cyan("═════════════════════════════════════════════════════"));
    await typeEffect(chalk.green("• Gunakan hanya untuk edukasi, tanggung sendiri risikonya"));
    await typeEffect(chalk.yellow("• Target hanya berlaku untuk nomor dengan kode negara 62"));
    await typeEffect(chalk.cyan("═════════════════════════════════════════════════════\n"));
};

const showMenu = async () => {
    console.log(chalk.cyan("\n🛠️ Menu Utama DRAVIN Tools"));
    console.log(chalk.cyan("════════════════════════════════════════"));
    console.log(chalk.cyan("1. ") + chalk.yellow("Spam Pairing WhatsApp"));
    console.log(chalk.cyan("2. ") + chalk.yellow("Spam Call WhatsApp"));
    console.log(chalk.cyan("3. ") + chalk.red("Keluar"));
    console.log(chalk.cyan("════════════════════════════════════════\n"));
};

const runTool = async (toolName) => {
    return new Promise((resolve, reject) => {
        exec(`node ${toolName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error running ${toolName}:`), error);
                reject(error);
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
};

(async () => {
    await showBanner();
    await sleep(1000);

    while (true) {
        await showMenu();
        
        const choice = await question(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.yellow('Pilih menu (1-3): ')
        );

        switch (choice) {
            case '1':
                console.log(chalk.green("\n🚀 Memulai DRAVIN Pairing Spam..."));
                await sleep(1000);
                try {
                    await runTool('dravin-pairing.js');
                } catch (err) {
                    console.log(chalk.red("Gagal menjalankan pairing spam, kembali ke menu utama..."));
                    await sleep(2000);
                }
                break;
            case '2':
                console.log(chalk.green("\n📞 Memulai DRAVIN Call Spam..."));
                await sleep(1000);
                try {
                    await runTool('dravin-call.js');
                } catch (err) {
                    console.log(chalk.red("Gagal menjalankan call spam, kembali ke menu utama..."));
                    await sleep(2000);
                }
                break;
            case '3':
                console.log(chalk.green("\n✨ Terima kasih telah menggunakan DRAVIN Tools!"));
                process.exit(0);
            default:
                console.log(chalk.red("\n❌ Pilihan tidak valid! Silakan pilih 1-3"));
                await sleep(1000);
        }
    }
})();
