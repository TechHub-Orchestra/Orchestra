const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('--- Starting API Tests ---');
  let token = '';

  try {
    // 1. Register
    console.log('\n[1] Testing Registration...');
    const regRes = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      role: 'business',
      businessName: 'Test Corp'
    });
    console.log('Reg Success:', regRes.data.success);
    token = regRes.data.token;
    const userId = regRes.data.user._id;

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Me
    console.log('\n[2] Testing Auth Me...');
    const meRes = await axios.get(`${BASE_URL}/api/auth/me`, { headers });
    console.log('Me Name:', meRes.data.user.name);

    // 3. Add Card
    console.log('\n[3] Testing Add Card...');
    const cardRes = await axios.post(`${BASE_URL}/api/cards`, {
      label: 'Salary Card',
      bank: 'TestBank',
      cardProgram: 'VISA',
      pan: '123456******7890',
      availableBalance: 50000000 // 500k naira in kobo
    }, { headers });
    console.log('Card ID:', cardRes.data.card._id);
    const cardId = cardRes.data.card._id;

    // 4. List Cards
    console.log('\n[4] Testing List Cards...');
    const listCardsRes = await axios.get(`${BASE_URL}/api/cards`, { headers });
    console.log('Cards count:', listCardsRes.data.cards.length);

    // 5. Create Transaction
    console.log('\n[5] Testing Create Transaction...');
    const txRes = await axios.post(`${BASE_URL}/api/transactions`, {
      amount: 150000,
      merchant: 'Starlink',
      category: 'utilities',
      cardId: cardId
    }, { headers });
    console.log('Tx ID:', txRes.data.transaction._id);
    console.log('Is Anomaly:', txRes.data.transaction.isAnomaly);
    
    // 6. Simulate Routing
    console.log('\n[6] Testing Routing Simulation...');
    const simRes = await axios.post(`${BASE_URL}/api/routing/simulate`, {
      amount: 20000,
      merchant: 'Bolt',
      category: 'transport'
    }, { headers });
    console.log('Sim Steps:', simRes.data.steps.length);
    console.log('Sim Mode:', simRes.data.mode);

    // 7. Virtual Cards
    console.log('\n[7] Testing Virtual Card Creation...');
    const vCardRes = await axios.post(`${BASE_URL}/api/virtual-cards`, {
      label: 'Netflix Sub',
      spendLimit: 1000000,
      parentCardId: cardId
    }, { headers });
    console.log('VCard ID:', vCardRes.data.card._id);
    const vCardId = vCardRes.data.card._id;

    // 8. Patch Virtual Card
    console.log('\n[8] Testing Virtual Card Pause...');
    const patchVCardRes = await axios.patch(`${BASE_URL}/api/virtual-cards/${vCardId}`, { action: 'pause' }, { headers });
    console.log('Paused?', patchVCardRes.data.card.paused);

    // 9. Insights
    console.log('\n[9] Testing Insights...');
    const insightRes = await axios.get(`${BASE_URL}/api/insights`, { headers });
    console.log('Summary:', insightRes.data.insights.summary);

    // 10. Business 
    console.log('\n[10] Testing Business Dashboard...');
    const bizRes = await axios.get(`${BASE_URL}/api/business`, { headers });
    console.log('Biz Cards Count:', bizRes.data.cards.length);

    console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error('\n!!! TEST FAILED !!!');
    if (err.response) {
      console.error('Error Data:', err.response.data);
      console.error('Error Status:', err.response.status);
    } else {
      console.error('Error Message:', err.message);
    }
    process.exit(1);
  }
}

test();
