import { Crown, Star, Lock } from 'lucide-react'

export default function Subscription() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 py-8 px-4">
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="relative max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-indigo-200 mb-3">
            <Star className="w-3 h-3" /> Limited Time Launch Offer
          </div>
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-400/20 rounded-2xl backdrop-blur-sm">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Go Pro</h1>
          </div>
          <p className="text-indigo-200 text-sm">Unlock your full tracking potential</p>
        </div>

        {/* Pricing card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Price header */}
          <div className="bg-gradient-to-r from-indigo-600 to-teal-500 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-5xl font-bold text-white">$4.99</span>
              <div className="text-left">
                <p className="text-indigo-200 text-xs">/month</p>
                <p className="text-indigo-200 text-[10px] line-through opacity-60">$9.99/mo</p>
              </div>
            </div>
            <p className="text-indigo-100 text-xs">Launch price — lock it in forever</p>
          </div>

          {/* Features */}
          <div className="p-6">
            <div className="space-y-3 mb-6">
              {[
                { icon: '♾️', title: 'Unlimited measurements', desc: 'Track as often as you want' },
                { icon: '📸', title: 'Unlimited progress photos', desc: 'Visual proof of your journey' },
                { icon: '📊', title: 'Advanced body comparison', desc: 'Side-by-side analysis tools' },
                { icon: '📄', title: 'Data export (CSV / PDF)', desc: 'Take your data anywhere' },
                { icon: '🚀', title: 'Priority support', desc: 'Get help fast when you need it' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled
            >
              <Lock className="w-4 h-4" />
              Coming Soon — Payment Integration Pending
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Currently free to use. Payment will be enabled shortly.
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-6 text-center">
          <p className="text-xs text-indigo-200 mb-2">Join early adopters building their dream physique</p>
          <div className="flex items-center justify-center gap-1">
            {['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <p className="text-xs text-indigo-300 mt-1">5.0 average rating (early testers)</p>
        </div>
      </div>
    </div>
  )
}
