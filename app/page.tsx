"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react"
import backtestData from "../data/backtest-data.json"
import type { Position } from "@/lib/types"

// Helper to format numbers
const formatCurrency = (value: number) => `$${value.toFixed(2)}`
const formatPercent = (value: number) => `${value.toFixed(2)}%`
const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString()

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-xs bg-card border-2 border-primary text-white">
        <p className="label">{`Date : ${formatDate(label)}`}</p>
        <p className="intro">{`Value : ${formatCurrency(payload[0].value)}`}</p>
      </div>
    )
  }
  return null
}

const NyanCat = () => (
  <div className="absolute top-16 left-0 w-full h-20 overflow-hidden pointer-events-none z-50">
    <div className="absolute animate-nyan-fly">
      <Image src="/nyancat.gif" alt="Nyan Cat" width={120} height={80} unoptimized />
    </div>
  </div>
)

export default function NyancatFinanceDashboard() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Position | null; direction: "asc" | "desc" }>({
    key: "totalPnL",
    direction: "desc",
  })

  const sortedPositions = useMemo(() => {
    const sortableItems = [...backtestData.positions]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Position]
        const bValue = b[sortConfig.key as keyof Position]

        if (typeof aValue === "number" && typeof bValue === "number") {
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [backtestData.positions, sortConfig])

  const requestSort = (key: keyof Position) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: keyof Position) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="h-3 w-3" />
    }
    return sortConfig.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const { summary, equityCurve, config, signalAccuracy, featureImportance } = backtestData

  const equityChartData = equityCurve.map((d) => ({
    date: d.timestamp,
    value: d.value,
  }))

  const equityValues = equityCurve.map((p) => p.value)
  const minEquity = Math.min(...equityValues)
  const maxEquity = Math.max(...equityValues)

  const formatYAxis = (value: number) => {
    if (maxEquity - minEquity < 1000) {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }
    return `$${(value / 1000).toFixed(0)}k`
  }

  const featureImportanceData = Object.entries(featureImportance).map(([name, value]) => ({
    name: name === 'fundingMomentum' ? 'Funding Momentum' : name === 'volatilityFilter' ? 'Volatility Filter' : name === 'riskScore' ? 'Risk Score' : name,
    value: value * 100,
  }))

  return (
    <div className="min-h-screen w-full p-4 md:p-8 font-mono text-xs md:text-sm">
      <NyanCat />
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.25)]">
          Nyancat.finance
        </h1>
        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <button className="app-button px-12 py-6 text-xl relative">
                <span className="app-button-text">App</span>
              </button>
            </DialogTrigger>
            <DialogContent className="pixel-border max-w-md bg-nyan-bg text-white">
              <DialogHeader>
                <DialogTitle className="text-nyan-pink text-center text-xl">Download Our App</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 mt-4">
                <div className="p-4 bg-white rounded-lg shadow-pixel">
                  <Image src="/qr.png" alt="QR Code to download app" width={200} height={200} className="block" />
                </div>
                <p className="text-center text-sm text-white/80">
                  Scan this QR code to visit Nyancat.finance via World App
                </p>
                <div className="text-center text-xs text-nyan-yellow">
                  <p>Experience the future of DeFi trading</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="space-y-8">
        {/* Summary Metrics */}
        <section>
          <h2 className="text-2xl mb-4 text-white">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Total Return</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl text-nyan-green">{formatPercent(summary.totalReturn)}</CardContent>
            </Card>
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Total APY</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl text-nyan-green">
                {formatPercent(
                  (Math.pow(summary.finalCapital / summary.initialCapital, 365 / summary.totalDays) - 1) * 100,
                )}
              </CardContent>
            </Card>
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Total P&L</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl text-nyan-green">
                {formatCurrency(summary.totalReturnDollars)}
              </CardContent>
            </Card>
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Trades</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl text-white">{summary.numberOfTrades}</CardContent>
            </Card>
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Win Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl text-nyan-yellow">{formatPercent(summary.winRate)}</CardContent>
            </Card>
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl text-nyan-red">{formatPercent(summary.maxDrawdown)}</CardContent>
            </Card>
          </div>
        </section>

        {/* Charts and Config */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl mb-4 text-white">Equity Curve</h2>
            <Card className="pixel-border h-[440px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityChartData}>
                  <defs>
                    <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#d13a41" />
                      <stop offset="20%" stopColor="#f37737" />
                      <stop offset="40%" stopColor="#fdf148" />
                      <stop offset="60%" stopColor="#55a853" />
                      <stop offset="80%" stopColor="#3a70b8" />
                      <stop offset="100%" stopColor="#ff99ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                  <XAxis
                    dataKey="date"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatDate}
                    stroke="white"
                    tick={{ fontSize: 10, fill: "white" }}
                  />
                  <YAxis
                    stroke="white"
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 10, fill: "white" }}
                    domain={[minEquity - 50, maxEquity + 50]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="url(#rainbow)"
                    fill="url(#rainbow)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <p>
                  <strong>Initial Capital:</strong> {formatCurrency(config.initialCapital)}
                </p>
                <p>
                  <strong>Date Range:</strong> {formatDate(new Date(config.startDate).getTime())} -{" "}
                  {formatDate(new Date(config.endDate).getTime())}
                </p>
                <p>
                  <strong>Min APR:</strong> {formatPercent(config.minAPR)}
                </p>
                <p>
                  <strong>Use ML:</strong>{" "}
                  <span className={config.useML ? "text-nyan-green" : "text-nyan-red"}>
                    {config.useML ? "YES" : "NO"}
                  </span>
                </p>
                <p>
                  <strong>Risk Threshold:</strong> {formatPercent(config.riskThreshold)}
                </p>
              </CardContent>
            </Card>
            <Card className="pixel-border">
              <CardHeader>
                <CardTitle>Signal Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <p>
                  <strong>Accuracy:</strong>{" "}
                  <span className="text-nyan-green">{formatPercent(signalAccuracy.accuracy)}</span>
                </p>
                <p>
                  <strong>Avg. Confidence:</strong> {formatPercent(signalAccuracy.avgConfidence)}
                </p>
                <p>
                  <strong>Predictions:</strong> {signalAccuracy.totalPredictions} ({signalAccuracy.correctPredictions}{" "}
                  correct)
                </p>
              </CardContent>
            </Card>
            <Card className="pixel-border h-[180px]">
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart
                    data={featureImportanceData}
                    layout="vertical"
                    margin={{ top: 5, right: 40, left: 60, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 50]} stroke="white" tick={{ fill: "white", fontSize: 8 }} />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fill: "white", fontSize: 10 }} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.1)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--primary))",
                        fontSize: "10px",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" background={{ fill: "rgba(255,255,255,0.1)" }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Positions Table */}
        <section>
          <h2 className="text-2xl mb-4 text-white">Positions</h2>
          <Card className="pixel-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-white/10">
                    <TableHead className="cursor-pointer" onClick={() => requestSort("symbol")}>
                      Symbol {getSortIcon("symbol")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => requestSort("totalPnL")}>
                      Total P&L {getSortIcon("totalPnL")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-right hidden md:table-cell"
                      onClick={() => requestSort("entryTime")}
                    >
                      Entry Time {getSortIcon("entryTime")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-right hidden md:table-cell"
                      onClick={() => requestSort("exitTime")}
                    >
                      Exit Time {getSortIcon("exitTime")}
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Exit Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPositions.map((pos, idx) => (
                    <Dialog key={idx}>
                      <DialogTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-nyan-pink hover:text-black">
                          <TableCell>{pos.symbol}</TableCell>
                          <TableCell
                            className={`text-right ${pos.totalPnL >= 0 ? "text-nyan-green" : "text-nyan-red"}`}
                          >
                            {formatCurrency(pos.totalPnL)}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">{formatDate(pos.entryTime)}</TableCell>
                          <TableCell className="text-right hidden md:table-cell">{formatDate(pos.exitTime)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-xs">{pos.exitReason}</TableCell>
                        </TableRow>
                      </DialogTrigger>
                      <DialogContent className="pixel-border max-w-4xl text-xs bg-nyan-bg text-white">
                        <DialogHeader>
                          <DialogTitle className="text-nyan-pink">{pos.symbol} Position Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="md:col-span-1 space-y-2">
                            <h4 className="text-nyan-yellow">Summary</h4>
                            <p>
                              <strong>Total P&L:</strong>{" "}
                              <span className={pos.totalPnL >= 0 ? "text-nyan-green" : "text-nyan-red"}>
                                {formatCurrency(pos.totalPnL)}
                              </span>
                            </p>
                            <p>
                              <strong>Spot P&L:</strong> {formatCurrency(pos.spotPnL)}
                            </p>
                            <p>
                              <strong>Perp P&L:</strong> {formatCurrency(pos.perpPnL)}
                            </p>
                            <p>
                              <strong>Total Funding:</strong> {formatCurrency(pos.totalFunding)}
                            </p>
                            <p>
                              <strong>Holding Period:</strong> {pos.holdingPeriodHours} hours
                            </p>
                            <p>
                              <strong>Exit Reason:</strong> {pos.exitReason}
                            </p>
                          </div>
                          <div className="md:col-span-1 space-y-2">
                            <h4 className="text-nyan-yellow">Entry</h4>
                            <p>
                              <strong>Time:</strong> {new Date(pos.entryTime).toLocaleString()}
                            </p>
                            <p>
                              <strong>Spot Price:</strong> {formatCurrency(pos.entrySpotPrice)}
                            </p>
                            <p>
                              <strong>Perp Price:</strong> {formatCurrency(pos.entryPerpPrice)}
                            </p>
                            <p>
                              <strong>Funding APR:</strong> {formatPercent(pos.entryFundingAPR)}
                            </p>
                            <p>
                              <strong>Fees:</strong> {formatCurrency(pos.entryFees)}
                            </p>
                          </div>
                          <div className="md:col-span-1 space-y-2">
                            <h4 className="text-nyan-yellow">Exit</h4>
                            <p>
                              <strong>Time:</strong> {new Date(pos.exitTime).toLocaleString()}
                            </p>
                            <p>
                              <strong>Spot Price:</strong> {formatCurrency(pos.exitSpotPrice)}
                            </p>
                            <p>
                              <strong>Perp Price:</strong> {formatCurrency(pos.exitPerpPrice)}
                            </p>
                            <p>
                              <strong>Funding APR:</strong> {formatPercent(pos.exitFundingAPR)}
                            </p>
                            <p>
                              <strong>Fees:</strong> {formatCurrency(pos.exitFees)}
                            </p>
                          </div>
                          <div className="md:col-span-3">
                            <h4 className="text-nyan-yellow">Prediction</h4>
                            <Badge
                              variant={pos.predictedOutcome === "win" ? "default" : "destructive"}
                              className={
                                pos.predictedOutcome === "win" ? "bg-nyan-green text-black" : "bg-nyan-red text-white"
                              }
                            >
                              Predicted: {pos.predictedOutcome}
                            </Badge>
                            <span className="ml-2">Confidence: {formatPercent(pos.confidence * 100)}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>

        {/* Placeholder sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="pixel-border">
            <CardHeader>
              <CardTitle>Monthly Statistics</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">No monthly statistics data available yet.</p>
            </CardContent>
          </Card>
          <Card className="pixel-border">
            <CardHeader>
              <CardTitle>Symbol Statistics</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">No symbol statistics data available yet.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
