import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Shield, Zap } from 'lucide-react';
import Features from './Features';
import Contact from './Contact';

interface HomeProps {
  setCurrentPage: (page: 'home' | 'auth' | 'editor' | 'dashboard' | 'pricing' | 'contact' | 'features') => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {

  return (
    <div className="space-y-16">
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg"
      >
        <h1 className="text-5xl font-bold mb-6">Welcome to TruthLens</h1>
        <p className="text-2xl mb-8">Unveiling the truth, one claim at a time</p>
        <Button 
          size="lg" 
          className="bg-background text-foreground hover:bg-accent"
          onClick={() => setCurrentPage('editor')}
        >
          <Search className="mr-2 h-5 w-5" /> Start Analyzing
        </Button>
      </motion.section>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Accurate Analysis</h2>
          <p>Our advanced AI ensures high-precision claim verification.</p>
        </div>
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Trusted Sources</h2>
          <p>We cross-reference claims with reputable information sources.</p>
        </div>
        <div className="text-center">
          <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Real-time Results</h2>
          <p>Get instant feedback on the credibility of your content.</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-muted p-8 rounded-lg"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Input Content", description: "Paste your text or upload a document" },
            { step: 2, title: "Detect Claims", description: "Our AI identifies factual statements" },
            { step: 3, title: "Verify Claims", description: "Cross-reference with trusted sources" },
            { step: 4, title: "View Results", description: "See highlighted true and false claims" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.section>
      <Features/>
      <Contact/>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-semibold mb-6">Ready to Uncover the Truth?</h2>
        <p className="text-xl mb-8">
          Join thousands of users who trust TruthLens for accurate claim verification.
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Sign Up for Free
        </Button>
      </motion.section>
    </div>
  );
};

export default Home;