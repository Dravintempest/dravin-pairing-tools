const { spawn } = require('child_process');
const readline = require('readline');
const chalk = require('chalk').default;
const figlet = require('figlet');
const gradient = require('gradient-string');

const showBanner = () => {
  console.clear();
  console.log(gradient.instagram(figlet.textSync("DRAVIN", { font: "ANSI Shadow" })));  
  console.log(gradient.instagram(figlet.textSync("TOOLS", { font: "ANSI Shadow" })));
  console.log(chalk.magenta("[⚡] WhatsApp Spam Tools - Optimized Version"));
  console.log(chalk.cyan("══════════════════════════════════════════"));
};

const runCommand = (command) => {
  return new Promise((resolve) => {
    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const child = spawn(cmd, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      console.log(chalk.yellow(`\nCommand "${command}" exited with code ${code}`));
      resolve();
    });
  });
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

    switch (choice.trim()) {
      case '1':
        await runCommand('node dravin-pairing.js');
        break;
      case '2':
        await runCommand('node dravin-call.js');
        break;
      case '3':
        rl.close();
        process.exit(0);
      default:
        console.log(chalk.red("❌ Pilihan tidak valid! Coba lagi."));
    }

    showBanner();
  }
})();
