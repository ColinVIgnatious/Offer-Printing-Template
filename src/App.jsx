import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Image, IndianRupee, MapPin, Phone, Plus, Printer, ShoppingBag, Tag } from 'lucide-react';
import offers from './data/offers.json';

const PRODUCT_PRINT_PATH = '/product-print';
const MALAYALAM_RANGE = /[\u0D00-\u0D7F]/;
const VIRAMA = '്';
const EMPTY_PRODUCT = {
  name: '',
  imageUrl: '',
  uploadedImage: '',
  quantity: '',
  mrp: '',
  offerPrice: '',
};

const MALAYALAM_VOWELS = [
  ['au', 'ഔ', 'ൗ'],
  ['ai', 'ഐ', 'ൈ'],
  ['aa', 'ആ', 'ാ'],
  ['ee', 'ഈ', 'ീ'],
  ['ii', 'ഈ', 'ീ'],
  ['oo', 'ഊ', 'ൂ'],
  ['uu', 'ഊ', 'ൂ'],
  ['e', 'എ', 'െ'],
  ['i', 'ഇ', 'ി'],
  ['o', 'ഒ', 'ൊ'],
  ['u', 'ഉ', 'ു'],
  ['a', 'അ', ''],
];

const MALAYALAM_CONSONANTS = [
  ['ng', 'ങ'],
  ['nj', 'ഞ'],
  ['zh', 'ഴ'],
  ['ch', 'ച'],
  ['kh', 'ഖ'],
  ['gh', 'ഘ'],
  ['ph', 'ഫ'],
  ['bh', 'ഭ'],
  ['sh', 'ശ'],
  ['th', 'ത'],
  ['dh', 'ധ'],
  ['tt', 'ട'],
  ['dd', 'ഡ'],
  ['nn', 'ണ'],
  ['kk', 'ക്ക'],
  ['pp', 'പ്പ'],
  ['mm', 'മ്മ'],
  ['ll', 'ല്ല'],
  ['rr', 'റ'],
  ['k', 'ക'],
  ['g', 'ഗ'],
  ['c', 'ക'],
  ['j', 'ജ'],
  ['t', 'ട'],
  ['d', 'ഡ'],
  ['n', 'ന'],
  ['p', 'പ'],
  ['b', 'ബ'],
  ['m', 'മ'],
  ['y', 'യ'],
  ['r', 'ര'],
  ['l', 'ല'],
  ['v', 'വ'],
  ['w', 'വ'],
  ['s', 'സ'],
  ['h', 'ഹ'],
];

