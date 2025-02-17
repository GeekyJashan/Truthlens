import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingTier: React.FC<{ name: string; price: string; features: string[] }> = ({ name, price, features }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border rounded-lg p-6 flex flex-col"
  >
    <h3 className="text-2xl font-bold mb-4">{name}</h3>
    <p className="text-3xl font-bold mb-6">{price}</p>
    <ul className="space-y-2 mb-6 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          {feature}
        </li>
      ))}
    </ul>
    <Button className="w-full">Choose Plan</Button>
  </motion.div>
);

const Pricing: React.FC = () => {
  const pricingTiers = [
    {
      name: 'Basic',
      price: '$9.99/mo',
      features: ['100 analyses per month', 'Basic claim detection', 'Email support'],
    },
    {
      name: 'Pro',
      price: '$29.99/mo',
      features: ['Unlimited analyses', 'Advanced claim detection', 'Priority support', 'Custom integrations'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited analyses', 'Advanced claim detection', 'Dedicated support', 'Custom AI model training'],
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-xl text-muted-foreground">Choose the plan that fits your needs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <PricingTier key={index} {...tier} />
        ))}
      </div>
    </div>
  );
};

export default Pricing;