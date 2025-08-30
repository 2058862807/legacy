export default function ComplianceStatus() {
  const complianceItems = [
    { name: 'State Requirements', status: 'Compliant', color: 'green' },
    { name: 'Witness Signatures', status: 'Pending', color: 'yellow' },
    { name: 'Notarization', status: 'Required', color: 'red' },
    { name: 'Tax Implications', status: 'Review Needed', color: 'yellow' }
  ]

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800'
      case 'yellow': return 'bg-yellow-100 text-yellow-800'
      case 'red': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-3">
      {complianceItems.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <span className="font-medium">{item.name}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.color)}`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  )
}