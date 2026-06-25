import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Heart, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const OurStory = () => {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/craftsmanship.png" 
            alt="Our Story Hero" 
            className="w-full h-full object-cover opacity-40 scale-105 transform origin-center animate-[pulse_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4 block">Our Heritage</span>
            <h1 className="text-5xl md:text-7xl font-display font-light text-white mb-6">
              The <span className="font-bold">Journey</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Crafting timeless elegance and preserving the art of fine jewelry for generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">A Legacy of Brilliance</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Founded with a passion for exquisite design and uncompromising quality, The_Skj_Hub began as a small boutique with a grand vision. Our mission has always been to bring the finest fashion accessories and premium jewelry to those who appreciate true craftsmanship.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We believe that jewelry is more than just an accessory; it is an expression of individuality, a marker of precious moments, and a legacy passed down through time.
              </p>
              <div className="flex gap-4 mt-8">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-3xl font-display font-bold text-primary-600 mb-1">15+</h4>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Years Experience</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-3xl font-display font-bold text-primary-600 mb-1">10k+</h4>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Happy Clients</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="relative h-[500px]"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/images/hero.png" alt="Our Heritage" className="w-full h-full object-cover rounded-xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded-xl -z-10 hidden md:block"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Craftsmanship */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary-600 font-medium tracking-[0.2em] uppercase text-xs mb-2 block">The Process</span>
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-16">Our Craftsmanship</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-accent">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Premium Materials</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                We source only the finest ethical diamonds, purest golds, and authentic gemstones to ensure lasting brilliance.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-accent">
                <Heart className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Handpicked Collections</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Every piece in our catalog is meticulously selected for its unique design and flawless execution.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-accent">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Artisan Excellence</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Our master craftsmen blend traditional techniques with modern technology to create absolute perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why Choose Us</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Experience the pinnacle of luxury shopping with our dedicated services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-colors">
              <ShieldCheck className="h-10 w-10 text-accent mb-6" />
              <h3 className="text-lg font-bold mb-3">Premium Quality</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Uncompromising standards in every single piece.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-colors">
              <Award className="h-10 w-10 text-accent mb-6" />
              <h3 className="text-lg font-bold mb-3">Trusted Store</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Thousands of authentic reviews from verified buyers.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-colors">
              <Truck className="h-10 w-10 text-accent mb-6" />
              <h3 className="text-lg font-bold mb-3">Fast Delivery</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Insured, secure, and express global shipping.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-colors">
              <Clock className="h-10 w-10 text-accent mb-6" />
              <h3 className="text-lg font-bold mb-3">Easy Returns</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Hassle-free 30-day return and exchange policy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Journey */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2 block">Our Path</span>
            <h2 className="text-4xl font-display font-bold text-slate-900">Brand Journey</h2>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/4 text-right">
                <span className="text-2xl font-display font-bold text-primary-600">2010</span>
              </div>
              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-full bg-slate-200 my-2"></div>
              </div>
              <div className="md:w-3/4 pb-8 md:border-l-0 border-l-2 border-slate-200 pl-6 md:pl-0">
                <h3 className="text-xl font-bold text-slate-900 mb-2">The Inception</h3>
                <p className="text-slate-600">Started as a humble bespoke jewelry studio in the heart of the city.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/4 text-right">
                <span className="text-2xl font-display font-bold text-primary-600">2015</span>
              </div>
              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-full bg-slate-200 my-2"></div>
              </div>
              <div className="md:w-3/4 pb-8 md:border-l-0 border-l-2 border-slate-200 pl-6 md:pl-0">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Expanding Horizons</h3>
                <p className="text-slate-600">Launched our first flagship store, showcasing our signature bridal collection.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/4 text-right">
                <span className="text-2xl font-display font-bold text-primary-600">2020</span>
              </div>
              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-full bg-slate-200 my-2"></div>
              </div>
              <div className="md:w-3/4 pb-8 md:border-l-0 border-l-2 border-slate-200 pl-6 md:pl-0">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Transformation</h3>
                <p className="text-slate-600">Brought our luxury experience online, reaching jewelry lovers globally.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/4 text-right">
                <span className="text-2xl font-display font-bold text-primary-600">Today</span>
              </div>
              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
              </div>
              <div className="md:w-3/4 pl-6 md:pl-0">
                <h3 className="text-xl font-bold text-slate-900 mb-2">A Recognized Brand</h3>
                <p className="text-slate-600">Continuing to innovate while staying true to our roots of handcrafted perfection.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-100 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Be Part of Our Story</h2>
          <p className="text-slate-600 mb-10 text-lg">
            Discover pieces that resonate with your style and become part of your own beautiful journey.
          </p>
          <Link to="/products" className="inline-block bg-slate-900 text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-primary-700 transition-colors">
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
