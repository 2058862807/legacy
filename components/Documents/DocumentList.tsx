export default function DocumentList({ documents = [] as any[] }) {
  if (!documents.length) return <div className="text-gray-500">No documents yet.</div>
  return (
    <div className="space-y-3">
      {documents.map((d: any, i: number) => (
        <div key={i} className="p-3 border rounded-lg flex justify-between">
          <span>{d.name || 'Document'}</span>
          <span className="text-sm text-gray-500">{d.status || 'Draft'}</span>
        </div>
      ))}
    </div>
  )
}
