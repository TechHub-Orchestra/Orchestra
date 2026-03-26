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

function readDB(): Data {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2))
    return DEFAULT_DATA
  }
  const content = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(content)
}

function writeDB(data: Data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
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
