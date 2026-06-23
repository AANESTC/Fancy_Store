import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star, PlayCircle, Mail } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/products?pageSize=4');
        if (res.data && res.data.products) {
          setTrending(res.data.products);
        }
      } catch (err) {
        console.error("Failed to load trending", err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Hero Jewelry" 
            className="w-full h-full object-cover opacity-50 scale-105 transform origin-center animate-[pulse_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent"></div>
              <span className="text-accent font-medium tracking-[0.2em] uppercase text-xs">Exquisite Collection 2024</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white leading-tight mb-8">
              Redefining <br/> <span className="font-bold">Elegance.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-light">
              Discover masterpieces crafted with precision. Elevate your presence with our exclusive bridal bangles, invisible chains, and diamond earrings.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/products" className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 rounded-none text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-3 group">
                Shop The Collection
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="text-white flex items-center gap-3 text-sm font-medium hover:text-accent transition-colors group">
                <PlayCircle className="h-10 w-10 font-light group-hover:scale-110 transition-transform" />
                Watch Brand Film
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Luxury Features */}
      <section className="py-10 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="flex flex-col items-center p-4 text-center group">
              <Truck className="h-6 w-6 text-slate-400 mb-3 group-hover:text-primary-600 transition-colors" />
              <h3 className="font-display font-bold text-slate-900 mb-1 tracking-wide">Complimentary Shipping</h3>
              <p className="text-slate-500 text-xs uppercase tracking-wider">On all orders worldwide</p>
            </div>
            <div className="flex flex-col items-center p-4 text-center group">
              <ShieldCheck className="h-6 w-6 text-slate-400 mb-3 group-hover:text-primary-600 transition-colors" />
              <h3 className="font-display font-bold text-slate-900 mb-1 tracking-wide">Lifetime Warranty</h3>
              <p className="text-slate-500 text-xs uppercase tracking-wider">On all diamond pieces</p>
            </div>
            <div className="flex flex-col items-center p-4 text-center group">
              <RefreshCw className="h-6 w-6 text-slate-400 mb-3 group-hover:text-primary-600 transition-colors" />
              <h3 className="font-display font-bold text-slate-900 mb-1 tracking-wide">Bespoke Returns</h3>
              <p className="text-slate-500 text-xs uppercase tracking-wider">30-day elegant exchange</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Bestsellers */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2 block">Curated For You</span>
              <h2 className="text-4xl font-display font-bold text-slate-900">Trending Masterpieces</h2>
            </div>
            <Link to="/products" className="hidden md:flex text-sm font-bold tracking-widest uppercase text-primary-600 hover:text-primary-800 items-center gap-2 group border-b border-primary-600 pb-1">
              View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.length > 0 ? (
              trending.map((item) => (
                <Link key={item.productId} to={`/products/${item.productId}`} className="group block">
                  <div className="relative h-[400px] mb-4 overflow-hidden bg-slate-50">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-slate-900 p-3 rounded-full shadow-lg hover:text-red-500 hover:scale-110 transition-all">
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>

                </Link>
              ))
            ) : (
              <p className="text-slate-500 col-span-4 text-center">Loading masterpieces...</p>
            )}
          </div>
        </div>
      </section>

      {/* Brand Story / Craftsmanship Split */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px]">
              <img 
                src="/images/craftsmanship.png" 
                alt="Jewelry Craftsmanship" 
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent hidden lg:block -z-10"></div>
            </div>
            <div>
              <span className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-4 block">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-display font-light leading-tight mb-8">
                Crafted with <br/> Unyielding <span className="font-bold">Precision.</span>
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6 font-light text-lg">
                Every piece at The_Skj_Hub is born from a legacy of master craftsmen. We source only the finest ethical diamonds and pure metals, ensuring each creation is not just jewelry, but a generational heirloom.
              </p>
              <p className="text-slate-400 leading-relaxed mb-10 font-light">
                Our invisible setting techniques and intricate traditional filigree work seamlessly blend modern luxury with timeless traditions. Discover the artistry that goes into every facet.
              </p>
              <Link to="/about" className="inline-block border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-colors">
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Modern Layout */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-medium tracking-[0.2em] uppercase text-xs mb-2 block">Collections</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Explore Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
            <Link to="/products?category=bangles" className="md:col-span-8 group relative overflow-hidden h-80 md:h-full bg-slate-200">
              <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop" alt="Bangles" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-display font-bold mb-2">Bridal Bangles</h3>
                <span className="uppercase tracking-widest text-xs border-b border-white pb-1 group-hover:text-accent group-hover:border-accent transition-colors">Shop Collection</span>
              </div>
            </Link>

            <div className="md:col-span-4 flex flex-col gap-4 h-full">
              <Link to="/products?category=invisible-chains" className="flex-1 group relative overflow-hidden h-80 md:h-auto bg-slate-200">
                <img src="/images/invisible-chains.png" alt="Invisible Chains" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-display font-bold mb-2">Invisible Chains</h3>
                  <span className="uppercase tracking-widest text-xs border-b border-white pb-1">Shop Collection</span>
                </div>
              </Link>
              <Link to="/products?category=hair-accessories" className="flex-1 group relative overflow-hidden h-80 md:h-auto bg-slate-200">
                <img src="/images/hair-clip.jpg" alt="Hair Accessories" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-display font-bold mb-2">Hair Accessories</h3>
                  <span className="uppercase tracking-widest text-xs border-b border-white pb-1">Shop Collection</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/craftsmanship.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative max-w-3xl mx-auto px-4 text-center z-10">
          <Mail className="h-12 w-12 mx-auto mb-6 text-accent opacity-80" />
          <h2 className="text-4xl font-display font-bold mb-4">Join The Inner Circle</h2>
          <p className="text-slate-300 mb-8 font-light text-lg">
            Subscribe to receive insider access to private sales, exclusive new collection drops, and styling advice.
          </p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-accent rounded-t-lg sm:rounded-l-none sm:rounded-l-lg"
              required 
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-accent text-slate-900 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-b-lg sm:rounded-r-none sm:rounded-r-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
