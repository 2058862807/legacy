export default function DocumentList() {
  const documents = [
    { id: 1, name: 'Last Will and Testament', date: '2024-08-29', status: 'Draft' },
    { id: 2, name: 'Power of Attorney', date: '2024-08-28', status: 'Completed' },
    { id: 3, name: 'Healthcare Directive', date: '2024-08-27', status: 'Review' }
  ]

  return (
    <div className="space-y-3">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">{doc.name}</div>
            <div className="text-sm text-gray-500">{doc.date}</div>
          </div>
          <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
            {doc.status}
          </span>
        </div>
      ))}
    </div>
  )
}