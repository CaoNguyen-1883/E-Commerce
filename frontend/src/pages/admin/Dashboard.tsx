import { useOrderStats, useOrders } from "../../lib/hooks";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/staff/OrderStatusBadge";
import { Link } from "react-router-dom";
import {
  Package,
  TrendingUp,
  CheckCircle,
  Truck,
  Users,
  ShoppingBag,
  DollarSign,
  Star,
} from "lucide-react";

export const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: recentOrders, isLoading: ordersLoading } = useOrders({
    page: 0,
    size: 5,
    sort: "createdAt,desc",
  });

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: (stats?.pending || 0) + (stats?.confirmed || 0) + (stats?.delivered || 0),
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12.5%",
    },
    {
      title: "Pending Orders",
      value: stats?.pending || 0,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      urgent: true,
    },
    {
      title: "Delivered Orders",
      value: stats?.delivered || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Users",
      value: "2,450",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+8.2%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <span className="text-sm text-green-600 font-medium">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  {stat.urgent && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Requires attention
                    </p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45,231</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Products Listed
              </p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
              <p className="text-xs text-gray-500 mt-1">158 pending approval</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-xs text-gray-500 mt-1">From 2,450 reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders?.content.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            recentOrders?.content.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/orders?orderNumber=${order.orderNumber}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {order.orderNumber}
                      </Link>
                      <OrderStatusBadge status={order.orderStatus} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">{order.userFullName}</span>
                      <span className="mx-2">•</span>
                      <span>{order.items.length} items</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/orders?status=PENDING"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-center"
        >
          <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {stats?.pending || 0}
          </p>
        </Link>

        <Link
          to="/admin/products?status=PENDING_APPROVAL"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-center"
        >
          <ShoppingBag className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Products to Review</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">158</p>
        </Link>

        <Link
          to="/admin/reviews?status=PENDING"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-center"
        >
          <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Reviews to Moderate</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">23</p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-center"
        >
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Manage Users</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">2,450</p>
        </Link>
      </div>
    </div>
  );
};
