# On-Chain Birthday Reminder (Flare Coston2)

A decentralized Birthday Reminder dApp that lets users store, manage, and track birthdays directly on-chain using a smart contract deployed on the Flare Coston2 testnet. The project includes a TypeScript/Next.js front-end integrated with the smart contract via `wagmi` and `viem`.

---

## Contract Address

- **Network**: Flare Coston2 Testnet  
- **Contract Address**: `0x7EBf2132EaF7a2C40579De26D03F190da661b83E`  
- **Block Explorer**:  
  https://coston2-explorer.flare.network/address/0x7EBf2132EaF7a2C40579De26D03F190da661b83E

---

## Description

Remembering birthdays across friends, family, and important contacts can be tedious and error-prone, especially when managed across multiple apps or devices. This project provides an **on-chain birthday registry**, allowing each wallet address to securely store and manage its own list of birthdays.

The core of the project is the `BirthdayReminder` smart contract, which:

- Lets users add birthdays (with a name and date).
- Returns the full list of birthdays associated with the caller.
- Exposes a helper function to check which stored birthdays match a specific day and month (e.g., today’s date).
- Emits events when birthdays are added or when upcoming birthdays are detected.

The front-end dApp offers a clean UI to:

- Add new birthdays via a simple form.
- View all birthdays associated with the connected wallet.
- See a list of birthdays that fall on the current day.
- Remove birthdays by index when they are no longer needed.

All data is stored on-chain, ensuring transparency and persistence as long as the network exists.

---

## Features

### Smart Contract Features

- **Add Birthday**
  - Function: `addBirthday(string _name, uint8 _day, uint8 _month, uint16 _year)`
  - Stores a birthday record for the message sender.
  - Emits a `BirthdayAdded` event with the user address and birthday details.

- **Get Birthday Count**
  - Function: `getBirthdayCount()`
  - Returns the total number of birthdays stored in the contract (useful for analytics or global stats).

- **Get My Birthdays**
  - Function: `getMyBirthdays()`
  - Returns an array of `Birthday` structs associated with the caller (`msg.sender`), including:
    - `name` (string)
    - `day` (uint8)
    - `month` (uint8)
    - `year` (uint16)
    - `exists` (bool)

- **Check Today’s Birthdays**
  - Function: `checkTodaysBirthdays(uint8 _currentDay, uint8 _currentMonth)`
  - Returns an array of names (`string[]`) whose birthdays match the given day and month for the caller.
  - Can be called from the front-end with the current date to list today’s birthdays.

- **Get Single Birthday By Index**
  - Function: `getBirthday(uint256 _index)`
  - Returns detailed birthday data for a specific index.

- **Remove Birthday**
  - Function: `removeBirthday(uint256 _index)`
  - Allows a user to remove a birthday by index, enabling simple management and cleanup.

- **Contract Info**
  - Function: `getContractInfo()`
  - Returns a human-readable string describing the contract (e.g., for display in the UI header or info section).

- **Events**
  - `BirthdayAdded(address user, string name, uint8 day, uint8 month, uint16 year)`
  - `UpcomingBirthday(address user, string name, uint8 day, uint8 month)`

### Front-End / dApp Features

- **Wallet Gating**
  - Users must connect a Web3 wallet (via wagmi) before interacting with the contract.
  - If no wallet is connected, the UI shows a friendly prompt instead of the main interface.

- **Add Birthday UI**
  - Simple form fields for:
    - Name
    - Day (DD)
    - Month (MM)
    - Year (YYYY)
  - Lightweight client-side validation (e.g., date ranges) before sending transactions.

- **List of User Birthdays**
  - Displays all birthdays associated with the connected wallet.
  - Shows index, name, and formatted date.
  - Includes a quick “Remove” button for each entry that calls `removeBirthday(index)`.

- **Today’s Birthdays Section**
  - Uses `checkTodaysBirthdays` with the client’s current day and month.
  - Shows a list of names whose birthdays fall on the current date.
  - Displays a fallback message when no birthdays are recorded for today.

- **Transaction Status & Error Handling**
  - Shows transaction hash once a write transaction is sent.
  - Displays “Waiting for confirmation…” while the transaction is pending on-chain.
  - Confirms success with a “Transaction confirmed!” message.
  - Surfaces any error messages in a dedicated error card.

- **Responsive & Clean UI**
  - Built using React/Next.js with Tailwind CSS-style utility classes (via the project’s design system).
  - Optimized for both desktop and mobile layouts.

---

## How It Solves the Problem

### Problem

Managing birthdays usually happens across:

- Phone contacts
- Calendar apps
- Social media reminders
- Notes or spreadsheets

These solutions are often:

- **Centralized** – locked into a single platform or device.
- **Fragmented** – spread across different apps and accounts.
- **Not portable** – switching devices or platforms can mean losing or duplicating data.

For Web3-native users and projects, there is a need for:

- A **wallet-native**, **portable**, and **verifiable** way to store small but meaningful pieces of data like birthdays.
- A solution that can be integrated into other dApps, DAOs, or communities to personalize experiences (e.g., automated “Happy Birthday” messages, NFT airdrops, or reward distributions).

### Solution

This project provides an **on-chain birthday registry** tightly coupled with wallet addresses:

1. **Wallet-Centric Identity**
   - Birthdays are stored per wallet address, not per app or device.
   - Any dApp that knows the contract address and ABI can read or use this data for custom logic.

2. **Decentralized Storage**
   - All birthday data is recorded on-chain on the Flare Coston2 testnet.
   - As long as the network is live, the data is accessible and verifiable from anywhere.

3. **Composable On-Chain Data**
   - Other contracts or dApps can:
     - Call `getMyBirthdays()` for personalized experiences.
     - Use `checkTodaysBirthdays()` to send greetings, airdrop tokens, or issue special NFTs on a user’s birthday.
   - Simple indexing by index and count makes integration straightforward.

4. **User-Controlled**
   - Users can add and remove birthdays themselves.
   - No central authority can edit or censor their birthday entries.
   - Birthdays are associated with their wallet, allowing easy migration between interfaces and front-ends.

### Example Use Cases

- **Personal Birthday Tracker**
  - A user maintains their personal or family birthday list on-chain and uses this dApp as a front-end to manage it.

- **Community or DAO Tools**
  - A DAO integrates this contract to automatically celebrate member birthdays with:
    - Governance token bonuses
    - POAP-style NFTs
    - Special Discord roles or on-chain badges

- **Web3 Social or Messaging Apps**
  - A Web3-native social dApp or messaging app reads from the contract to:
    - Show birthday reminders in the UI
    - Trigger notifications or custom messages on a user’s birthday

- **Gifting & Airdrops**
  - Another contract or script periodically runs:
    - For each user, call `checkTodaysBirthdays` and send a small gift or NFT to celebrate.

### Benefits

- **Portability** – Your birthday list is tied to your wallet, not to a specific app.
- **Verifiability** – Anyone can verify the birthdays you have stored by reading directly from the contract.
- **Composability** – Other smart contracts and dApps can build on top of this data.
- **User Sovereignty** – You control your on-chain data and can add/remove birthdays anytime.

---

This repository combines a live smart contract on Flare Coston2 with a modern front-end, providing a complete example of how to build a


