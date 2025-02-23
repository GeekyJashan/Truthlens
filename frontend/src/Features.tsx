import React from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Zap, BarChart, Globe, Lock } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border rounded-lg p-6"
  >
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-10 w-10" />,
      title: 'Advanced Claim Detection',
      description: 'Our AI-powered system accurately identifies claims within any text.',
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Trusted Verification',
      description: 'We cross-reference claims with reputable sources for accurate fact-checking.',
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: 'Real-time Analysis',
      description: 'Get instant results as you type or paste your content.',
    },
    {
      icon: <BarChart className="h-10 w-10" />,
      title: 'Detailed Reports',
      description: 'Receive comprehensive reports on the credibility of your content.',
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Multi-language Support',
      description: 'Analyze content in multiple languages for global fact-checking.',
    },
    {
      icon: <Lock className="h-10 w-10" />,
      title: 'Secure and Private',
      description: 'Your data is encrypted and never shared with third parties.',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Our Features</h2>
        <p className="text-xl text-muted-foreground">Discover what makes TruthLens the leading fact-checking platform</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Features;