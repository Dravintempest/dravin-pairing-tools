const { exec } = require('child_process');
const readline = require('readline');
const chalk = require('chalk').default;
const figlet = require('figlet');
const gradient = require('gradient-string');

// Utility function for asking questions
const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(text, ans => {
        rl.close();
        resolve(ans);
    });
};

// Show main banner
const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN TOOLS", { font: "ANSI Shadow" });
    console.log(gradient.instagram.multiline(banner));
    console.log(chalk.magenta("[⚙️] WhatsApp Spam Tools Suite - BY DRAVIN"));
    console.log(chalk.cyan("═════════════════════════════════════════════════════"));
    console.log(chalk.green("• Gunakan hanya untuk edukasi, tanggung sendiri risikonya"));
    console.log(chalk.yellow("• Target hanya berlaku untuk nomor dengan kode negara 62"));
    console.log(chalk.cyan("═════════════════════════════════════════════════════\n"));
};

// Main menu function
async function mainMenu() {
    await showBanner();
    
    console.log(chalk.yellow("PILIH TOOLS YANG INGIN DIGUNAKAN:"));
    console.log(chalk.cyan("1. Spam Pairing Code"));
    console.log(chalk.cyan("2. Spam Call"));
    console.log(chalk.cyan("3. Keluar"));
    
    const choice = await question(
        chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
        chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
        chalk.yellow('Pilihan Anda (1-3): ')
    );

    switch(choice) {
        case '1':
            console.log(chalk.green("\nMemulai Spam Pairing Tools..."));
            exec('node dravin-pairing.js', (error, stdout, stderr) => {
                if (error) {
                    console.log(chalk.red(`Error: ${error.message}`));
                    return;
                }
                if (stderr) {
                    console.log(chalk.red(`Stderr: ${stderr}`));
                    return;
                }
                console.log(stdout);
            });
            break;
        case '2':
            console.log(chalk.green("\nMemulai Spam Call Tools..."));
            exec('node dravin-call.js', (error, stdout, stderr) => {
                if (error) {
                    console.log(chalk.red(`Error: ${error.message}`));
                    return;
                }
                if (stderr) {
                    console.log(chalk.red(`Stderr: ${stderr}`));
                    return;
                }
                console.log(stdout);
            });
            break;
        case '3':
            console.log(chalk.green("\nTerima kasih telah menggunakan Dravin Tools!"));
            process.exit(0);
            break;
        default:
            console.log(chalk.red("\nPilihan tidak valid! Silakan pilih 1-3"));
            await delay(1000);
            mainMenu();
    }
}

// Start the application
(async () => {
    try {
        await mainMenu();
    } catch (error) {
        console.error(chalk.red("Terjadi error:"), error);
        process.exit(1);
    }
})();
