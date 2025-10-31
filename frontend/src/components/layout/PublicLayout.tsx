import { Outlet, Link } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              E-Commerce
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link to="/products" className="text-gray-700 hover:text-gray-900">
                Sản phẩm
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-gray-900">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Đăng ký
              </Link>
              
              {/* Staff Portal Links */}
              <div className="ml-4 border-l pl-4 flex gap-2">
                <Link
                  to="/admin/login"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Admin
                </Link>
                <Link
                  to="/seller/login"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Seller
                </Link>
                <Link
                  to="/staff/login"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Staff
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};