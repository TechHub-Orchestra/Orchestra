import Card from '../db/models/Card.js'
import CardBalance from '../db/models/CardBalance.js'

const LIVE  = process.env.CARD360_ENABLED === 'true'
const BASE  = process.env.CARD360_BASE_URL
const TOKEN = process.env.CARD360_TOKEN

const h = () => ({
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
})

// Real API calls — dormant until CARD360_ENABLED=true
const real = {
  fetchCard: (body) =>
    fetch(`${BASE}/card-management/api/v1/card/fetchSingle`,
      { method: 'POST', headers: h(), body: JSON.stringify(body) }
    ).then(r => r.json()),

  getBalance: (pan, type) =>
    fetch(`${BASE}/card-management/api/v1/card/${type}/balance`,
      { method: 'POST', headers: h(), body: JSON.stringify({ pan }) }
    ).then(r => r.json()),

  blockCard: (pan, type) =>
    fetch(`${BASE}/card-management/api/v1/card/${type === 'prepaid' ? 'prepaid/' : ''}block`,
      { method: 'POST', headers: h(), body: JSON.stringify({ pan }) }
    ).then(r => r.json()),

  unblockCard: (pan, type) =>
    fetch(`${BASE}/card-management/api/v1/card/${type === 'prepaid' ? 'prepaid/' : ''}unblock`,
      { method: 'POST', headers: h(), body: JSON.stringify({ pan }) }
    ).then(r => r.json()),
}

// Mock implementations — read/write MongoDB
const mock = {
  fetchCard: async ({ pan }) => {
    const card = await Card.findOne({ pan })
    if (!card) return { code: '10500', description: 'Card not found' }
    return {
      code: '00', description: 'Successful',
      cardDetails: [{
        pan: card.pan, expiryDate: card.expiryDate, issuerNr: card.issuerNr,
        firstName: card.firstName, lastName: card.lastName,
        nameOnCard: card.nameOnCard, cardProgram: card.cardProgram,
        customerId: card.customerId, cardStatus: card.cardStatus, seqNr: card.seqNr
      }]
    }
  },

  getBalance: async (pan) => {
    const b = await CardBalance.findOne({ pan }).sort({ fetchedAt: -1 })
    if (!b) return { code: '10500', description: 'Balance not found', availableBalance: 0, ledgerBalance: 0, currency: 'NGN' }
    return {
      code: '00', description: 'Successful',
      availableBalance: b.availableBalance,
      ledgerBalance: b.ledgerBalance, currency: b.currency
    }
  },

  blockCard: async (pan) => {
    await Card.findOneAndUpdate({ pan }, { cardStatus: '2' })
    return { code: '00', description: 'Card blocked successfully' }
  },

  unblockCard: async (pan) => {
    await Card.findOneAndUpdate({ pan }, { cardStatus: '1' })
    return { code: '00', description: 'Card unblocked successfully' }
  },
}

// Public interface — controllers always call these, never real/mock directly
export const card360 = {
  fetchCard:   (p)         => LIVE ? real.fetchCard(p)           : mock.fetchCard(p),
  getBalance:  (pan, type) => LIVE ? real.getBalance(pan, type)  : mock.getBalance(pan),
  blockCard:   (pan, type) => LIVE ? real.blockCard(pan, type)   : mock.blockCard(pan),
  unblockCard: (pan, type) => LIVE ? real.unblockCard(pan, type) : mock.unblockCard(pan),
}
