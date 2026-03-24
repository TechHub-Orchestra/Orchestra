// Always store in kobo, only convert for display
export const toNaira = (kobo: number | undefined) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', minimumFractionDigits: 2
  }).format((kobo || 0) / 100)

export const maskPAN = (pan: string | undefined) => {
  if (!pan || pan.startsWith('VIRT') || pan.startsWith('BIZ')) return pan
  return '**** **** **** ' + pan.slice(-4)
}

export const formatExpiry = (expiryDate: string | undefined) => {
  if (!expiryDate || expiryDate.length < 4) return ''
  return expiryDate.slice(2) + '/' + expiryDate.slice(0, 2)
}

export const formatDate = (date: string | Date | number) =>
  new Intl.DateTimeFormat('en-NG', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(date))

export const cardStatusLabel = (status: string | undefined) => {
  const labels: Record<string, string> = { '0': 'Inactive', '1': 'Active', '2': 'Blocked' }
  return status ? (labels[status] ?? 'Unknown') : 'Unknown'
}

export const cardStatusColor = (status: string | undefined) => {
  const colors: Record<string, string> = { '0': 'text-gray-500', '1': 'text-green-600', '2': 'text-red-600' }
  return status ? (colors[status] ?? '') : ''
}

export const percentUsed = (spent: number, budget: number) =>
  Math.min(100, Math.round((spent / budget) * 100))
