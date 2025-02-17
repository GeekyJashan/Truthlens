import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Form submitted:', { name, email, message });
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-semibold">Get in Touch</h3>
        <div className="flex items-center space-x-4">
          <Mail className="h-6 w-6 text-primary" />
          <span>jsehgal2003@gmail.com</span>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="h-6 w-6 text-primary" />
          <span>6284782476</span>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6 text-primary" />
          <span>NIT Jalandhar, Punjab</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;