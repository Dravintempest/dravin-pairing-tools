const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const pino = require("pino");

// Updated spinner style
const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// Improved sleep with new spinner
const sleep = (ms, variation = 0) => {
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${chalk.yellow(spinner[i++ % spinner.length])} Loading...`);
    }, 100);
    
    return new Promise(resolve => {
        setTimeout(() => {
            clearInterval(interval);
            process.stdout.write('\r');
            resolve();
        }, ms + (variation ? Math.floor(Math.random() * variation) : 0));
    });
};

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(text, ans => {
        rl.close();
        resolve(ans);
    }));
};

const typeEffect = async (text, delay = 20) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

const formatPhoneNumber = (number) => {
    // Format: +62 889-292-××× (shows first 6 digits, masks the rest)
    const cleaned = number.replace(/^62/, '');
    const visiblePart = cleaned.slice(0, 6);
    const maskedPart = '×'.repeat(Math.max(0, cleaned.length - 6));
    return `+62 ${visiblePart.slice(0, 3)}-${visiblePart.slice(3, 6)}-${maskedPart}`;
};

const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN", { font: "ANSI Shadow" });
    console.log(gradient.instagram.multiline(banner));
    await typeEffect(chalk.magenta("╔════════════════════════════════════════════════╗"));
    await typeEffect(chalk.magenta("║    WhatsApp Pairing Spam Tools - DRAVIN     ║"));
    await typeEffect(chalk.magenta("╠════════════════════════════════════════════════╣"));
    await typeEffect(chalk.green("║ • Gunakan hanya untuk edukasi                ║"));
    await typeEffect(chalk.yellow("║ • Target hanya untuk nomor dengan kode 62   ║"));
    await typeEffect(chalk.magenta("╚════════════════════════════════════════════════╝\n"));
};

async function initConnection() {
    const { state } = await useMultiFileAuthState('./dravin_session');
    return makeWASocket({
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
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });
}

async function startSpam() {
    const conn = await initConnection();
    let lastNumber = '';

    while (true) {
        console.log(chalk.cyan("\n╔════════════════════════════════════════════════╗"));
        console.log(chalk.cyan("║              MASUKKAN DETAIL SPAM             ║"));
        console.log(chalk.cyan("╚════════════════════════════════════════════════╝"));

        let nomor = '';
        if (lastNumber) {
            const formattedLastNumber = formatPhoneNumber(lastNumber);
            const useLast = await question(
                chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                chalk.yellow(`Gunakan nomor sebelumnya (${formattedLastNumber})? (y/n): `)
            );
            if (useLast.toLowerCase() === 'y') {
                nomor = lastNumber;
                console.log(chalk.green(` Menggunakan nomor: ${formattedLastNumber}`));
            }
        }

        if (!nomor) {
            nomor = await question(
                chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                chalk.yellow("Nomor Target (628xxxxxxxxxx): ")
            );
            
            if (!/^62\d{9,13}$/.test(nomor)) {
                console.log(chalk.red("\n╔════════════════════════════════════════════════╗"));
                console.log(chalk.red("║      Format nomor tidak valid! Contoh: 628... ║"));
                console.log(chalk.red("╚════════════════════════════════════════════════╝"));
                continue;
            }
            lastNumber = nomor;
        }

        const jumlah = parseInt(await question(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.yellow("Jumlah Spam (1-30): ")
        ));
        
        if (isNaN(jumlah) || jumlah < 1 || jumlah > 30) {
            console.log(chalk.red("\n╔════════════════════════════════════════════════╗"));
            console.log(chalk.red("║        Jumlah harus antara 1 dan 30!         ║"));
            console.log(chalk.red("╚════════════════════════════════════════════════╝"));
            continue;
        }

        const formattedNumber = formatPhoneNumber(nomor);
        console.log(chalk.green("\n╔════════════════════════════════════════════════╗"));
        console.log(chalk.green(`║  Memulai spam ke ${formattedNumber} sebanyak ${jumlah}x...    ║`));
        console.log(chalk.green("╚════════════════════════════════════════════════╝"));
        
        let sukses = 0;
        const startTime = Date.now();

        for (let i = 0; i < jumlah; i++) {
            try {
                await sleep(100, 0); // Show spinner
                const start = Date.now();
                let kode = await conn.requestPairingCode(nomor);
                kode = kode.match(/.{1,4}/g).join('-');
                const waktu = ((Date.now() - start) / 1000).toFixed(2);

                console.log(chalk.green(`\n[✓] ${i + 1}/${jumlah}`));
                console.log(chalk.cyan(` ├─ Kode: ${chalk.yellow(kode)}`));
                console.log(chalk.cyan(` └─ Waktu: ${waktu}s`));
                sukses++;
                
                // Random delay between 3-6 seconds
                await sleep(3000, 3000);
            } catch (err) {
                console.log(chalk.red(`\n[X] ${i + 1}/${jumlah}`));
                console.log(chalk.yellow(` └─ Gagal: ${err.message.split('\n')[0]}`));
                
                if (err.message.includes("rate limit") || err.message.includes("too many")) {
                    console.log(chalk.yellow("\n╔════════════════════════════════════════════════╗"));
                    console.log(chalk.yellow("║   Terlalu banyak permintaan, tunggu 30 detik  ║"));
                    console.log(chalk.yellow("╚════════════════════════════════════════════════╝"));
                    await sleep(30000);
                } else {
                    await sleep(5000, 3000);
                }
            }
        }

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(chalk.cyan("\n╔════════════════════════════════════════════════╗"));
        console.log(chalk.cyan("║                  HASIL SPAM                   ║"));
        console.log(chalk.cyan("╠════════════════════════════════════════════════╣"));
        console.log(chalk.cyan(`║ • Nomor   : ${chalk.white(formattedNumber)}`));
        console.log(chalk.cyan(`║ • Total   : ${chalk.white(jumlah)}`));
        console.log(chalk.cyan(`║ • Sukses  : ${chalk.green(sukses)}`));
        console.log(chalk.cyan(`║ • Gagal   : ${chalk.red(jumlah - sukses)}`));
        console.log(chalk.cyan(`║ • Durasi  : ${chalk.yellow(totalTime + 's')}`));
        console.log(chalk.cyan("╚════════════════════════════════════════════════╝"));

        const ulang = await question(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.magenta("Lanjutkan spam? (y/n): ")
        );
        if (ulang.toLowerCase() !== 'y') break;
    }

    console.log(chalk.green("\n╔════════════════════════════════════════════════╗"));
    console.log(chalk.green("║  Terima kasih telah menggunakan Dravin Tools!  ║"));
    console.log(chalk.green("╚════════════════════════════════════════════════╝"));
    process.exit(0);
}

(async () => {
    await showBanner();
    await sleep(1000);
    await typeEffect(chalk.yellow("Menyiapkan koneksi..."));
    await sleep(1500);
    await startSpam();
})();
