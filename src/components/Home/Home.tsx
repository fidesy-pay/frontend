export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FidesyPay</h1>
        </div>
      </header>
      <main className="mt-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col justify-center items-center">
          <div className="bg-white overflow-hidden shadow rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Welcome to our Crypto Payment Platform
            </h2>
            <p className="text-gray-700 mb-4">
              Our platform allows you to easily manage your cryptocurrency
              wallets and make payments securely and efficiently.
            </p>
            <p className="text-gray-700 mb-8">
              Get started by exploring your wallet balances below or
              <a href="/login" className="text-blue-600">
                log in
              </a>
              to access additional features.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 absolute bottom-0 w-full">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-gray-600 text-sm">
          <p>&copy; 2024 FidesyPay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
