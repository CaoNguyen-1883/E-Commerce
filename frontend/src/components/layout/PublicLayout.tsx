import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header will be added in Phase 2 */}
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">E-Commerce</h1>
            </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
            <Outlet />
        </main>

        {/* Footer will be added in Phase 2 */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 E-Commerce. All rights reserved.</p>
            </div>
        </footer>
        </div>
    );
};