export default function ComplianceStatus({ compliance }: { compliance?: any }) {
  const pct = compliance?.percent ?? 0
  const st = compliance?.state ?? 'CA'
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-2">Compliance</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-sm text-gray-600 mt-2">{pct}% complete • {st}</div>
    </div>
  )
}
