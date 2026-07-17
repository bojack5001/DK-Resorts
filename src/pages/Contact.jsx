import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { saveDBContactMessage } from '../lib/db';

// ─── Contact Form with Supabase integration ───────────────────
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await saveDBContactMessage({
        name:    form.name,
        email:   form.email,
        subject: form.subject,
        message: form.message,
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('[Contact] submit error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-10 shadow-2xl border border-gray-100">
      <h3 className="text-2xl font-heading font-bold mb-8 text-primary">Send a Message</h3>

      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✅ Thank you! Your message has been sent. We will get back to you shortly.
        </div>
      )}
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          ❌ Something went wrong. Please try again or call us directly.
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
            <input
              type="text" name="name" required
              value={form.name} onChange={handleChange}
              className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3"
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3"
              placeholder="Your Email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
          <input
            type="text" name="subject"
            value={form.subject} onChange={handleChange}
            className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3"
            placeholder="How can we help?"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
          <textarea
            name="message" required
            value={form.message} onChange={handleChange}
            className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3 h-32"
            placeholder="Your Message..."
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full btn-primary py-4 disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-primary">Get in Touch</h1>
              <p className="text-gray-600 leading-relaxed">
                Whether you have a question about our rooms, want to book the function hall, or simply want to say hello, we are here to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="bg-secondary/10 p-4 text-secondary rounded-full">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Our Location</h4>
                  <a
                    href="https://maps.app.goo.gl/Lu84a8a5iCgT2rEd9?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-secondary transition-colors"
                  >
                    No 202/2, PONNIYAMMAN, Kovil Street, KOLLAIMEDU VP MAHAL Backside, Vanjur, Vellore - 632006
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-secondary/10 p-4 text-secondary rounded-full">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Phone Number</h4>
                  <a href="tel:+919489455977" className="text-sm text-gray-500 hover:text-secondary transition-colors">+91 9489455977</a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-secondary/10 p-4 text-secondary rounded-full">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Email Address</h4>
                  <a href="mailto:dkresorts01@gmail.com" className="text-sm text-gray-500 hover:text-secondary transition-colors">dkresorts01@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-secondary/10 p-4 text-secondary rounded-full">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Working Hours</h4>
                  <p className="text-sm text-gray-500">24/7 Front Desk Support</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>

        {/* Map Section */}
        <div className="mt-20 h-[450px] bg-gray-100 border border-secondary/15 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <iframe
            src="https://maps.google.com/maps?q=Dk%20Star%20Resorts,%20No%20202/2,%20PONNIYAMMAN%20Kovil%20Street,%20VP%20MAHAL%20Backside,%20KOLLAIMEDU,%20Vanjur,%20Vellore,%20Tamil%20Nadu%20632006&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DK Star Resorts Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
