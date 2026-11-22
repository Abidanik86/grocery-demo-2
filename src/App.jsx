import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroSlider from './components/HeroSlider';
import FeatureStrip from './components/FeatureStrip';
import FeaturedTabs from './components/FeaturedTabs';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import OrderModal, { OrderConfirmModal } from './components/OrderModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import {
  FloatingCartPill,
  MenuDrawer,
  MobileNav,
  WishlistDrawer,
} from './components/MobileNav';
import {
  MobileAccount,
  MobileCart,
  MobileCategories,
  MobileHome,
  MobileSearch,
  MobileTabView,
} from './components/MobileViews';
import { CATEGORIES, CATEGORY_ICONS } from './data/categories';
import { COPY, AREAS } from './data/copy';
import { PRODUCTS, productById, searchProducts } from './data/catalog';
import { useCart, useCartTotals } from './hooks/useCart';
import { useIsMobile } from './hooks/useMediaQuery';

export default function App() {
  const [lang, setLang] = useState('bn');
  const [area, setArea] = useState('dhanmondi');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const isMobile = useIsMobile();

  const copy = COPY[lang];
  const {
    items,
    wishlist,
    addItem,
    increment,
    decrement,
    removeItem,
    clear,
    toggleWishlist,
    isWishlisted,
    qtyOf,
  } = useCart();

  const resolve = useCallback(
    (productId, variantId) => {
      const product = productById(productId);
      if (!product) return null;
      const variant =
        product.variants.find((item) => item.id === variantId) ?? product.variants[0];
      return {
        name: lang === 'bn' ? product.name.bn : product.name.en,
        variantName: lang === 'bn' ? variant.name.bn : variant.name.en,
        image: product.image,
        price: variant.price,
      };
    },
    [lang],
  );

  const totals = useCartTotals(items, resolve);

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const searchResults = useMemo(() => searchProducts(searchQuery), [searchQuery]);

  const showToast = useCallback((message) => setToast(message), []);

  const handleAdd = useCallback(
    (productId, variantId) => {
      addItem(productId, variantId);
      showToast(copy.toast.added);
    },
    [addItem, copy.toast.added, showToast],
  );

  const handleDecrement = useCallback(
    (productId, variantId) => {
      decrement(productId, variantId);
      showToast(copy.toast.removed);
    },
    [decrement, copy.toast.removed, showToast],
  );

  const handleToggleWishlist = useCallback(
    (productId) => {
      const added = toggleWishlist(productId);
      showToast(added ? copy.product.addedWishlist : copy.product.removedWishlist);
    },
    [toggleWishlist, copy.product.addedWishlist, copy.product.removedWishlist, showToast],
  );

  const handleSelectVariant = useCallback((productId, variantId) => {
    setSelectedVariants((current) => ({ ...current, [productId]: variantId }));
  }, []);

  const scrollToCatalog = useCallback((categoryId) => {
    if (categoryId) setActiveCategory(categoryId);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /** Mobile tabs replace scrolling, so category picks route to a tab instead. */
  const goToCategory = useCallback(
    (categoryId) => {
      if (!categoryId) return;
      setActiveCategory(categoryId);
      if (isMobile) {
        setActiveTab('categories');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      scrollToCatalog(categoryId);
    },
    [isMobile, scrollToCatalog],
  );

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      if (!query.trim()) return;
      const results = searchProducts(query);
      if (results.length === 1) {
        setActiveCategory(results[0].category);
        setQuickView(results[0]);
      }
      scrollToCatalog();
    },
    [scrollToCatalog],
  );

  /** Switching tabs always returns the reader to the top of the new view. */
  const changeTab = useCallback((tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keep the active tab valid when the viewport crosses the desktop
  // breakpoint, where the tabbed layout is replaced by the full page.
  useEffect(() => {
    if (!isMobile && activeTab !== 'home') setActiveTab('home');
  }, [isMobile, activeTab]);

  const handlePlaceOrder = useCallback(
    (details) => {
      const id = `#MW-${Math.floor(100000 + Math.random() * 899999)}`;
      setOrder({ ...details, id, total: details.total ?? totals.total, itemCount: totals.itemCount });
      clear();
      setCartOpen(false);
      setOrderOpen(false);
      showToast(copy.toast.orderPlaced);
    },
    [clear, copy.toast.orderPlaced, showToast, totals.total, totals.itemCount],
  );

  const handleOpenTracking = useCallback(() => {
    if (!order) {
      setOrder({
        id: '#MW-748291',
        name: 'সাকিব হাসান',
        phone: '০১৭৯৯-৬৮৩৪৯২',
        address: 'রোড ৭, বাড়ি ১৫, ধানমন্ডি',
        area: 'dhanmondi',
        slot: 'today-pm',
        payment: 'bkash',
        mfsProvider: 'bkash',
        total: 580,
        itemCount: 3,
        items: [
          { name: 'মিনিকেট চাল (প্রিমিয়াম)', variantName: '৫ কেজি', price: 375, qty: 1, image: '/images/products/cabbage.jpg' },
          { name: 'ফুল ক্রিম তরল দুধ', variantName: '১ লিটার', price: 98, qty: 2, image: '/images/products/peas.jpg' },
        ],
      });
    }
  }, [order]);

  const wishlistProducts = useMemo(
    () => wishlist.map((id) => productById(id)).filter(Boolean),
    [wishlist],
  );

  const menuCategories = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        icon: CATEGORY_ICONS[category.icon],
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-canvas pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 relative overflow-hidden">
      {/* Satisfying ambient background glowing orbs */}
      <div className="pointer-events-none fixed -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/[0.07] blur-3xl animate-float-slow" />
      <div className="pointer-events-none fixed top-1/3 -right-24 h-96 w-96 rounded-full bg-amber-400/[0.07] blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="pointer-events-none fixed bottom-1/4 -left-24 h-96 w-96 rounded-full bg-teal-400/[0.06] blur-3xl animate-float-slow" style={{ animationDelay: '4s' }} />

      <Header
        copy={copy}
        lang={lang}
        onLangChange={() => setLang((current) => (current === 'bn' ? 'en' : 'bn'))}
        area={area}
        onAreaChange={setArea}
        areas={AREAS}
        cartCount={totals.itemCount}
        cartTotal={totals.total}
        wishlistCount={wishlist.length}
        onOpenCart={() => (isMobile ? changeTab('cart') : setCartOpen(true))}
        onOpenWishlist={() => (isMobile ? changeTab('account') : setWishOpen(true))}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={() => (isMobile ? changeTab('search') : undefined)}
        onTrackOrder={handleOpenTracking}
        onSearch={handleSearch}
        searchResults={searchResults}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <CategoryNav
        copy={copy}
        lang={lang}
        activeCategory={activeCategory}
        onCategoryChange={goToCategory}
        onOpenMenu={() => setMenuOpen(true)}
        onNavigate={() => setMenuOpen(false)}
        className={isMobile ? 'hidden' : ''}
      />

      <main>
        {isMobile ? (
          <MobileTabView
            tab={activeTab}
            copy={copy}
            lang={lang}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            selectedVariants={selectedVariants}
            onSelectVariant={handleSelectVariant}
            qtyOf={qtyOf}
            onAdd={handleAdd}
            onIncrement={increment}
            onDecrement={handleDecrement}
            onQuickView={setQuickView}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            searchResults={searchResults}
            totals={totals}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenCategories={(categoryId) => goToCategory(categoryId)}
            onSeeAll={() => changeTab('categories')}
            onShop={() => changeTab('categories')}
            onCheckout={() => setOrderOpen(true)}
            onKeepShopping={() => changeTab('home')}
            onRemoveItem={(productId, variantId) => {
              removeItem(productId, variantId);
              showToast(copy.toast.removed);
            }}
            area={area}
            areas={AREAS}
            onAreaChange={setArea}
            wishlistProducts={wishlistProducts}
            onRemoveWishlist={(productId) => {
              toggleWishlist(productId);
              showToast(copy.product.removedWishlist);
            }}
          />
        ) : (
          <>
            <HeroSlider
              copy={copy}
              lang={lang}
              onShop={() => scrollToCatalog('all')}
            />

            <FeatureStrip copy={copy} />

            <FeaturedTabs
              copy={copy}
              lang={lang}
              selectedVariants={selectedVariants}
              onSelectVariant={handleSelectVariant}
              qtyOf={qtyOf}
              onAdd={handleAdd}
              onIncrement={increment}
              onDecrement={handleDecrement}
              onQuickView={setQuickView}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted}
              onSeeAll={scrollToCatalog}
            />

            <ProductGrid
              copy={copy}
              lang={lang}
              products={visibleProducts}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              selectedVariants={selectedVariants}
              onSelectVariant={handleSelectVariant}
              qtyOf={qtyOf}
              onAdd={handleAdd}
              onIncrement={increment}
              onDecrement={handleDecrement}
              onQuickView={setQuickView}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted}
            />
          </>
        )}
      </main>

      <Footer copy={copy} lang={lang} />

      {/* Mobile chrome */}
      {isMobile && (
        <FloatingCartPill
          copy={copy}
          totals={totals}
          onOpenCart={() => changeTab('cart')}
        />
      )}
      <MobileNav
        copy={copy}
        activeTab={activeTab}
        onTabChange={changeTab}
        cartCount={totals.itemCount}
        wishlistCount={wishlist.length}
      />

      {/* Overlays — on phones the cart and wishlist are dedicated tabs,
          so their drawers are not mounted at all. */}
      {!isMobile && (
        <>
          <CartDrawer
            copy={copy}
            lang={lang}
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            detailedItems={totals.detailed}
            totals={totals}
            onIncrement={increment}
            onDecrement={handleDecrement}
            onRemove={(productId, variantId) => {
              removeItem(productId, variantId);
              showToast(copy.toast.removed);
            }}
            onCheckout={() => {
              setCartOpen(false);
              setOrderOpen(true);
            }}
            onKeepShopping={() => setCartOpen(false)}
          />

          <WishlistDrawer
            copy={copy}
            lang={lang}
            open={wishOpen}
            onClose={() => setWishOpen(false)}
            products={wishlistProducts}
            onAdd={handleAdd}
            onRemove={(productId) => {
              toggleWishlist(productId);
              showToast(copy.product.removedWishlist);
            }}
          />
        </>
      )}

      <MenuDrawer
        copy={copy}
        lang={lang}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={menuCategories}
        onPickCategory={scrollToCatalog}
        onOpenWishlist={() => setWishOpen(true)}
      />

      <QuickViewModal
        copy={copy}
        lang={lang}
        product={quickView}
        variantId={quickView ? selectedVariants[quickView.id] : undefined}
        qty={
          quickView
            ? qtyOf(quickView.id, selectedVariants[quickView.id] ?? quickView.variants[0].id)
            : 0
        }
        onSelectVariant={handleSelectVariant}
        onAdd={handleAdd}
        onIncrement={increment}
        onDecrement={handleDecrement}
        onToggleWishlist={handleToggleWishlist}
        wished={quickView ? isWishlisted(quickView.id) : false}
        onClose={() => setQuickView(null)}
      />

      <OrderModal
        copy={copy}
        lang={lang}
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        totals={totals}
        detailedItems={totals.detailed}
        area={area}
        onAreaChange={setArea}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderConfirmModal
        copy={copy}
        lang={lang}
        order={order}
        onClose={() => setOrder(null)}
        onKeepShopping={() => {
          setOrder(null);
          scrollToCatalog('all');
        }}
      />

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  );
}
