import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Star, Users } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    reviews: 0,
    users: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all counts
      const [productsRes, ordersRes, reviewsRes, usersRes, recentOrdersRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/orders'),
        fetch('http://localhost:5000/api/reviews'),
        fetch('http://localhost:5000/api/users'),
        fetch('http://localhost:5000/api/orders')
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const reviews = await reviewsRes.json();
      const users = await usersRes.json();
      const allOrders = await recentOrdersRes.json();

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        reviews: reviews.total || 0, // Use total from the response object
        users: Array.isArray(users) ? users.length : 0
      });

      // Get last 5 orders
      setRecentOrders(Array.isArray(allOrders) ? allOrders.slice(0, 5) : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statsData = [
    { label: 'Total Products', value: stats.products || 0, icon: Package, color: '#3b82f6' },
    { label: 'Total Orders', value: stats.orders || 0, icon: ShoppingCart, color: '#10b981' },
    { label: 'Total Reviews', value: stats.reviews || 0, icon: Star, color: '#f59e0b' },
    { label: 'Total Users', value: stats.users || 0, icon: Users, color: '#8b5cf6' },
  ];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats-grid">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon size={28} color="#fff" />
              </div>
              <div className="stat-details">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value.toLocaleString()}</h3>
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
                <th>User</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.user}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.action}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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