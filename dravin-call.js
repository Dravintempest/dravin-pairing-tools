const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const pino = require("pino");

// Utility functions
const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(text, ans => {
        rl.close();
        resolve(ans);
    }));
};

const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN CALL", { font: "ANSI Shadow" });
    console.log(gradient.instagram.multiline(banner));
    console.log(chalk.magenta("[📞] WhatsApp Call Spam Tools - DRAVIN Edition"));
    console.log(chalk.cyan("═════════════════════════════════════════════════════"));
    console.log(chalk.red("⚠️  PERINGATAN:"));
    console.log(chalk.yellow("• Tools ini bisa menyebabkan akun Anda diblokir oleh WhatsApp"));
    console.log(chalk.yellow("• Gunakan hanya untuk tujuan edukasi"));
    console.log(chalk.yellow("• Bertanggung jawab atas penggunaan tools ini"));
    console.log(chalk.cyan("═════════════════════════════════════════════════════\n"));
};

async function initConnection() {
    const { state } = await useMultiFileAuthState('./dravin_call_session');
    return makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        auth: state,
        browser: ["Dravin Call", "Chrome", "120.0.0.1"]
    });
}

async function makeCall(conn, jid) {
    try {
        await conn.relayMessage(jid, {
            call: {
                callCreator: {
                    jid: conn.user.id
                },
                callId: Math.random().toString(36).substring(2, 15),
                fromMe: true
            }
        }, { messageId: Math.random().toString(36).substring(2, 15) });
        return true;
    } catch (error) {
        console.log(chalk.red(`Error: ${error.message}`));
        return false;
    }
}

async function startSpam() {
    const conn = await initConnection();
    let lastNumber = '';

    conn.ev.on('connection.update', (update) => {
        if (update.qr) {
            console.log(chalk.yellow("Scan QR Code di atas untuk login..."));
        }
        if (update.connection === 'open') {
            console.log(chalk.green("Berhasil terhubung ke WhatsApp!"));
        }
    });

    while (true) {
        let nomor = '';
        if (!lastNumber) {
            console.log(chalk.cyan("\n💡 Masukkan nomor target dan jumlah spam call"));
            nomor = await question(
                chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('CALL]') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                chalk.yellow('Nomor Target (62xxxxxxxxxx): ')
            );
            
            if (!/^62\d{9,13}$/.test(nomor)) {
                console.log(chalk.red("❌ Format nomor tidak valid. Contoh: 6281234567890"));
                continue;
            }
            lastNumber = nomor;
        } else {
            const reuse = await question(
                chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('CALL]') + '\n' +
                chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                chalk.yellow(`Gunakan nomor sebelumnya ${lastNumber}? (y/n): `)
            );
            
            if (reuse.toLowerCase() === 'y') {
                nomor = lastNumber;
            } else {
                nomor = await question(
                    chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('CALL]') + '\n' +
                    chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
                    chalk.yellow('Nomor Target (62xxxxxxxxxx): ')
                );
                
                if (!/^62\d{9,13}$/.test(nomor)) {
                    console.log(chalk.red("❌ Format nomor tidak valid. Contoh: 6281234567890"));
                    continue;
                }
                lastNumber = nomor;
            }
        }

        const jumlah = parseInt(await question(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('CALL]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.yellow("Jumlah Spam Call (1-10): ")
        ));
        
        if (isNaN(jumlah) || jumlah < 1 || jumlah > 10) {
            console.log(chalk.red("❌ Jumlah harus antara 1 dan 10"));
            continue;
        }

        const jid = nomor + '@s.whatsapp.net';
        console.log(chalk.green(`\n🚀 Memulai spam call ke ${nomor} sebanyak ${jumlah}x...\n`));
        let sukses = 0;
        
        for (let i = 0; i < jumlah; i++) {
            const result = await makeCall(conn, jid);
            if (result) {
                console.log(chalk.green(`[✓] ${i + 1}/${jumlah} => Call berhasil dikirim`));
                sukses++;
            } else {
                console.log(chalk.red(`[X] ${i + 1}/${jumlah} => Gagal mengirim call`));
            }
            
            // Tunggu 2 detik antar call untuk menghindari rate limit
            await delay(2000);
        }

        console.log(chalk.cyan("\n📊 Ringkasan"));
        console.log(chalk.cyan(`├─ Nomor : ${chalk.white(nomor)}`));
        console.log(chalk.cyan(`├─ Total : ${chalk.white(jumlah)}`));
        console.log(chalk.cyan(`├─ Sukses : ${chalk.green(sukses)}`));
        console.log(chalk.cyan(`└─ Gagal : ${chalk.red(jumlah - sukses)}`));

        const ulang = await question(chalk.magenta("\n🔁 Ingin spam call lagi? (y/n): "));
        if (ulang.toLowerCase() !== "y") break;
    }

    console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Call Tools!"));
    process.exit(0);
}

(async () => {
    await showBanner();
    await startSpam();
})();
