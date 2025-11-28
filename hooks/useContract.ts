"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface BirthdayEntry {
  name: string
  day: number
  month: number
  year: number
  exists: boolean
}

export interface ContractData {
  contractInfo: string
  myBirthdays: BirthdayEntry[]
  birthdayCount: number
  todaysBirthdays: string[]
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  addBirthday: (name: string, day: number, month: number, year: number) => Promise<void>
  removeBirthday: (index: number) => Promise<void>
}

export const useWillContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const now = new Date()
  const currentDay = now.getDate()
  const currentMonth = now.getMonth() + 1

  const { data: contractInfo } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getContractInfo",
  })

  const { data: myBirthdays, refetch: refetchMyBirthdays } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getMyBirthdays",
    query: {
      enabled: !!address,
    },
  })

  const { data: birthdayCount, refetch: refetchBirthdayCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getBirthdayCount",
  })

  const { data: todaysBirthdays, refetch: refetchTodaysBirthdays } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "checkTodaysBirthdays",
    args: [currentDay, currentMonth],
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchMyBirthdays()
      refetchBirthdayCount()
      refetchTodaysBirthdays()
    }
  }, [isConfirmed, refetchMyBirthdays, refetchBirthdayCount, refetchTodaysBirthdays])

  const addBirthday = async (name: string, day: number, month: number, year: number) => {
    if (!name || !day || !month || !year) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addBirthday",
        args: [name, day, month, year],
      })
    } catch (err) {
      console.error("Error adding birthday:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const removeBirthday = async (index: number) => {
    if (index < 0) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "removeBirthday",
        args: [BigInt(index)],
      })
    } catch (err) {
      console.error("Error removing birthday:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const data: ContractData = {
    contractInfo: contractInfo ? String(contractInfo) : "",
    myBirthdays: (myBirthdays as BirthdayEntry[]) || [],
    birthdayCount: birthdayCount ? Number(birthdayCount as bigint) : 0,
    todaysBirthdays: (todaysBirthdays as string[]) || [],
  }

  const actions: ContractActions = {
    addBirthday,
    removeBirthday,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: (error as Error | null) || null,
  }

  return {
    data,
    actions,
    state,
  }
}
