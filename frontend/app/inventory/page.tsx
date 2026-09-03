'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { inventoryApi } from '@/lib/api'
import { AlertTriangle, ShoppingCart, MoreVertical } from 'lucide-react'

const CATS = ['All Categories', 'Books & Media', 'Furniture', 'Lab Equipment', 'Stationary', 'IT & Electronics']
const STATUS_OPTS = ['All Items', 'In Stock', 'Low Stock Alert']

const MOCK_ITEMS = {
  total: 248,
  items: [
    { id: 'INV-1042', name: 'Advanced Physics Textbook', category: 'Books & Media', stock: 145, reorder: 50, status: 'Optimal' },
    { id: 'INV-2091', name: 'Student Desks (Standard)', category: 'Furniture', stock: 12, reorder: 20, status: 'Low Stock' },
    { id: 'INV-3015', name: 'Beaker Set 500ml', category: 'Lab Equipment', stock: 88, reorder: 30, status: 'Optimal' },
    { id: 'INV-4402', name: 'Dry Erase Markers (Pack)', category: 'Stationary', stock: 5, reorder: 25, status: 'Low Stock' },
    { id: 'INV-5110', name: 'Chromebook Pro', category: 'IT & Electronics', stock: 42, reorder: 10, status: 'Optimal' },
  ]
}

export default function InventoryPage() {
  const [cat, setCat] = useState('All Categories')
  const [stockStatus, setStockStatus] = useState('All Items')

  const { data = MOCK_ITEMS } = useQuery({
    queryKey: ['inventory', cat, stockStatus],
    queryFn: () => inventoryApi.list({ category: cat, status: stockStatus }).then(r => r.data),
    placeholderData: MOCK_ITEMS,
  })

  const filtered = data.items.filter((item: typeof MOCK_ITEMS['items'][0]) => {
    if (cat !== 'All Categories' && item.category !== cat) return false
    if (stockStatus === 'In Stock' && item.status !== 'Optimal') return false
    if (stockStatus === 'Low Stock Alert' && item.status !== 'Low Stock') return false
    return true
  })

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Entry', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-subtitle">Monitor stock levels, reorder thresholds, and track asset distribution.</p>
      </div>

      <div className="px-6 pb-8">
        <div className="flex gap-4">
          {/* Sidebar filters */}
          <div className="w-52 flex-shrink-0 space-y-4 animate-in stagger-1">
            <div className="card">
              <h3 className="font-bold mb-3">Categories</h3>
              <div className="space-y-1">
                {CATS.map(c => (
                  <label key={c} className="flex items-center gap-2.5 py-1 cursor-pointer">
                    <input type="checkbox" checked={cat === c} onChange={() => setCat(c)}
                           className="w-4 h-4 rounded" style={{ accentColor: '#C9A020' }} />
                    <span className="text-sm">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-bold mb-3">Stock Status</h3>
              <div className="space-y-1">
                {STATUS_OPTS.map(s => (
                  <label key={s} className="flex items-center gap-2.5 py-1 cursor-pointer">
                    <input type="radio" name="stockStatus" checked={stockStatus === s} onChange={() => setStockStatus(s)}
                           className="w-4 h-4" style={{ accentColor: '#C9A020' }} />
                    <span className="text-sm" style={{ color: s === 'Low Stock Alert' ? '#C9A020' : 'inherit', fontWeight: s === 'Low Stock Alert' ? 600 : 400 }}>
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 card p-0 overflow-hidden animate-in stagger-2">
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#E4E1D8' }}>
              <span className="text-sm" style={{ color: '#6B6660' }}>
                Showing 1–{filtered.length} of {data.total} items
              </span>
              <div className="flex gap-2">
                <button className="btn-dark text-xs px-3 py-1.5 flex items-center gap-1">Issue Item</button>
                <button className="btn-gold text-xs px-3 py-1.5 flex items-center gap-1">+ Add Stock</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: typeof MOCK_ITEMS['items'][0]) => {
                  const isLow = item.status === 'Low Stock'
                  return (
                    <tr key={item.id}>
                      <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{item.id}</td>
                      <td className="font-medium">{item.name}</td>
                      <td style={{ color: '#6B6660' }}>{item.category}</td>
                      <td>
                        <span className={`font-semibold ${isLow ? 'flex items-center gap-1' : ''}`}
                              style={{ color: isLow ? '#F59E0B' : '#0D0D0D' }}>
                          {isLow && <AlertTriangle size={13} />}
                          {item.stock}
                        </span>
                      </td>
                      <td style={{ color: '#6B6660' }}>{item.reorder}</td>
                      <td>
                        {isLow ? (
                          <span className="badge badge-orange">Low Stock</span>
                        ) : (
                          <span className="badge badge-green">Optimal</span>
                        )}
                      </td>
                      <td>
                        {isLow ? (
                          <button className="p-1.5 rounded-lg hover:bg-gray-100">
                            <ShoppingCart size={15} style={{ color: '#C9A020' }} />
                          </button>
                        ) : (
                          <button className="p-1.5 rounded-lg hover:bg-gray-100">
                            <MoreVertical size={15} style={{ color: '#6B6660' }} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: '#E4E1D8' }}>
              <button className="btn-outline text-xs">Previous</button>
              <button className="btn-outline text-xs">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
