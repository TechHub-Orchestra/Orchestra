import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.json')

export interface Data {
  users: any[]
  cards: any[]
  virtualCards: any[]
  businessCards: any[]
  transactions: any[]
  routingRules: any[]
  anomalies: any[]
  insights: any[]
  expenseRequests: any[]
}

const DEFAULT_DATA: Data = {
  users: [],
  cards: [],
  virtualCards: [],
  businessCards: [],
  transactions: [],
  routingRules: [],
  anomalies: [],
  insights: [],
  expenseRequests: []
}

let memoryData: Data | null = null;

function readDB(): Data {
  if (memoryData) return memoryData
  if (!fs.existsSync(DB_PATH)) {
    memoryData = DEFAULT_DATA
    return DEFAULT_DATA
  }
  try {
    const content = fs.readFileSync(DB_PATH, 'utf-8')
    memoryData = JSON.parse(content)
  } catch (err) {
    memoryData = DEFAULT_DATA
  }
  return memoryData || DEFAULT_DATA
}

function writeDB(data: Data) {
  memoryData = data // Always keep latest in memory
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  } catch (err: any) {
    console.warn('DB Write Failed (Read-only filesystem?):', err.message);
  }
}

export const db = {
  get: <K extends keyof Data>(key: K): Data[K] => readDB()[key],
  update: <K extends keyof Data>(key: K, fn: (data: Data[K]) => Data[K]) => {
    const data = readDB()
    data[key] = fn(data[key])
    writeDB(data)
  },
  set: <K extends keyof Data>(key: K, value: Data[K]) => {
    const data = readDB()
    data[key] = value
    writeDB(data)
  },
  reset: () => {
    writeDB(DEFAULT_DATA);
  }
}
