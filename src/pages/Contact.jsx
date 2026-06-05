import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-primary">Get in Touch</h1>
              <p className="text-gray-600 leading-relaxed">
                Whether you have a question about our rooms, want to book the function hall, or simply want to say hello, we're here to help.
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

          <div className="bg-white p-10 shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-heading font-bold mb-8 text-primary">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
                  <input type="text" className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                  <input type="email" className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3" placeholder="Your Email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                <input type="text" className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea className="w-full border-b border-gray-200 focus:border-secondary outline-none py-3 h-32" placeholder="Your Message..."></textarea>
              </div>
              <button className="w-full btn-primary py-4">Send Message</button>
            </form>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="mt-20 h-96 bg-gray-100 border border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest">Google Maps Integration Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
