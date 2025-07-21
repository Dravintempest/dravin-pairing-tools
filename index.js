const readline = require('readline');
const chalk = require('chalk').default;
const figlet = require('figlet');
const gradient = require('gradient-string');

// Import the tools directly
const pairingTool = require('./dravin-pairing');
const callTool = require('./dravin-call');

const showBanner = () => {
  console.clear();
  console.log(gradient.instagram(figlet.textSync("DRAVIN", { font: "ANSI Shadow" })));  
  console.log(gradient.instagram(figlet.textSync("TOOLS", { font: "ANSI Shadow" })));
  console.log(chalk.magenta("[⚡] WhatsApp Spam Tools - Optimized Version"));
  console.log(chalk.cyan("══════════════════════════════════════════"));
};

(async () => {
  showBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  while (true) {
    console.log("\n" + chalk.yellow("PILIH TOOLS:"));
    console.log(chalk.cyan("1. Spam Pairing (Cepat)"));
    console.log(chalk.cyan("2. Spam Call (Eksperimental)"));
    console.log(chalk.cyan("3. Keluar\n"));

    const choice = await new Promise(resolve => {
      rl.question(chalk.yellow("Pilihan (1-3): "), resolve);
    });

    try {
      switch (choice.trim()) {
        case '1':
          await pairingTool.start();
          break;
        case '2':
          await callTool.start();
          break;
        case '3':
          rl.close();
          process.exit(0);
        default:
          console.log(chalk.red("❌ Pilihan tidak valid! Coba lagi."));
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }

    showBanner();
  }
})();
