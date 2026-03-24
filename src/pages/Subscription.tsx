import { Crown } from 'lucide-react'

export default function Subscription() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Crown className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
        <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
        <p className="text-gray-600 mt-2">Unlock unlimited measurements and features</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-indigo-600">$4.99</span>
          <span className="text-gray-500">/month</span>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            'Unlimited measurements',
            'Unlimited progress photos',
            'Advanced body comparison',
            'Data export (CSV/PDF)',
            'Priority support',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          disabled
        >
          Coming Soon - Payment Integration Pending
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Currently free to use. Payment will be enabled soon.
        </p>
      </div>
    </div>
  )
}
