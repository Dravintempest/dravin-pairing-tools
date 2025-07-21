const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const pino = require("pino");

// Perbaikan sleep function
const sleep = (ms, variation = 0) => new Promise(resolve => {
    setTimeout(resolve, ms + (variation ? Math.floor(Math.random() * variation) : 0));
});

// Perbaikan question function untuk menghindari bug input
const question = (text) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });
        
        // Membersihkan line sebelum menampilkan prompt
        process.stdout.write('\x1B[K');
        rl.question(text, (ans) => {
            rl.close();
            resolve(ans);
        });
    });
};

// Tetap mempertahankan efek ketik tapi dioptimasi
const typeEffect = async (text, delay = 20) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

// Banner tetap sama tapi dioptimasi
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

// Koneksi tetap sama
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

// Fungsi utama dengan perbaikan bug input
async function startSpam() {
    const conn = await initConnection();
    let lastNumber = '';

    while (true) { 
        console.log(chalk.cyan("\n💡 Masukkan nomor target dan jumlah spam"));
        
        // Perbaikan prompt nomor
        let nomor = '';
        while (!/^62\d{9,13}$/.test(nomor)) {
            nomor = await question(
                chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                chalk.yellow('Nomor Target (62xxxxxxxxxx): ')
            );
            
            if (!/^62\d{9,13}$/.test(nomor)) {
                // Membersihkan line sebelum menampilkan error
                process.stdout.moveCursor(0, -1);
                process.stdout.clearLine();
                console.log(chalk.red("❌ Format nomor tidak valid. Contoh: 6281234567890"));
            }
        }
        lastNumber = nomor;

        // Perbaikan prompt jumlah
        let jumlah = 0;
        while (isNaN(jumlah) || jumlah < 1 || jumlah > 30) {
            const input = await question(
                chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                chalk.yellow("Jumlah Spam (1-30): ")
            );
            
            jumlah = parseInt(input);
            if (isNaN(jumlah) || jumlah < 1 || jumlah > 30) {
                process.stdout.moveCursor(0, -1);
                process.stdout.clearLine();
                console.log(chalk.red("❌ Jumlah harus antara 1 dan 30"));
            }
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
                
                // Tetap mempertahankan delay asli
                await sleep(5000, 5000);
            } catch (err) {
                console.log(chalk.red(`[X] ${i + 1}/${jumlah} => Gagal: ${err.message}`));
                if (err.message.includes("rate limit") || err.message.includes("too many")) {
                    console.log(chalk.yellow("⚠️ Terlalu banyak permintaan, menunggu 45 detik..."));
                    await sleep(45000);
                } else {
                    await sleep(10000, 5000);
                }
            }
        }

        console.log(chalk.cyan("\n📊 Ringkasan"));
        console.log(chalk.cyan(`├─ Nomor : ${chalk.white(nomor)}`));
        console.log(chalk.cyan(`├─ Total : ${chalk.white(jumlah)}`));
        console.log(chalk.cyan(`├─ Sukses : ${chalk.green(sukses)}`));
        console.log(chalk.cyan(`└─ Gagal : ${chalk.red(jumlah - sukses)}`));

        const ulang = await question(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.magenta("🔁 Ingin spam lagi? (y/n): ")
        );
        
        if (ulang.toLowerCase() !== "y") break;
    }

    console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Tools!"));
    process.exit(0);
}

(async () => {
    await showBanner();
    await sleep(1000);
    await typeEffect(chalk.yellow("[⌛] Menyiapkan koneksi..."));
    await sleep(1500);
    await startSpam();
})();
