import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Gem } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-8 group inline-flex">
              <Gem className="h-6 w-6 text-accent group-hover:rotate-12 transition-transform duration-500" />
              <span className="font-brand font-bold text-2xl tracking-wide text-white">The_Skj_Hub</span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 font-light text-slate-400">
              Where exceptional craftsmanship meets contemporary design. Elevate your presence with our exclusive fine jewelry collections.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-xs font-bold tracking-widest text-slate-400 hover:text-accent transition-colors">FB</a>
              <a href="#" className="text-xs font-bold tracking-widest text-slate-400 hover:text-accent transition-colors">IG</a>
              <a href="#" className="text-xs font-bold tracking-widest text-slate-400 hover:text-accent transition-colors">X</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-[0.2em] text-xs">The Maison</h4>
            <ul className="space-y-4">
              <li><Link to="/our-story" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Our Heritage</Link></li>
              <li><Link to="/products" className="text-sm font-light text-slate-400 hover:text-white transition-colors">High Jewelry</Link></li>
              <li><Link to="/faq" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Boutiques</Link></li>
              <li><Link to="/contact" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-[0.2em] text-xs">Client Care</h4>
            <ul className="space-y-4">
              <li><Link to="/orders" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/privacy" className="text-sm font-light text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-[0.2em] text-xs">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm font-light text-slate-400">123 Fashion Street, Jewelry District, NY 10001</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm font-light text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm font-light text-slate-400">concierge@theskjhub.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-light tracking-wide">
          <p>&copy; {new Date().getFullYear()} The_Skj_Hub. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
