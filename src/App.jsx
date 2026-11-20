import { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroSlider from './components/HeroSlider';
import FeatureStrip from './components/FeatureStrip';
import FeaturedTabs from './components/FeaturedTabs';
import PromoBanners from './components/PromoBanners';
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
import { CATEGORIES, CATEGORY_ICONS } from './data/categories';
import { COPY, AREAS } from './data/copy';
import { PRODUCTS, productById, searchProducts } from './data/catalog';
import { useCart, useCartTotals } from './hooks/useCart';

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

  const handlePlaceOrder = useCallback(
    (details) => {
      const id = `#MW-${Math.floor(100000 + Math.random() * 899999)}`;
      setOrder({ ...details, id, total: totals.total, itemCount: totals.itemCount });
      clear();
      setCartOpen(false);
      setOrderOpen(false);
      showToast(copy.toast.orderPlaced);
    },
    [clear, copy.toast.orderPlaced, showToast, totals.total, totals.itemCount],
  );

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
    <div className="min-h-screen bg-canvas pb-16 lg:pb-0">
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
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
        onSearch={handleSearch}
        searchResults={searchResults}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <CategoryNav
        copy={copy}
        lang={lang}
        activeCategory={activeCategory}
        onCategoryChange={scrollToCatalog}
        onOpenMenu={() => setMenuOpen(true)}
        onNavigate={() => setMenuOpen(false)}
      />

      <main>
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

        <PromoBanners copy={copy} lang={lang} />

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
      </main>

      <Footer copy={copy} lang={lang} />

      {/* Mobile chrome */}
      <FloatingCartPill copy={copy} totals={totals} onOpenCart={() => setCartOpen(true)} />
      <MobileNav
        copy={copy}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
          if (tab === 'categories') scrollToCatalog('all');
          if (tab === 'cart') setCartOpen(true);
        }}
        onSearch={() => {
          setActiveTab('search');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Overlays */}
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
