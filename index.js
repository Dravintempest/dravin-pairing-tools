const { exec } = require('child_process')
const readline = require('readline')
const chalk = require('chalk').default
const figlet = require('figlet')
const gradient = require('gradient-string')

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    })
    return new Promise(resolve => {
        rl.question(text, ans => {
            rl.close()
            resolve(ans)
        })
    })
}

// Show main banner
const showBanner = async () => {
    console.clear()
    const banner = figlet.textSync("DRAVIN TOOLS", { font: "ANSI Shadow" })
    console.log(gradient.instagram.multiline(banner))
    console.log(chalk.magenta("[⚙️] WhatsApp Spam Tools Suite - DRAVIN Edition"))
    console.log(chalk.cyan("═════════════════════════════════════════════════════"))
    console.log(chalk.green("• Gunakan hanya untuk edukasi, tanggung sendiri risikonya"))
    console.log(chalk.yellow("• Target hanya berlaku untuk nomor dengan kode negara 62"))
    console.log(chalk.cyan("═════════════════════════════════════════════════════\n"))
}

// Function to run external script
const runScript = (scriptName) => {
    return new Promise((resolve, reject) => {
        exec(`node ${scriptName}`, (error, stdout, stderr) => {
            if (error) {
                console.log(chalk.red(`Error running ${scriptName}: ${error.message}`))
                return reject(error)
            }
            if (stderr) {
                console.log(chalk.yellow(`Warning from ${scriptName}: ${stderr}`))
            }
            console.log(stdout)
            resolve()
        })
    })
}

// Main menu function
async function mainMenu() {
    while (true) {
        await showBanner()
        
        console.log(chalk.yellow("PILIH TOOLS YANG INGIN DIGUNAKAN:"))
        console.log(chalk.cyan("1. Spam Pairing Code"))
        console.log(chalk.cyan("2. Spam Call"))
        console.log(chalk.cyan("3. Keluar"))
        
        const choice = await question(
            chalk.cyan(' ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯') + ' ' +
            chalk.yellow('Pilihan Anda (1-3): ')
        )

        try {
            switch(choice) {
                case '1':
                    console.log(chalk.green("\nMemulai Spam Pairing Tools..."))
                    await runScript('dravin-pairing.js')
                    break
                case '2':
                    console.log(chalk.green("\nMemulai Spam Call Tools..."))
                    await runScript('dravin-call.js')
                    break
                case '3':
                    console.log(chalk.green("\nTerima kasih telah menggunakan Dravin Tools!"))
                    process.exit(0)
                default:
                    console.log(chalk.red("\nPilihan tidak valid! Silakan pilih 1-3"))
                    await delay(1000)
            }
        } catch (error) {
            console.log(chalk.red("\nTerjadi error saat menjalankan tools:"))
            console.log(error)
            await delay(2000)
        }
    }
}

// Start the application
(async () => {
    try {
        await mainMenu()
    } catch (error) {
        console.error(chalk.red("Terjadi error:"), error)
        process.exit(1)
    }
})()
