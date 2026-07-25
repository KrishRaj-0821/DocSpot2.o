import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const Medicines = () => {
  const { user } = useAuth();
  const { 
    cart, addToCart, removeFromCart, updateQuantity, 
    clearCart, cartCount, cartSubtotal, cartSavings, cartTotal 
  } = useCart();

  // States
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get('/medicines');
        setMedicines(res.data);
      } catch (err) {
        toast.error("Failed to load pharmacy items.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    let result = medicines;

    if (searchTerm) {
      result = result.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(med => med.category === selectedCategory);
    }

    setFilteredMedicines(result);
  }, [medicines, searchTerm, selectedCategory]);

  const categories = [
    "Pain Reliever & Fever",
    "Antibiotics",
    "Acidity & Gas",
    "Heart & Cholesterol",
    "Diabetes",
    "Allergies & Cold",
    "Cough & Cold",
    "Vitamins & Supplements"
  ];

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      toast.error("Please login to place medicine orders.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderPayload = {
        userEmail: user.email,
        items: cart,
        subtotal: cartSubtotal,
        tax: Math.round(cartTotal * 0.05),
        deliveryCharge: 30,
        total: Math.round(cartTotal + cartTotal * 0.05 + 30),
        address: user.address || "Main Street, Purnia",
        paymentMethod: "Cash on Delivery"
      };

      await api.post('/orders', orderPayload);
      toast.success("Order placed successfully! Delivery scheduled within 4 hours.");
      clearCart();
      setShowCartDrawer(false);
    } catch (err) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250 relative">
      <SEO 
        title="Online Pharmacy Store" 
        description="Order prescription drugs and daily wellness products online. Quick home delivery and flat 15% discount on all items." 
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            DocSpot Pharmacy Store
          </h1>
          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
            Order prescription and over-the-counter medicines from authorized local vendors.
          </p>
        </div>

        {/* Float Cart Indicator */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="relative flex items-center space-x-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-750 transition-transform hover:scale-[1.03] cursor-pointer shrink-0"
        >
          <FiShoppingCart className="h-5 w-5" />
          <span>My Cart</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold">
            {cartCount}
          </span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800 sm:grid-cols-12">
        <div className="relative sm:col-span-7">
          <FiSearch className="absolute top-3.5 left-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by chemical name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        
        <div className="sm:col-span-5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Medicines */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white dark:bg-slate-800" />
          ))}
        </div>
      ) : filteredMedicines.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12 font-semibold">No medicines matched your query.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredMedicines.map((med) => {
            const finalPrice = Math.round(med.price - (med.price * med.discount) / 100);
            return (
              <div 
                key={med.id} 
                className="rounded-2xl bg-white p-4 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
                    <img src={med.image} alt={med.name} className="h-40 w-full object-cover" />
                    {med.discount > 0 && (
                      <span className="absolute top-2 left-2 rounded bg-red-550 px-2 py-0.5 text-[9px] font-extrabold text-white">
                        {med.discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{med.brand}</span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate">{med.name}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{med.category}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/60">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-black text-slate-900 dark:text-white">₹{finalPrice}</span>
                    {med.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through">₹{med.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(med);
                      toast.success(`${med.name} added to cart!`);
                    }}
                    className="w-full mt-3 rounded-lg bg-primary-600 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-750 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowCartDrawer(false)}
          />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl dark:bg-slate-900 flex flex-col justify-between h-full animate-in slide-in-from-right duration-250">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
                  <FiShoppingBag className="mr-2 text-primary-500" /> Shopping Cart
                </h2>
                <button 
                  onClick={() => setShowCartDrawer(false)}
                  className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              {/* Drawer Scrollable Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <FiShoppingCart className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-400">Your shopping cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const finalPrice = Math.round(item.price - (item.price * item.discount) / 100);
                    return (
                      <div key={item.id} className="flex items-center space-x-3 border-b border-slate-50 pb-4 dark:border-slate-800">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-100 dark:ring-slate-800 shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">₹{finalPrice} each</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="rounded bg-slate-100 p-0.5 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                              <FiMinus className="h-3 w-3 text-slate-600 dark:text-slate-350" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="rounded bg-slate-100 p-0.5 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                              <FiPlus className="h-3 w-3 text-slate-600 dark:text-slate-350" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.error(`${item.name} removed.`);
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiTrash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Summary Footer */}
              {cart.length > 0 && (
                <div className="border-t border-slate-150 p-6 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>₹{cartSubtotal}</span>
                    </div>
                    {cartSavings > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>Discount Savings</span>
                        <span>-₹{cartSavings}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Standard Delivery</span>
                      <span>₹30</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>GST (5%)</span>
                      <span>₹{Math.round(cartTotal * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>Total Amount</span>
                      <span>₹{Math.round(cartTotal + cartTotal * 0.05 + 30)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
                  >
                    <span>{checkoutLoading ? 'Processing Checkout...' : 'Place Cash on Delivery Order'}</span>
                    <FiArrowRight />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Medicines;
