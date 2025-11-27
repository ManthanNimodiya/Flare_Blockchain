# 🎂 Birthday Reminder — Smart Contract

A simple and beginner-friendly Ethereum smart contract that allows each user to save and manage **their own list of birthdays** on the blockchain.  
Perfect for learning Solidity fundamentals such as **structs, arrays, mappings, events, validation, and state management**.

---

## 📌 Project Description

The **Birthday Reminder** smart contract lets every wallet address store birthdays privately.  
Each user sees **only their own birthdays**, making it a clean, isolated data system for learning Web3 storage patterns.

This project is ideal for:
- Blockchain beginners  
- Students learning Solidity  
- Developers exploring simple decentralized storage  
- Portfolio smart contract examples  

---

## 🚀 What It Does

- Stores birthdays per user  
- Lets users **add, view, count, and remove** stored birthdays  
- Checks if today matches any saved birthday  
- Emits events for easy frontend integration  
- Runs entirely on-chain  

---

## 🌟 Features

- ✔ **Add a Birthday** — Name + Day + Month + Year  
- ✔ **View All Your Birthdays**  
- ✔ **View Single Birthday by Index**  
- ✔ **Count Total Birthdays Saved**  
- ✔ **Check Today's Birthdays** (user inputs the date)  
- ✔ **Delete a Birthday**  
- ✔ **Beginner-friendly with simple validation**  
- ✔ **Events** for UI updates  

---

## 🔗 Deployed Smart Contract  
**Coston2 Explorer (Flare Testnet):**  
**Link:** https://coston2-explorer.flare.network/txs

---

## 🧩 Smart Contract Code

Use this code:  
```solidity
//paste your code

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
    🌟 Birthday Reminder Smart Contract (Beginner Friendly Version)
    ---------------------------------------------------------------
    This contract allows every user (wallet address) to store and manage 
    their own list of birthdays. Each user only sees their OWN birthdays.

    Features:
    ✔ Add a birthday
    ✔ View all your birthdays
    ✔ View one birthday by index
    ✔ Count how many birthdays you stored
    ✔ Check if today matches any of your stored birthdays
    ✔ Remove a birthday
    ✔ Simple contract info text

    Perfect for beginners learning:
    - structs
    - arrays
    - mappings
    - events
    - simple data validation
*/

contract BirthdayReminder {

    // 🎂 A structure to store a single person's birthday
    struct Birthday {
        string name;
        uint8 day;
        uint8 month;
        uint16 year;
        bool exists;   // Helps indicate that the birthday is real
    }

    // 🗂 Mapping: each user address → their list (array) of birthday records
    mapping(address => Birthday[]) private userBirthdays;

    // 📢 Events help apps listen to changes in the contract
    event BirthdayAdded(address indexed user, string name, uint8 day, uint8 month, uint16 year);
    event UpcomingBirthday(address indexed user, string name, uint8 day, uint8 month);

    // 🟢 Add a new birthday
    function addBirthday(string memory _name, uint8 _day, uint8 _month, uint16 _year) public {
        // Basic date validation
        require(_day >= 1 && _day <= 31, "Invalid day");
        require(_month >= 1 && _month <= 12, "Invalid month");
        require(_year >= 1900 && _year <= 2100, "Invalid year");
        require(bytes(_name).length > 0, "Name cannot be empty");

        // Create the new birthday record
        Birthday memory newBirthday = Birthday({
            name: _name,
            day: _day,
            month: _month,
            year: _year,
            exists: true
        });

        // Save it into the caller's own list
        userBirthdays[msg.sender].push(newBirthday);

        // Emit event for external apps
        emit BirthdayAdded(msg.sender, _name, _day, _month, _year);
    }

    // 📄 Get all birthdays stored by the caller
    function getMyBirthdays() public view returns (Birthday[] memory) {
        return userBirthdays[msg.sender];
    }

    // 🔢 Get how many birthdays the caller has saved
    function getBirthdayCount() public view returns (uint) {
        return userBirthdays[msg.sender].length;
    }

    // 🔍 Get one birthday by index
    function getBirthday(uint _index)
        public
        view
        returns (string memory name, uint8 day, uint8 month, uint16 year)
    {
        require(_index < userBirthdays[msg.sender].length, "Birthday index out of range");

        Birthday memory birthday = userBirthdays[msg.sender][_index];

        return (birthday.name, birthday.day, birthday.month, birthday.year);
    }

    // 🎉 Check if today matches any stored birthday
    // NOTE: You must provide today's date manually (day + month).
    function checkTodaysBirthdays(uint8 _currentDay, uint8 _currentMonth) 
        public 
        view 
        returns (string[] memory) 
    {
        Birthday[] memory myBirthdays = userBirthdays[msg.sender];

        // First count how many birthdays match today
        uint matchCount = 0;
        for (uint i = 0; i < myBirthdays.length; i++) {
            if (myBirthdays[i].day == _currentDay && myBirthdays[i].month == _currentMonth) {
                matchCount++;
            }
        }

        // Create the array to store matching names
        string[] memory todaysBirthdays = new string[](matchCount);

        // Fill the array with matching birthday names
        uint currentIndex = 0;
        for (uint i = 0; i < myBirthdays.length; i++) {
            if (myBirthdays[i].day == _currentDay && myBirthdays[i].month == _currentMonth) {
                todaysBirthdays[currentIndex] = myBirthdays[i].name;
                currentIndex++;
            }
        }

        return todaysBirthdays;
    }

    // ❌ Remove a birthday by index
    function removeBirthday(uint _index) public {
        require(_index < userBirthdays[msg.sender].length, "Birthday index out of range");

        // Replace the removed item with the last item (gas-efficient trick)
        userBirthdays[msg.sender][_index] = userBirthdays[msg.sender][userBirthdays[msg.sender].length - 1];

        // Remove the last element
        userBirthdays[msg.sender].pop();
    }

    // ℹ️ Get simple contract info
    function getContractInfo() public pure returns (string memory) {
        return "Birthday Reminder Smart Contract v1.0 - Easy, simple, beginner-friendly.";
    }
}

