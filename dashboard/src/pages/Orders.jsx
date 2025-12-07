import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Order ID', 'User', 'Items', 'Shipping Address', 'Total Price',  'Date'],
      ...orders.map(order => [
        order._id,
        order.user,
        order.items.map(i => `${i.name} (${i.qty})`).join('; '),
        formatAddress(order.shippingAddress),
        order.totalPrice,
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders Management</h1>
        <button className="export-btn" onClick={handleExport}>
          <Download size={20} />
          Export Orders
        </button>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Shipping Address</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="order-id">#{order._id.slice(-6)}</td>
                <td>{order.user}</td>
                <td className="items-cell">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} x{item.qty}
                    </div>
                  ))}
                </td>
                <td className="address-cell">
                  {order.shippingAddress ? (
                    <div>
                      <div>{order.shippingAddress.line1}</div>
                      {order.shippingAddress.line2 && (
                        <div>{order.shippingAddress.line2}</div>
                      )}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                      <div>{order.shippingAddress.postalCode}</div>
                      <div className="country">{order.shippingAddress.country}</div>
                    </div>
                  ) : (
                    <span className="no-address">No address</span>
                  )}
                </td>
                <td className="price">${order.totalPrice.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                   
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;