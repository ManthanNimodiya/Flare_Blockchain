export const contractAddress = "0x7EBf2132EaF7a2C40579De26D03F190da661b83E";

// Export only the ABI array expected by viem/wagmi
export const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "day",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "month",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "year",
        type: "uint16",
      },
    ],
    name: "BirthdayAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "day",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "month",
        type: "uint8",
      },
    ],
    name: "UpcomingBirthday",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_day",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_month",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_year",
        type: "uint16",
      },
    ],
    name: "addBirthday",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_currentDay",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_currentMonth",
        type: "uint8",
      },
    ],
    name: "checkTodaysBirthdays",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getBirthday",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "day",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "month",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "year",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBirthdayCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyBirthdays",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint8",
            name: "day",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "month",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "year",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        internalType: "struct BirthdayReminder.Birthday[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "removeBirthday",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
