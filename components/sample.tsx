"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useWillContract } from "@/hooks/useContract"

const SampleIntregation = () => {
  const { isConnected } = useAccount()
  const [name, setName] = useState("")
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [removeIndex, setRemoveIndex] = useState("")

  const { data, actions, state } = useWillContract()

  const dayNum = Number(day || 0)
  const monthNum = Number(month || 0)
  const yearNum = Number(year || 0)

  const isDateValid =
    day !== "" &&
    month !== "" &&
    year !== "" &&
    !Number.isNaN(dayNum) &&
    !Number.isNaN(monthNum) &&
    !Number.isNaN(yearNum) &&
    dayNum >= 1 &&
    dayNum <= 31 &&
    monthNum >= 1 &&
    monthNum <= 12 &&
    yearNum >= 1900

  const canAddBirthday = !!name.trim() && isDateValid
  const canRemoveByIndex = removeIndex === "" ? false : Number(removeIndex) >= 0

  const handleAddBirthday = async () => {
    if (!canAddBirthday) return

    try {
      await actions.addBirthday(name.trim(), dayNum, monthNum, yearNum)
      setName("")
      setDay("")
      setMonth("")
      setYear("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRemoveBirthday = async (index?: number) => {
    try {
      const idx = typeof index === "number" ? index : Number(removeIndex)
      if (Number.isNaN(idx) || idx < 0) return
      await actions.removeBirthday(idx)
      setRemoveIndex("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  if (!mounted || !isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Birthday Reminder</h2>
          <p className="text-muted-foreground">Please connect your wallet to manage your on-chain birthdays.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Birthday Reminder</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Store and track birthdays securely on-chain on the Flare Coston2 testnet.
          </p>
          {data.contractInfo && (
            <p className="text-xs text-muted-foreground mt-2 break-words">{data.contractInfo}</p>
          )}
        </div>

        {/* Contract Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total Birthdays</p>
            <p className="text-2xl font-semibold text-foreground">{data.birthdayCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Your Birthdays</p>
            <p className="text-2xl font-semibold text-foreground">{data.myBirthdays.length}</p>
          </div>
        </div>

        {/* Today's Birthdays */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8">
          <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Today's Birthdays</p>
          {data.todaysBirthdays.length === 0 ? (
            <p className="text-sm text-muted-foreground">No birthdays recorded for today.</p>
          ) : (
            <ul className="text-sm text-foreground space-y-1">
              {data.todaysBirthdays.map((name, i) => (
                <li key={i}>🎉 {name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-6">
          {/* Add Birthday */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <label className="block text-sm font-medium text-foreground">Add a Birthday</label>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                min="1"
                max="31"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                min="1"
                max="12"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            {!isDateValid && (day || month || year) && (
              <p className="text-xs text-destructive mt-1">Please enter a valid date.</p>
            )}
            <button
              onClick={handleAddBirthday}
              disabled={state.isLoading || state.isPending || !canAddBirthday}
              className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {state.isLoading || state.isPending ? "Saving Birthday..." : "Save Birthday"}
            </button>
          </div>

          {/* Your Birthdays List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <label className="block text-sm font-medium text-foreground">Your Stored Birthdays</label>
            </div>
            {data.myBirthdays.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't added any birthdays yet.</p>
            ) : (
              <div className="space-y-2">
                {data.myBirthdays.map((b, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-card border border-border rounded-lg px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        #{index} — {b.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(b.day).padStart(2, "0")}/{String(b.month).padStart(2, "0")}/{b.year}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveBirthday(index)}
                      className="text-xs px-2 py-1 rounded-md border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      disabled={state.isLoading || state.isPending}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remove by Index */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </span>
              <label className="block text-sm font-medium text-foreground">Remove by Index</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Birthday index"
                value={removeIndex}
                onChange={(e) => setRemoveIndex(e.target.value)}
                min="0"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => handleRemoveBirthday()}
              disabled={state.isLoading || state.isPending || !canRemoveByIndex}
              className="w-full px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {state.isLoading || state.isPending ? "Removing..." : "Remove Birthday"}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-sm text-green-500">Transaction confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntregation
