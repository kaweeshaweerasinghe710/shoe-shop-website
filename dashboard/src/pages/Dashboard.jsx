import { Package, ShoppingCart, Star, Users } from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Total Products', value: '1,234', icon: Package, color: '#3b82f6' },
    { label: 'Total Orders', value: '856', icon: ShoppingCart, color: '#10b981' },
    { label: 'Total Reviews', value: '432', icon: Star, color: '#f59e0b' },
    { label: 'Total Users', value: '2,145', icon: Users, color: '#8b5cf6' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$125.99', status: 'Completed', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', date: '2024-01-15' },
    { id: '#ORD-003', customer: 'Bob Wilson', amount: '$234.00', status: 'Pending', date: '2024-01-14' },
    { id: '#ORD-004', customer: 'Alice Brown', amount: '$156.75', status: 'Completed', date: '2024-01-14' },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon size={28} color="#fff" />
              </div>
              <div className="stat-details">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-orders">
        <h2 className="section-title">Recent Orders</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
