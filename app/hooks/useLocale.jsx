// hooks/useLocale.js
import {createContext, useContext, useEffect, useState} from 'react';

export const translations = {
  en: {
    home_heading: 'Welcome to the depths',
    shop_now: 'Shop now',
    about_us: 'About us',
    // about_us: 'About Lost Ocean',
    home_text:
      'A streetwear brand inspired by tattoo art, ocean depth, and modern witchcraft. Made for souls who walk a little darker than the rest. We don’t try to fit in. We wear who we are.',
    label_shirt: 'T-shirt',
    label_hoodie: 'Hoodies',
    continue_shoping: 'Continue Shopping',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    shipping_info: 'Shipping & taxes calculated at checkout',
    cart: 'Cart',
    cart_empty: 'Your cart is empty.',
    contact_heading: 'Contact Us',
    // contact_text: 'Have a question? Fill out the form below or email us at',
    contact_text: 'Do you have a question? send us an email at',
    contact_text2: 'we’ll get back to you shortly.',
    faq_heading: "FAQ's",
    about_us_text: `<p>Hi, I'm Barty, and together with Ren, we are the founders of Lost Ocean. We are a small family-run brand. A programmer/UI designer and a graphic designer. Everything created under the Lost Ocean name is made by our own hands.</p>
<p>From the first ideas, sketches, and drawings to full digital processing.</p>
<p>Every design has its own story, thought, and deeper meaning. Nothing we create is random, everything is made with emotion, intention, and a personal touch.</p>
<p>We coded the entire website ourselves, take all our own photos, and handle all customer communication personally. We are a small team, but we care deeply about quality and detail.</p>
<p>Our brand originates from Slovakia. We are based in Bratislava and partly in the mountains of Orava.</p>
<p>Lost Ocean is made for souls who walk a little darker. For people who love alternative style, tattoos, Wicca, and are looking for clothing that reflects who they are.</p>
`,
    catalog_heading: 'Into the Deep collection ',
    catalog_description:
      'Discover our first collection inspired by the ocean, tattoos, wild nature, and wicca. The beginning of the Lost Ocean story starts here.',
    filter_label_all: 'All',
    filter_label_tshirts: 'T-shirts',
    filter_label_hoodies: 'Hoodies',
    filter_label_accessories: 'Accessories',
    filter_label_kids: 'Kids',
    add_to_cart: 'Add to cart',
    sold_out: 'Sold out',
    size_guide: 'Size guide',
    delivery_info: 'Delivery & Shipping Protection | Returns ',
    discount_info: 'Discounts applied at checkout',
    your_email_address: 'Your email address',
    email_address: 'Email Address',
    message_label: 'Your Message',
    message: 'How can we help you today?',
    sending: 'Sending...',
    send: 'Send',
    success: 'Your message has been sent successfully!',
    error_sending_message: 'Error sending message. Please try again later.',
    hp_about_us: 'More about us',
    hp_about_us_text:
      'Every design starts on paper. Hand-drawn, carefully considered, then translated into a digital form and brought to life as a final product. We use premium cotton, with a large part of our products made from eco organic fabrics. We focus on quality craftsmanship, heavyweight materials, and cuts that fit well, from classic to oversized. When I couldn’t find anything I truly connected with, I had to create it myself. The world teaches you to fit in. No one teaches you to be yourself. There’s nothing wrong with being different. What’s wrong is hiding it. Be yourself. Lost Ocean is for those who aren’t afraid to show the world who they really are.',
    hp_about_us_subheading:
      'Made for souls who walk a little darker than the rest.',
    hp_news_heading: 'Just Dropped',
    hp_news_subheading: 'New Arrivals',
    hp_trending_subheading: 'Trending now',
    hp_trending_title: 'Best Sellers',
    hp_instagram: 'Follow Us on Instagram',
    announcement_text: 'Get 10% off your first order. Use code:',
    catalog_heading_all: 'THE WHOLE DROP',
    catalog_heading_tshirts: 'ALL T-SHIRTS',
    catalog_heading_regular: 'REGULAR T-SHIRTS',
    catalog_heading_washed: 'WASHED T-SHIRTS',
    catalog_heading_oversized: 'OVERSIZED T-SHIRTS',
    catalog_heading_kids: 'FUTURE GENERATION',
    catalog_heading_hoodies: 'HOODIES',
    catalog_heading_accessories: 'ACCESSORIES',
  },
  sk: {
    home_heading: 'Vitaj v hlbinách',
    home_text:
      'Streetwear značka inšpirovaná tetovaním, hĺbkami oceánu a modernou mágiou. Vytvorená pre duše, ktoré kráčajú o niečo temnejšie než ostatné. Nesnažíme sa zapadnúť. Nosíme to, kým sme.',
    shop_now: 'Nakupovať',
    about_us: 'O nás',
    // about_us: 'Lost Ocean',
    label_shirt: 'Tričká',
    label_hoodie: 'Mikiny',
    continue_shoping: 'Pokračovať v nákupe',
    checkout: 'Prejsť k pokladni',
    subtotal: 'Spolu',
    shipping_info: 'Doprava a dane sa vypočítajú pri pokladni.',
    cart: 'Košík',
    cart_empty: 'Váš košík je prázdny.',
    contact_heading: 'Kontaktujte nás',
    // contact_text: 'Máte otázku? Vyplňte formulár nižšie alebo nám pošlite e-mail na adresu',
    contact_text: 'Máte otázku? Napíšte nám na',
    contact_text2: 'a čoskoro sa vám ozveme.',
    faq_heading: 'Často kladené otázky',
    about_us_text: `<p>Ahoj, som Barty a spolu s Ren sme zakladatelia značky Lost Ocean. Sme malá rodinná firma. Programátor / UI dizajnér a grafický dizajnér. Všetko, čo vzniká pod značkou Lost Ocean, tvoríme vlastnými rukami.</p>
<p>Od prvotných nápadov, skíc a kresieb, až po digitálne spracovanie.</p>
<p>Každý náš dizajn má svoj príbeh, myšlienku a hlbší význam. Nič nerobíme len tak, všetko vzniká s emóciou, ideou a osobným dotykom.</p>
<p>Stránku sme si nakódovali sami, fotky si fotíme sami a rovnako aj komunikáciu so zákazníkmi riešime sami. Sme malý tím, ale o to viac nám záleží na detailoch a kvalite.</p>
<p>Naša značka pochádza zo Slovenska. Sídlime v Bratislave a čiastočne aj na Orave, obklopení horami.</p>
<p>Lost Ocean je vytvorený pre duše, ktoré kráčajú temnejšie. Pre ľudí, ktorí milujú alternatívny štýl, tetovania, wiccu a hľadajú oblečenie, ktoré odráža to, kým sú.</p>
`,
    catalog_heading: 'Kolekcia Into the Deep',
    catalog_description:
      'Objav našu prvú kolekciu inšpirovanú oceánom, tattoo, divokou prírodou a wiccou. Začiatok príbehu Lost Ocean sa začína tu.',
    filter_label_all: 'Všetko',
    filter_label_tshirts: 'Tričká',
    filter_label_hoodies: 'Mikiny',
    filter_label_accessories: 'Doplnky',
    filter_label_kids: 'Deti',
    add_to_cart: 'Pridať do košíka',
    sold_out: 'Vypredané',
    size_guide: 'Veľkostná tabuľka',
    delivery_info: 'Doprava a ochrana zásielky | Vrátenie tovaru ',
    discount_info: 'Zľavy sa uplatnia pri pokladni',
    your_email_address: 'Vaša emailová adresa',
    email_address: 'Emailová adresa',
    message_label: 'Vaša správa',
    message: 'Ako vám môžeme pomôcť?',
    sending: 'Odosielam...',
    send: 'Odoslať',
    success: 'Vaša správa bola úspešne odoslaná!',
    error_sending_message: 'Chyba pri odosielaní. Skúste to neskôr.',
    hp_about_us: 'Viac o nás',
    hp_about_us_text:
      'Každý dizajn začína na papieri. Je ručne kreslený, premyslený a následne prenesený do digitálnej podoby a na finálny produkt. Používame prémiovú bavlnu a veľká časť našich produktov je vyrobená z eco bio bavlny. Zameriavame sa na kvalitné spracovanie, heavyweight materiály a strihy, ktoré dobre sedia. Od klasických až po oversized. Keď som nenašiel nič, s čím by som sa vedel stotožniť, musel som si to vytvoriť. Celý svet ťa učí zapadnúť. Nikto ťa neučí byť sám sebou. Nie je nič zlé na tom byť iný. Zlé je to skrývať. Buď sám sebou. Lost Ocean je pre tých, ktorí sa neboja ukázať svetu, kým naozaj sú.',
    hp_about_us_subheading:
      'Vytvorená pre duše, ktoré kráčajú o niečo temnejšie než ostatné.',
    hp_news_heading: 'Nový drop',
    hp_news_subheading: 'Novinky',
    hp_trending_subheading: 'Najpredávanejšie',
    hp_trending_title: 'Najobľúbenejšie',
    hp_instagram: 'Sleduj nás na Instagrame',
    announcement_text: 'Získaj 10% zľavu na svoj prvý nákup. Použi kód:',
    catalog_heading_all: 'Všetky produkty',
    catalog_heading_tshirts: 'Všetky tričká',
    catalog_heading_regular: 'Regular tričká',
    catalog_heading_washed: 'Washed tričká',
    catalog_heading_oversized: 'Oversized tričká',
    catalog_heading_kids: 'Budúca generácia',
    catalog_heading_hoodies: 'Mikiny',
    catalog_heading_accessories: 'Doplnky',
  },
};

const LocaleContext = createContext(null);

export function LocaleProvider({children, initialLanguage = 'en'}) {
  const norm = (initialLanguage || 'en').toLowerCase();
  const [language, setLanguage] = useState(translations[norm] ? norm : 'en');

  // ⬇️ kľúčové: keď sa zmení initialLanguage (napr. klik na /sk), zmeň stav
  useEffect(() => {
    const next = (initialLanguage || 'en').toLowerCase();
    setLanguage(translations[next] ? next : 'en');
  }, [initialLanguage]);

  const changeLanguage = (newLang) => {
    const l = (newLang || 'en').toLowerCase();
    setLanguage(translations[l] ? l : 'en');
  };

  const t = translations[language] || translations.en;

  return (
    <LocaleContext.Provider
      value={{
        language,
        t,
        changeLanguage,
        availableLanguages: Object.keys(translations),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
