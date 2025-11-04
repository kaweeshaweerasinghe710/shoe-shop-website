import { Download } from 'lucide-react';

function Orders() {
  const orders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$125.99', date: '2024-01-15', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', date: '2024-01-15', status: 'Processing' },
    { id: '#ORD-003', customer: 'Bob Wilson', amount: '$234.00', date: '2024-01-14', status: 'Pending' },
    { id: '#ORD-004', customer: 'Alice Brown', amount: '$156.75', date: '2024-01-14', status: 'Completed' },
    { id: '#ORD-005', customer: 'Charlie Davis', amount: '$67.20', date: '2024-01-13', status: 'Cancelled' },
    { id: '#ORD-006', customer: 'Eva Martinez', amount: '$189.99', date: '2024-01-13', status: 'Completed' },
    { id: '#ORD-007', customer: 'Frank Johnson', amount: '$299.50', date: '2024-01-12', status: 'Processing' },
    { id: '#ORD-008', customer: 'Grace Lee', amount: '$45.99', date: '2024-01-12', status: 'Completed' },
  ];

  const handleExport = () => {
    alert('Export functionality - Orders data would be exported as CSV/Excel');
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={20} />
          Export Orders
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.amount}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
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
