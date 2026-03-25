import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    insights: {
      summary: "You've total spent ₦425,000 across all categories this month. Food and Shopping are your highest categories.",
      insights: [
        "Your weekly food spend increased by 15%",
        "Netflix subscription is on an inactive virtual card",
        "Multiple small transactions at Shoprite flagged"
      ],
      recommendations: [
        "Reduce Food spending by ₦20,000",
        "Move GTBank balance to Access Bank for higher interest",
        "Deactivate GTBank card to avoid maintenance fees"
      ],
      savingsOpportunity: 45000,
      byCategory: {
        food: 12000000,
        transport: 4500000,
        shopping: 18000000,
        subscriptions: 3500000,
        utilities: 2000000,
        entertainment: 2500000
      }
    }
  })
}
