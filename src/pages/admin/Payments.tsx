import React, { useState } from 'react';
import { CreditCard, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);

  // Mock payments data
  const payments = [
    {
      id: 1,
      transactionId: 'TXN_001234',
      user: 'John Doe',
      email: 'john@example.com',
      course: 'Web Development Fundamentals',
      amount: 99,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'Credit Card',
      date: '2024-01-18',
      processedDate: '2024-01-18 14:30:00',
      instructorShare: 79.20,
      platformFee: 19.80
    },
    {
      id: 2,
      transactionId: 'TXN_001235',
      user: 'Jane Smith',
      email: 'jane@example.com',
      course: 'React for Beginners',
      amount: 79,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'PayPal',
      date: '2024-01-17',
      processedDate: '2024-01-17 09:15:00',
      instructorShare: 63.20,
      platformFee: 15.80
    },
    {
      id: 3,
      transactionId: 'TXN_001236',
      user: 'Mike Johnson',
      email: 'mike@example.com',
      course: 'Python Programming',
      amount: 89,
      currency: 'USD',
      status: 'pending',
      paymentMethod: 'Credit Card',
      date: '2024-01-16',
      processedDate: null,
      instructorShare: 71.20,
      platformFee: 17.80
    },
    {
      id: 4,
      transactionId: 'TXN_001237',
      user: 'Sarah Wilson',
      email: 'sarah@example.com',
      course: 'Data Science with Python',
      amount: 149,
      currency: 'USD',
      status: 'failed',
      paymentMethod: 'Credit Card',
      date: '2024-01-15',
      processedDate: null,
      instructorShare: 119.20,
      platformFee: 29.80
    },
    {
      id: 5,
      transactionId: 'TXN_001238',
      user: 'David Brown',
      email: 'david@example.com',
      course: 'UI/UX Design Principles',
      amount: 119,
      currency: 'USD',
      status: 'refunded',
      paymentMethod: 'PayPal',
      date: '2024-01-14',
      processedDate: '2024-01-14 16:45:00',
      instructorShare: 0,
      platformFee: 0
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || payment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <DollarSign className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSelectPayment = (paymentId: number) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPayments(
      selectedPayments.length === filteredPayments.length
        ? []
        : filteredPayments.map(payment => payment.id)
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on payments:`, selectedPayments);
    // In real app, this would call API
    setSelectedPayments([]);
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Payments Management</h1>
            <p className="text-gray-600">Monitor transactions, process payments, and manage refunds</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 border border-gray-300 text-text px-4 py-2 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Process Payments
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{payments.filter(p => p.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Successful Payments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">{pendingPayments}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">{failedPayments}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search payments by user, email, transaction ID, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPayments.length > 0 && (
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {selectedPayments.length} payment{selectedPayments.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => handleBulkAction('process')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Process
              </button>
              <button
                onClick={() => handleBulkAction('refund')}
                className="text-yellow-600 hover:text-yellow-800 text-sm"
              >
                Refund
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text">{payment.transactionId}</div>
                        <div className="text-sm text-gray-500">
                          {payment.processedDate || 'Not processed'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text">{payment.user}</div>
                        <div className="text-sm text-gray-500">{payment.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text max-w-xs truncate">{payment.course}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text">
                          ${payment.amount} {payment.currency}
                        </div>
                        <div className="text-xs text-gray-500">
                          Instructor: ${payment.instructorShare}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-secondary hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </button>
                        {payment.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-800">
                            Process
                          </button>
                        )}
                        {payment.status === 'completed' && (
                          <button className="text-yellow-600 hover:text-yellow-800">
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
                <span className="font-medium">{filteredPayments.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-900">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* No Payments */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;