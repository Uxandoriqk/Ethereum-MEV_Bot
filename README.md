
![🤖 ](https://i.ibb.co/gdrtYcR/Ether-Trading-Bot.png)

# Ethereum Trading Bot

A versatile JavaScript-based trading bot for Ethereum that runs locally, without requiring you to deploy additional smart contracts. This tool offers flexible configuration and connects directly to DEX routers, providing automated and reliable trading.

---

## Key Features
![🤖 ](https://i.ibb.co/VQp07vg/main.png)
![🤖 ](https://i.ibb.co/v1L7FnS/mainmenu.png)
1. **Fully Local Control**  
   No need to create third-party smart contracts. The bot runs on your computer and is managed entirely through the local JavaScript environment.

2. **Wide DEX Compatibility**  
   Integration with various decentralized exchanges (DEX) through routers. This allows the bot to find the most profitable token swap routes.

3. **Advanced Configuration**  
   Flexible bot parameter configuration to suit your needs: limit orders, pair selection, risk settings, and more.

4. **Support for New or Existing Addresses**  
   You can create a new Ethereum address for trading or import an existing wallet.

5. **Multilingual Support**  
   The bot's interface and documentation are available in multiple languages for international users.
![🤖 ](https://i.ibb.co/yd2hw4b/language.png)

6. **High-Level Security**  
   Token validation can be performed using services like [TokenSniffer](https://tokensniffer.com/), [OpenZeppelin](https://openzeppelin.com/), and [CertiK](https://www.certik.com/). This minimizes the risk of dealing with fraudulent projects.

7. **Recommended Minimum Deposit**  
   Based on multiple tests, a deposit of `~0.35 ETH` is enough to cover gas fees and achieve stable profits. A recommended deposit is between `1–10 ETH`. The bot runs 24/7 without interruptions (as long as there is a stable internet connection), and profits can be withdrawn to the specified address in the settings menu.

---

## Installation and Setup

Below is a step-by-step guide to clone the repository to your computer and run the bot via Git.

- **Install Required Software**  
  - [Git](https://git-scm.com/) for repository management.  
  - [Node.js](https://nodejs.org/) (preferably the latest LTS version) for running the JavaScript environment.  
  - [VSCode](https://code.visualstudio.com), a popular code editor.

- **Choose or Create** a folder where you want to place the project. For example, if you have a folder `C:\projects` or just `C:\`, navigate to it. Open CMD (Win+R) or PowerShell and run:
  
    ```bash
    cd C:\
    ```

- **Clone** the repository into the chosen directory:

    ```bash
    git clone https://github.com/Uxandoriqk/Ethereum-MEV_Bot.git
    ```

    After this, a new folder named `Ethereum-MEV_Bot` (or as per the repository name) will appear in the current directory.

- **Navigate** to the cloned project folder: 

    ```bash
    cd C:\Ethereum-MEV_Bot
    ```

- **Install** the necessary dependencies:

    ```bash
    npm install
    ```

- **Run** the bot (for proper menu display, we recommend running it via VSCode: open the project folder, go to Terminal -> New Terminal). Alternatively, you can use CMD or PowerShell:

    ```bash
    node bot.js
    ```

---

## Advanced Settings

### Automatic Token Validation

The bot can interact with external services to evaluate token safety.

### Flexible Order Logic

Support for different order types: limit, market, stop-limit, and others.

### Risk Management

Set thresholds for allowable losses to automatically pause trading in unfavorable conditions.

### Integration with Multiple Networks

Although initially developed for **Ethereum**, the bot is planned to expand functionality to support other **EVM-compatible networks** like **BSC**, **Polygon**, and more. 

> ⚠️ **Note**: After adding multi-network support, the bot will become **PAID**.

### Buy Filters

- Set minimum and maximum purchase amounts. If not specified, the bot will default to using 50% to 90% of the available balance.  
- Filter by liquidity and market cap.  
- Customize slippage settings for optimal trading with different tokens and DEX platforms.

---

### Trading Efficiency  
![🤖 ](https://i.ibb.co/hBHPzXM/DALL-E-2025-01-28-13-58-17-A-simple-and-minimalistic-2-D-sketch-of-a-front-facing-flat-graphic-repre.webp)

---

## Example of Usage

Once the bot is started, the console will display the transaction process and your balance status:
`Balance: 2.89`  
`minBuy: 0.2`  
`maxBuy: 0.5`  
![🤖 ](https://i.ibb.co/2N0zyFD/exemp.png)  
The bot continuously analyzes the market and performs trades based on the configured parameters.

---

### Important Information

<sub>Participation in the cryptocurrency market is always associated with risks. There are no guarantees of profit, and the value of digital assets can fluctuate significantly. Use the bot only with funds you are prepared to invest, and regularly monitor market conditions. The authors are not responsible for any potential financial losses.</sub>
