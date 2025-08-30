export default function BlockchainStatus({ documents = [] as any[] }) {
  const count = documents.length
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-2">Blockchain Status</h2>
      <div className="text-gray-700">Secured documents: {count}</div>
      <div className="mt-2 text-xs text-gray-500">Example hash 0x8a3d…c42b</div>
    </div>
  )
}
