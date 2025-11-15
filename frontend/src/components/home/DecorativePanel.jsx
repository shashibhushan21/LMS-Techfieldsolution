import { FiCheck } from 'react-icons/fi';

export default function DecorativePanel({ brandName }) {
  const features = [
    { icon: FiCheck, text: 'Industry-recognized certificates' },
    { icon: FiCheck, text: 'Real-world project experience' },
    { icon: FiCheck, text: 'Expert mentor guidance' },
    { icon: FiCheck, text: 'Build your professional portfolio' }
  ];

  const stats = [
    { value: '1000+', label: 'Students' },
    { value: '50+', label: 'Programs' },
    { value: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-16 text-white">
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-5xl font-heading font-bold mb-4">Welcome to {brandName}</h1>
            <p className="text-xl text-primary-100">Transform your career with expert-led internship programs</p>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 animate-slide-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <p className="text-lg">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; opacity: 0; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
