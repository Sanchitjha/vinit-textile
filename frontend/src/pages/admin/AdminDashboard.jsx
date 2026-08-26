import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/dashboard')
        setStats(response.data)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="text-gray-500 animate-pulse">Loading dashboard...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Sarees" value={stats.totalSarees} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Pending Reviews" value={stats.pendingReviews} />
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-3xl font-display text-brown">{value}</p>
    </div>
  )
}
