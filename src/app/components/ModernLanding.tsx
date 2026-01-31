import { motion } from 'motion/react';
import { 
  Sparkles, Rocket, Zap, Users, Shield, TrendingUp, 
  MapPin, Moon, Sun, ChevronRight, Star, Brain, 
  Target, Award, Globe, ArrowRight, Leaf
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/app/components/LanguageSelector';
import logoImage from 'figma:asset/25c5588292113533c4d842999e3987384b1675f9.png';

interface ModernLandingProps {
  onSelectPortal: (portal: 'user' | 'collaborator' | 'authority' | 'ngo') => void;
}

export default function ModernLanding({ onSelectPortal }: ModernLandingProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden relative">
      {/* Indian Heritage Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-15"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1667849521034-0086c275e6da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGdhdGUlMjBtb251bWVudCUyMGRlbGhpfGVufDF8fHx8MTc2OTMyNzg0OHww&ixlib=rb-4.1.0&q=80&w=1080)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-white/10 to-green-500/10 dark:from-orange-500/5 dark:via-transparent dark:to-green-500/5" />
      </div>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/30 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl"
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <img src={logoImage} alt="JanMarg AI" className="h-12 w-12 rounded-xl" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  JANMARG
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">AI-Powered Civic Intelligence Platform</p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <LanguageSelector variant="outline" />
              
              <motion.button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-16">
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full px-4 py-2 mb-6 border border-purple-200 dark:border-purple-800">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-300">AI-Powered Civic Platform</span>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                One Stop Solution
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">to All Civic Issues</span>
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
            >
              Report, Track, and Resolve civic issues with the power of AI, community collaboration, and transparent governance
            </motion.p>

            {/* Portal Selection Cards */}
            <motion.div 
              variants={containerVariants}
              className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
              {/* User Portal */}
              <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }}>
                <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 border-0 cursor-pointer group" onClick={() => onSelectPortal('user')}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">👤 Citizen Login</h3>
                    <p className="text-blue-100 mb-4">Report and track civic issues in your community</p>
                    <div className="flex items-center justify-center text-white font-medium">
                      <span>Get Started</span>
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Collaborator Portal */}
              <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }}>
                <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 border-0 cursor-pointer group" onClick={() => onSelectPortal('collaborator')}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">👨🏻‍🔧 Contractor Login</h3>
                    <p className="text-purple-100 mb-4">Bid on projects and build your community</p>
                    <div className="flex items-center justify-center text-white font-medium">
                      <span>Start Bidding</span>
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Authority Portal */}
              <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }}>
                <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 border-0 cursor-pointer group" onClick={() => onSelectPortal('authority')}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[4px]"
                  />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">👨🏻‍💼 Authority Login</h3>
                    <p className="text-pink-100 mb-4">Manage issues with AI-powered insights</p>
                    <div className="flex items-center justify-center text-white font-medium">
                      <span>Access Dashboard</span>
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* NGO Portal */}
              <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }}>
                <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 border-0 cursor-pointer group" onClick={() => onSelectPortal('ngo')}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">👥 NGO Login</h3>
                    <p className="text-green-100 mb-4">Support and engage with civic initiatives</p>
                    <div className="flex items-center justify-center text-white font-medium">
                      <span>Join Now</span>
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Visual Showcase */}
      <section className="relative z-10 py-16 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden h-64 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1704853241465-3c65c2c90533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNtYXJ0JTIwY2l0eSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY5NDEyNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Smart City Technology"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h4 className="text-xl font-bold mb-1">Smart City Integration</h4>
                  <p className="text-sm text-gray-200">Modern infrastructure meets AI</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden h-64 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1756908992154-c8a89f5e517f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTQxMjY3MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="AI Analytics"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h4 className="text-xl font-bold mb-1">AI-Powered Analytics</h4>
                  <p className="text-sm text-gray-200">Real-time insights & predictions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden h-64 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1709967884183-7ffa9d168508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGdvdmVybm1lbnQlMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njk0MTI2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Government Infrastructure"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h4 className="text-xl font-bold mb-1">Trusted Governance</h4>
                  <p className="text-sm text-gray-200">Transparent public services</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Powered by <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Advanced AI</span>
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Next-generation features that make civic engagement effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'AI Insights', desc: 'Smart analytics & predictions', color: 'from-purple-500 to-pink-500' },
              { icon: Target, title: 'Auto-Priority', desc: 'Intelligent issue ranking', color: 'from-blue-500 to-cyan-500' },
              { icon: Zap, title: 'Real-time Bidding', desc: 'Transparent marketplace', color: 'from-orange-500 to-yellow-500' },
              { icon: MapPin, title: 'Location Intelligence', desc: 'Hotspot detection & mapping', color: 'from-green-500 to-teal-500' },
              { icon: Shield, title: 'Verified Contractors', desc: 'Rated & trusted partners', color: 'from-red-500 to-pink-500' },
              { icon: TrendingUp, title: 'Live Analytics', desc: 'Real-time performance metrics', color: 'from-indigo-500 to-purple-500' },
              { icon: Award, title: 'Trust Scoring', desc: 'Community reputation system', color: 'from-yellow-500 to-orange-500' },
              { icon: Globe, title: 'Multi-State Support', desc: 'Pan-India coverage', color: 'from-cyan-500 to-blue-500' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI/ML Highlight Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-200 dark:bg-purple-800/30 rounded-full px-4 py-2 mb-4">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Powered by Advanced AI/ML</span>
            </div>
            <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Machine Learning at the Core
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform uses cutting-edge artificial intelligence to make civic governance smarter, faster, and more efficient
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700">
                <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                <h4 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Natural Language Processing</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our NLP models automatically categorize issues, detect duplicates, analyze sentiment, and extract key information from citizen reports.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Automatic issue categorization with 94% accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Sentiment analysis for community emotion tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Smart duplicate detection to prevent redundancy</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700">
                <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h4 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Predictive Analytics</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Machine learning models predict resolution times, estimate costs, assess risks, and prioritize issues based on multiple factors.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>AI-driven cost estimation for budget planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Risk assessment: Low, Medium, High, Critical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Predicted resolution dates based on historical data</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700">
                <Leaf className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                <h4 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Impact Assessment Models</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Advanced algorithms calculate community impact, environmental consequences, and urgency scores for intelligent prioritization.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Community impact scoring (0-100 scale)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Environmental impact assessment for sustainability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Urgency and severity scoring algorithms</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700">
                <TrendingUp className="h-12 w-12 text-orange-600 dark:text-orange-400 mb-4" />
                <h4 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Real-time Learning</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our AI continuously learns from new data, improving accuracy and adapting to changing patterns in civic issues.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Models improve with every reported issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Pattern recognition for hotspot detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Adaptive algorithms for better predictions</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              { value: '10K+', label: 'Issues Resolved', icon: Star },
              { value: '50K+', label: 'Active Citizens', icon: Users },
              { value: '500+', label: 'Verified Contractors', icon: Award },
              { value: '98%', label: 'Satisfaction Rate', icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="relative"
              >
                <motion.div animate={floatAnimation}>
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Government Authenticity Section */}
      <section className="relative z-10 py-16 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-orange-900/10 dark:via-gray-900 dark:to-green-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 rounded-full px-4 py-2 mb-4">
                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Government Initiative</span>
              </div>
              <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">Government of India</span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                JanMarg AI is an official digital governance platform committed to serving citizens across all states of India with transparency, efficiency, and innovation.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Secure & Confidential</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Your data is protected with government-grade security</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Pan-India Coverage</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">All 28 states and 8 union territories supported</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Real Government Action</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Direct connection to municipal authorities</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1760872645513-63b6846ce3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHBhcmxpYW1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjkzMzE0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Government Building"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">Digital India Initiative</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Empowering Citizens Through Technology</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tricolor accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20">
                <div className="w-full h-1/3 bg-orange-500"></div>
                <div className="w-full h-1/3 bg-white dark:bg-gray-200"></div>
                <div className="w-full h-1/3 bg-green-500"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-3xl p-12 shadow-2xl"
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Community?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of citizens making a real difference
            </p>
            <Button
              onClick={() => onSelectPortal('user')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logoImage} alt="JANMARG" className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">JANMARG</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering communities through AI-driven civic engagement
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 JANMARG. Built with ❤️ for India
          </p>
        </div>
      </footer>
    </div>
  );
}