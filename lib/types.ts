export interface Summary {
  initialCapital: number
  finalCapital: number
  totalReturn: number
  totalReturnDollars: number
  numberOfTrades: number
  winningTrades: number
  winRate: number
  maxDrawdown: number
  totalDays: number
}

export interface EquityDataPoint {
  timestamp: number
  value: number
}

export interface FundingMomentum {
  symbol: string
  trend: string
  strength: number
  lastRates: number[]
  avgDecline: number
}

export interface Volatility {
  symbol: string
  currentVol: number
  avgVol: number
  volPercentile: number
  isLowVol: boolean
}

export interface Signals {
  fundingMomentum: FundingMomentum
  volatility: Volatility
  riskScore: number
  entryRecommendation: string
  exitRecommendation: string
}

export interface Position {
  symbol: string
  entryTime: number
  exitTime: number
  entrySpotPrice: number
  entryPerpPrice: number
  exitSpotPrice: number
  exitPerpPrice: number
  quantity: number
  fundingPayments: number[]
  totalPnL: number
  entryFundingRate: number
  entryFundingAPR: number
  concurrentPositions: number
  exitFundingRate: number
  exitFundingAPR: number
  exitReason: string
  holdingPeriodHours: number
  fundingPeriodsHeld: number
  spotPnL: number
  perpPnL: number
  totalFunding: number
  entryFees: number
  exitFees: number
  predictedOutcome: string
  confidence: number
  mlPrediction?: {
    willDecline: boolean
    confidence: number
    expectedReturn: number
    riskAdjustedScore: number
  }
}

export interface Config {
  startDate: string
  endDate: string
  initialCapital: number
  minAPR: number
  useML: boolean
  riskThreshold: number
}

export interface SignalAccuracy {
  totalPredictions: number
  correctPredictions: number
  accuracy: number
  avgConfidence: number
}

export interface FeatureImportance {
  fundingMomentum: number
  volatilityFilter: number
  riskScore: number
}

export interface BacktestData {
  summary: Summary
  equityCurve: EquityDataPoint[]
  positions: Position[]
  config: Config
  detailedPositions: Position[]
  optimizedPositions: Position[]
  signalAccuracy: SignalAccuracy
  featureImportance: FeatureImportance
  monthlyStats: any[]
  symbolStats: Record<string, any>
}