function App() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const filteredOffers = offers.filter(offer => 
    activeCategory === 'all' ? true : offer.category === activeCategory
  );

  if (currentPath === PRODUCT_PRINT_PATH) {
    return (
      <ProductPrintPage
        t={t}
        i18n={i18n}
        toggleLanguage={toggleLanguage}
        navigate={navigate}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header no-print">
        <div className="container flex-between">
          <div className="flex-center" style={{ gap: '0.75rem' }}>
            <ShoppingBag color="var(--primary)" size={32} />
            <h2 className="text-primary">{t('store_name')}</h2>
          </div>
          
          <div className="header-actions">
            <button className="nav-link" onClick={() => navigate(PRODUCT_PRINT_PATH)}>
              <Printer size={18} />
              Print Product
            </button>
            <LanguageToggle i18n={i18n} toggleLanguage={toggleLanguage} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>{t('special_offers')}</h1>
          <p>{t('store_name')} - {i18n.language === 'en' ? 'Your one-stop destination for the best deals in town.' : 'നഗരത്തിലെ ഏറ്റവും മികച്ച ഡീലുകൾക്കുള്ള നിങ്ങളുടെ ഏക ലക്ഷ്യസ്ഥാനം.'}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container" style={{ paddingBottom: '4rem' }}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {['all', 'groceries', 'vegetables', 'household', 'personal'].map((cat) => (
            <button 
              key={cat}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="offers-grid">
          {filteredOffers.map(offer => {
            const saveAmount = offer.originalPrice - offer.price;
            const savePercent = Math.round((saveAmount / offer.originalPrice) * 100);
            const title = i18n.language === 'en' ? offer.en.title : offer.ml.title;

            return (
              <div key={offer.id} className="offer-card">
                <div className="offer-image-container">
                  <div className="offer-badge">{savePercent}% OFF</div>
                  <img src={offer.image} alt={title} className="offer-image" />
                </div>
                <div className="offer-content">
                  <h3 className="offer-title">{title}</h3>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {t(`categories.${offer.category}`)}
                  </div>
                  
                  <div className="offer-pricing">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="price-old">{t('original_price')} ₹{offer.originalPrice}</span>
                      <span className="price-new">₹{offer.price}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', color: '#10b981', fontWeight: '600', fontSize: '0.875rem' }}>
                    {t('save')} ₹{saveAmount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <MapPin size={20} />
            <span>{t('footer_address')}</span>
          </div>
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <Phone size={20} />
            <span>+91 9447224166,+91 9809411750</span>
          </div>
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <span>{t('footer_hours')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LanguageToggle({ i18n, toggleLanguage }) {
  return (
    <div className="lang-toggle">
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => toggleLanguage('en')}
      >
        EN
      </button>
      <button 
        className={`lang-btn ${i18n.language === 'ml' ? 'active' : ''}`}
        onClick={() => toggleLanguage('ml')}
      >
        മല
      </button>
    </div>
  );
}

function findMalayalamMatch(source, index, entries) {
  const remaining = source.slice(index).toLowerCase();
  return entries.find(([key]) => remaining.startsWith(key));
}

function hasExplicitNextVowel(source, index) {
  return Boolean(findMalayalamMatch(source, index, MALAYALAM_VOWELS));
}

function manglishToMalayalam(value) {
  let output = '';
  let index = 0;

  while (index < value.length) {
    const character = value[index];

    if (!/[a-z]/i.test(character) || MALAYALAM_RANGE.test(character)) {
      output += character;
      index += 1;
      continue;
    }

    const vowel = findMalayalamMatch(value, index, MALAYALAM_VOWELS);
    if (vowel) {
      output += vowel[1];
      index += vowel[0].length;
      continue;
    }

    const consonant = findMalayalamMatch(value, index, MALAYALAM_CONSONANTS);
    if (consonant) {
      const nextIndex = index + consonant[0].length;
      const nextVowel = findMalayalamMatch(value, nextIndex, MALAYALAM_VOWELS);

      output += consonant[1];

      if (nextVowel) {
        output += nextVowel[2];
        index = nextIndex + nextVowel[0].length;
      } else {
        const nextCharacter = value[nextIndex];
        const nextIsLetter = /[a-z]/i.test(nextCharacter || '');
        output += nextIsLetter && !hasExplicitNextVowel(value, nextIndex) ? VIRAMA : '';
        index = nextIndex;
      }
      continue;
    }

    output += character;
    index += 1;
  }

  return output;
}

async function transliterateWithApi(value, signal) {
  const params = new URLSearchParams({
    text: value,
    itc: 'ml-t-i0-und',
    num: '5',
    cp: '0',
    cs: '1',
    ie: 'utf-8',
    oe: 'utf-8',
    app: 'mds',
  });

  const response = await fetch(`https://inputtools.google.com/request?${params.toString()}`, { signal });

  if (!response.ok) {
    throw new Error('Transliteration API request failed');
  }

  const data = await response.json();
  const firstCandidate = data?.[0] === 'SUCCESS' ? data?.[1]?.[0]?.[1]?.[0] : '';

  if (!firstCandidate) {
    throw new Error('No transliteration candidate returned');
  }

  return firstCandidate;
}

async function waitForPrintImages() {
  const images = Array.from(document.querySelectorAll('.print-product-bg'));

  await Promise.all(images.map((image) => {
    if (image.complete && image.naturalWidth > 0) {
      return Promise.resolve();
    }

    if (typeof image.decode === 'function') {
      return image.decode().catch(() => undefined);
    }

    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }));
}

async function printProductSheet() {
  await waitForPrintImages();
  window.setTimeout(() => window.print(), 100);
}

function imageFileToPrintDataUrl(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < imageData.data.length; index += 4) {
        const gray = Math.round(
          imageData.data[index] * 0.299
          + imageData.data[index + 1] * 0.587
          + imageData.data[index + 2] * 0.114
        );
        imageData.data[index] = gray;
        imageData.data[index + 1] = gray;
        imageData.data[index + 2] = gray;
      }

      context.putImageData(imageData, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Uploaded image could not be loaded'));
    };

    image.src = objectUrl;
  });
}

function ProductPrintPage({ t, i18n, toggleLanguage, navigate }) {
  const [products, setProducts] = useState([
    {
      name: 'ഉദാഹരണ ഉൽപ്പന്നം',
      imageUrl: '',
      uploadedImage: '',
      quantity: '1 kg',
      mrp: '120',
      offerPrice: '99',
    },
    EMPTY_PRODUCT,
    EMPTY_PRODUCT,
    EMPTY_PRODUCT,
  ]);
  const [visibleProductCount, setVisibleProductCount] = useState(1);
  const [imageFailed, setImageFailed] = useState({});
  const [apiProductNames, setApiProductNames] = useState({});

  const updateProduct = (index, field, value) => {
    setProducts((current) => current.map((product, productIndex) => (
      productIndex === index ? { ...product, [field]: value } : product
    )));

    if (field === 'imageUrl' || field === 'uploadedImage') {
      setImageFailed((current) => ({ ...current, [index]: false }));
    }
  };

  const updateProductImageFile = (index, file) => {
    if (!file) {
      return;
    }

    imageFileToPrintDataUrl(file)
      .then((imageDataUrl) => {
        updateProduct(index, 'uploadedImage', imageDataUrl);
      })
      .catch(() => {
        setImageFailed((current) => ({ ...current, [index]: true }));
      });
  };

  useEffect(() => {
    const controllers = [];
    const timeoutId = window.setTimeout(() => {
      products.forEach((product, index) => {
        const typedName = product.name.trim();

        if (!typedName || MALAYALAM_RANGE.test(product.name)) {
          return;
        }

        const controller = new AbortController();
        controllers.push(controller);

        transliterateWithApi(product.name, controller.signal)
          .then((transliteratedName) => {
            setApiProductNames((current) => ({
              ...current,
              [index]: { raw: product.name, value: transliteratedName },
            }));
          })
          .catch((error) => {
            if (error.name !== 'AbortError') {
              setApiProductNames((current) => ({
                ...current,
                [index]: { raw: '', value: '' },
              }));
            }
          });
      });
    }, 250);

    return () => {
      controllers.forEach((controller) => controller.abort());
      window.clearTimeout(timeoutId);
    };
  }, [products]);

  const printableProducts = products.map((product, index) => {
    const apiProductName = apiProductNames[index];
    const hasApiProductName = apiProductName?.raw === product.name;
    const localProductName = manglishToMalayalam(product.name);

    return {
      ...product,
      displayName: (hasApiProductName ? apiProductName.value : localProductName).trim(),
      hasApiProductName,
      printImage: product.uploadedImage || product.imageUrl.trim(),
      hasImage: Boolean((product.uploadedImage || product.imageUrl.trim()) && !imageFailed[index]),
    };
  });

  return (
    <div className="app-container product-print-page">
      <header className="header no-print">
        <div className="container flex-between">
          <button className="brand-button" onClick={() => navigate('/')}>
            <ShoppingBag color="var(--primary)" size={32} />
            <span className="text-primary">{t('store_name')}</span>
          </button>

          <div className="header-actions">
            <button className="nav-link" onClick={() => navigate('/')}>
              <Home size={18} />
              Offers
            </button>
            <LanguageToggle i18n={i18n} toggleLanguage={toggleLanguage} />
          </div>
        </div>
      </header>

      <main className="print-builder">
        <section className="print-builder-panel no-print">
          <div className="section-heading">
            <Tag size={22} />
            <div>
              <h1>Product Print</h1>
              <p>Create a black-and-white landscape A4 offer sheet with up to four products.</p>
            </div>
          </div>

          {products.slice(0, visibleProductCount).map((product, index) => (
            <ProductForm
              key={index}
              product={product}
              productIndex={index}
              title={`Product ${index + 1}`}
              previewName={printableProducts[index].displayName}
              hasApiProductName={printableProducts[index].hasApiProductName}
              updateProduct={updateProduct}
              updateProductImageFile={updateProductImageFile}
            />
          ))}

          {visibleProductCount < products.length && (
            <button className="add-product-btn" onClick={() => setVisibleProductCount((count) => count + 1)}>
              <Plus size={18} />
              Add product {visibleProductCount + 1}
            </button>
          )}

          <button className="btn btn-primary print-action" onClick={printProductSheet}>
            <Printer size={20} />
            Print
          </button>
        </section>

        <ProductPrintPreview
          products={printableProducts}
          visibleProductCount={visibleProductCount}
          setImageFailed={setImageFailed}
        />
      </main>

    </div>
  );
}

function ProductForm({
  product,
  productIndex,
  title,
  previewName,
  hasApiProductName,
  updateProduct,
  updateProductImageFile,
}) {
  return (
    <div className="product-form-block">
      <h2>{title}</h2>
      <div className="form-grid">
        <label className="field">
          <span>Product name in Manglish / Malayalam</span>
          <input
            lang="en"
            type="text"
            value={product.name}
            onChange={(event) => updateProduct(productIndex, 'name', event.target.value)}
            placeholder="ari podi"
          />
          <strong className="malayalam-preview" lang="ml">{previewName || 'ഉൽപ്പന്നത്തിന്റെ പേര്'}</strong>
          <span className="transliteration-status">
            {hasApiProductName ? 'Malayalam suggestion from API' : 'Malayalam preview'}
          </span>
        </label>

        <label className="field">
          <span>Image URL</span>
          <div className="input-with-icon">
            <Image size={18} />
            <input
              type="url"
              value={product.imageUrl}
              onChange={(event) => updateProduct(productIndex, 'imageUrl', event.target.value)}
              placeholder="https://example.com/product.jpg"
            />
          </div>
        </label>

        <label className="field">
          <span>Upload photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => updateProductImageFile(productIndex, event.target.files?.[0])}
          />
        </label>

        <label className="field">
          <span>Quantity</span>
          <input
            type="text"
            value={product.quantity}
            onChange={(event) => updateProduct(productIndex, 'quantity', event.target.value)}
            placeholder="1 kg"
          />
        </label>

        <div className="price-fields">
          <label className="field">
            <span>MRP</span>
            <div className="input-with-icon">
              <IndianRupee size={18} />
              <input
                type="number"
                min="0"
                step="0.01"
                value={product.mrp}
                onChange={(event) => updateProduct(productIndex, 'mrp', event.target.value)}
                placeholder="0"
              />
            </div>
          </label>

          <label className="field">
            <span>Offer price</span>
            <div className="input-with-icon">
              <IndianRupee size={18} />
              <input
                type="number"
                min="0"
                step="0.01"
                value={product.offerPrice}
                onChange={(event) => updateProduct(productIndex, 'offerPrice', event.target.value)}
                placeholder="0"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function ProductPrintPreview({
  products,
  visibleProductCount,
  setImageFailed,
}) {
  const visibleProducts = products.map((product, index) => (
    index < visibleProductCount ? product : EMPTY_PRODUCT
  ));

  return (
    <section className="print-preview" aria-label="Product print preview">
      <div className="print-sheet">
        {visibleProducts.map((product, index) => (
          <PrintProductPanel
            key={index}
            product={product}
            productIndex={index}
            setImageFailed={setImageFailed}
          />
        ))}
      </div>
    </section>
  );
}

function PrintProductPanel({ product, productIndex, setImageFailed }) {
  const displayName = product.displayName || ' ';
  const quantity = product.quantity?.trim();
  const mrp = product.mrp || '0';
  const offerPrice = product.offerPrice || '0';
  const mrpNumber = Number(product.mrp);
  const offerPriceNumber = Number(product.offerPrice);
  const discountPercent = Number.isFinite(mrpNumber) && Number.isFinite(offerPriceNumber) && mrpNumber > offerPriceNumber
    ? Math.round(((mrpNumber - offerPriceNumber) / mrpNumber) * 100)
    : 0;
  const isEmpty = !product.displayName && !product.printImage && !product.quantity && !product.mrp && !product.offerPrice;

  if (isEmpty) {
    return <article className="print-product-panel" />;
  }

  return (
    <article className="print-product-panel">
      {product.hasImage && (
        <img
          className="print-product-bg"
          src={product.printImage}
          alt=""
          onError={() => setImageFailed((current) => ({ ...current, [productIndex]: true }))}
        />
      )}
      <div className="print-product-overlay">
        <div className="print-product-title-block">
          <h2 lang="ml">{displayName}</h2>
          {(quantity || discountPercent > 0) && (
            <div className="print-product-meta-line">
              {quantity && <p>{quantity}</p>}
              {discountPercent > 0 && (
                <span className="print-discount-pill">{discountPercent}% OFF</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="print-product-price-line">
        <span className="print-product-mrp-label">MRP <span className="print-product-mrp-value">₹{mrp}</span></span>
        <span className="print-product-offer">₹{offerPrice}</span>
      </div>
    </article>
  );
}

export default App;
