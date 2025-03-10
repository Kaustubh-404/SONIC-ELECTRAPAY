# **ElectraPay - AI-Powered Digital Payments Ecosystem**

## 🚀 **Introduction**
ElectraPay is a **decentralized payment ecosystem** that seamlessly integrates **AI automation, cross-chain bridging, and liquidity optimization** to provide a **fast, secure, and scalable** digital transaction experience.

## 🎥 **Watch ElectraPay in Action**
[![ElectraPay Demo](https://img.youtube.com/vi/geo63FgG0A4/0.jpg)](https://youtu.be/geo63FgG0A4?feature=shared)

## ✨ **Features**
- 🔹 **Instant Transfers** – Fast and low-cost peer-to-peer transactions.
- 🤖 **AI-Powered Recurrent Payments** – Automates transactions for salaries, subscriptions, and invoices.
- 🌉 **Cross-Chain Bridging** – Integrated **deBridge** for seamless multi-chain transfers.
- 💰 **Liquidity Provisioning** – Earn passive income while waiting for scheduled payments.
- 🔒 **Secure & Decentralized** – Smart contract-based automation with **full user control.**

## 🏗 **Project Architecture**
ElectraPay consists of **three core components**:
1️⃣ **Web Application** (Electra-Pay) – The user interface for managing transactions.  
2️⃣ **AI Agent** – Optimizes payments & liquidity investments.  
3️⃣ **Webhook Server** – Handles real-time event processing.  

---

## ⚡ **Setup Guide**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Kaustubh-404/SONIC-ELECTRAPAY
```

### **2️⃣ Deploy Smart Contracts**
- Deploy both contracts from `Electra-Pay/Contracts` folder on **Sonic Blaze Testnet**.
- Copy the **Payroll Contract Address** and **Liquidity Contract Address**.

### **3️⃣ Configure the Environment Variables**
Paste the **Payroll Contract Address** in the following files:
- `agent/.env`
- `Electra-Pay/.env`

Paste the **Payroll ABI** in:
- `Electra-Pay/lib/abi.ts`

Paste the **Liquidity Contract Address & ABI** in:
- `Electra-Pay/lib/liquidityContract.ts`

---

## 🛠 **Installation & Running the Services**

### **3️⃣ Start Webhook Server**
```sh
cd webhook
npm install
node webhookServer.js
```
- Copy the **Webhook URL** and paste it in `agent/.env`.

### **4️⃣ Start AI Agent**
```sh
cd agent
npm install
```
- Configure `.env.example`, paste the **Webhook URL**.
- Run the AI Agent:
```sh
npx ts-node index.ts
```

### **5️⃣ Start Web Application**
```sh
cd Electra-Pay
npm install
```
- Configure `.env.example`.
- Start the web application:
```sh
npm run dev
```

Now, the **ElectraPay WebApp** should be running locally! 🎉

---

## 🔑 **Smart Contract Addresses**
All transactions of these contracts can be seen on **Blaze Testnet's Block Explorer**.
ElectraPay is fully built upon **Sonic Chain**.

| Contract | Address |
|----------|----------------------------------|
| **Payroll Contract** | `0x48b343e298cA724f78650Aec3d79852c9cBcaD7F` |
| **Liquidity Contract** | `0x99aF1664c53D4a5DEfcDDf509B530a56180d20EA` |

---

## 🔗 **Connect With Us**
🐦 Twitter: [https://x.com/FLACKK_](https://x.com/FLACKK_)  
📢 Telegram: [t.me/kaustubh@1610](https://t.me/kaustubh_1610)  

---

