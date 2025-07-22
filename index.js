const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");
const { spawn } = require("child_process");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const EXIT_WORDS = ["exit", "keluar", "quit", "q"];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (text) => {
    return new Promise(resolve => {
        rl.question(text, answer => {
            const val = answer.trim().toLowerCase();
            if (EXIT_WORDS.includes(val)) {
                console.log(chalk.red("\n[!] Keluar dari tools..."));
                rl.close();
                process.exit(0);
            }
            resolve(val);
        });
    });
};

const showBanner = () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN TOOLS", { font: "ANSI Shadow" });
    console.log(gradient.pastel.multiline(banner));
    console.log(chalk.magentaBright("      ⚙️ WhatsApp Spam Utilities - By Dravin\n"));
};

const mainMenu = async () => {
    while (true) {
        showBanner();
        console.log(chalk.cyan(`
 ┌──────────── MENU UTAMA ─────────────┐
 │ 1. 🔐 Dravin Pairing Spam Tools     │
 │ 2. 📞 Dravin Call Spam Tools        │
 │ 3. ❌ Keluar                         │
 └─────────────────────────────────────┘
`));

        const choice = await ask(chalk.yellow("❯ Pilih nomor menu (1/2/3): "));

        if (choice === "1") {
            runScript("dravin-pairing.js");
            break;
        } else if (choice === "2") {
            runScript("dravin-call.js");
            break;
        } else if (choice === "3") {
            console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Tools!"));
            rl.close();
            process.exit(0);
        } else {
            console.log(chalk.red("\n[!] Pilihan tidak valid, coba lagi...\n"));
            await sleep(1000);
        }
    }
};

const runScript = (scriptPath) => {
    console.clear();
    const subprocess = spawn("node", [scriptPath], { stdio: "inherit" });

    subprocess.on("exit", () => {
        rl.close();
        process.exit(0);
    });
};

(async () => {
    await mainMenu();
})();
