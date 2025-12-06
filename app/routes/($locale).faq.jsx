import {useState, useRef, useEffect} from 'react';
import Breadcrumbs from '~/components/Breadcrumbs';
import {useLocale} from '~/hooks/useLocale';

const Faq = () => {
  const {t, language} = useLocale();

  return (
    <div className="layout-padding">
      <div className="product-list-header">
        <Breadcrumbs
          links={[
            {label: 'Home', labelSk: 'Domov', to: `/${language}`},
            {
              label: "FAQ's",
              labelSk: 'Často kladené otázky',
              to: `${language}/faq`,
            },
          ]}
        />
        <h1>{t.faq_heading}</h1>
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <Qustions
            questionSK="Akú veľkosť si mám vybrať?"
            answerSK="Naše produkty sú unisex. V detaile každého produktu nájdete presnú veľkostnú tabuľku, podľa ktorej sa môžete rozhodnúť."
            questionEN="Which size should I choose?"
            answerEN="Our products are unisex. In the details of each product, you’ll find an exact size chart to help you decide."
          />
          <Qustions
            questionSK="Kedy bude moja objednávka odoslaná?"
            answerSK="Snažíme sa odoslať každú objednávku čo najrýchlejšie. Každý produkt vyrábame až po prijatí objednávky, aby sme zabezpečili čo najvyššiu kvalitu. Štandardná doba spracovania je 2 až 5 pracovných dní."
            questionEN="When will my order be shipped?"
            answerEN="We do our best to ship every order as quickly as possible. Each product is made only after the order is placed to ensure the highest quality. The standard processing time is 2 to 5 business days."
          />
          <Qustions
            questionSK="Kedy dostanem svoju objednávku?"
            answerSK="Čas doručenia závisí od vašej doručovacej adresy. Po spracovaní objednávky trvá doručenie približne 1 až 3 pracovné dni na Slovensku, 2 až 4 dní do Česka, 3 až 7 pracovných dní v rámci EÚ a 7 až 18 pracovných dní do sveta, ide však len o odhad podľa regiónu a prepravcu."
            questionEN="When will I receive my order?"
            answerEN="Delivery time depends on your shipping address. After the order is processed, delivery takes approximately 1-3 business days in Slovakia, 2-4 days to Czechia, 3-7 business days across the EU, and 7-18 business days worldwide, but these are only estimated times depending on region and carrier."
          />
          <Qustions
            questionSK="Čo mám robiť, ak mám problém s mojou objednávkou?"
            answerSK={`
            <p>
              Ak by však nastal akýkoľvek problém, kontaktujte prosím náš
              zákaznícky tím na adrese
              <a
                href="mailto:hello@lostoceanapparel.com"
                aria-label="Email to Lost Ocean"
                style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >
                hello@lostoceanapparel.com </a>. Radi vám pomôžeme a urobíme všetko pre vyriešenie situácie.
            </p>`}
            questionEN="What should I do if there’s an issue with my order?"
            answerEN={`
            <p>If you experience any problem with your order, please contact our customer support team at 
            <a 
            href="mailto:hello@lostoceanapparel.com" 
            aria-label="Email to Lost Ocean" 
            style="font-weight:500; color:#485d7c; text-decoration:underline;"
            >hello@lostoceanapparel.com </a>. We’ll be happy to help and do everything we can to resolve the situation.
            </p>`}
          />
          <Qustions
            questionSK="Ako môžem vrátiť svoju objednávku?"
            answerSK={` <p>
              Áno, máte možnosť vrátiť tovar do 30 dní od doručenia. Produkt
              musí byť v pôvodnom stave, t. j.:
            </p>
            <ul
            style="list-style-type: disc; padding-left: 20px; margin-left: 20px;"
            >
              <li>nenosený a nepraný,</li>
              <li>bez akéhokoľvek zápachu (parfém, cigarety atď.),</li>
              <li>s pôvodnou visačkou,</li>
              <li>nepoškodený a čistý</li>
            </ul>
            <p>
              Akonáhle zásielku obdržíme a skontrolujeme stav produktu, vrátime
              vám peniaze rovnakou platobnou metódou.
            </p>
            <p>
              V prípade otázok kontaktujte náš zákaznícky servis na:
              <a
                href="mailto:hello@lostoceanapparel.com"
                aria-label="Email to Lost Ocean"
                style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >
                hello@lostoceanapparel.com
              </a>.
            </p>`}
            questionEN="How can I return my order?"
            answerEN={`<p>Yes, you can return your item within 30 days of delivery. The product must be in its original condition, meaning it should be: 
              <ul 
              style="list-style-type: disc; padding-left: 20px; margin-left: 20px;"> 
              <li>unworn and unwashed,</li> 
              <li>free of any odors (perfume, smoke, etc.),</li> 
              <li>with the original tag attached,</li> 
              <li>undamaged and clean.</li> 
              </ul> 
              Once we receive your return and inspect the item, we’ll refund your payment using the original payment method. If you have any questions, please contact our customer support at 
              <a 
              href="mailto:hello@lostoceanapparel.com" 
              aria-label="Email to Lost Ocean" 
              style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >hello@lostoceanapparel.com
</a>.</p>`}
          />

          <Qustions
            questionSK="Môžem si upraviť objednávku?"
            answerSK={`Ak ste vo svojej objednávke urobili chybu, čo najskôr kontaktujte náš tím zákazníckych služieb na adrese  <a
                href="mailto:hello@lostoceanapparel.com"
                aria-label="Email to Lost Ocean"
                style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >
                hello@lostoceanapparel.com </a> . Náš tím sa bude snažiť vykonať potrebné úpravy. Ak už bola vaša objednávka odoslaná, nemôžeme vykonať žiadne zmeny.`}
            questionEN="Can I modify my order?"
            answerEN={`If you’ve made a mistake in your order, please contact our customer support team as soon as possible at 
              <a 
              href="mailto:hello@lostoceanapparel.com" 
              aria-label="Email to Lost Ocean" 
              style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >hello@lostoceanapparel.com </a>. We’ll do our best to make the necessary changes. However, if your order has already been shipped, we’re unable to modify it.`}
          />
          <Qustions
            questionSK="Posielate objednávky aj do zahraničia?"
            answerSK="Objednávky odosielame do celého sveta."
            questionEN="Do you ship internationally?"
            answerEN="Yes, we ship worldwide."
          />
          <Qustions
            questionSK="Ako sa správne starať o oblečenie Lost Ocean?"
            answerSK={`<p>Aby vám oblečenie vydržalo čo najdlhšie a zachovalo si svoj tvar aj potlač, odporúčame:</p> <ul
            style="list-style-type: disc; padding-left: 20px; margin-left: 20px;"
            >
              <li>Prať maximálne na 30 °C,</li>
              <li>otočiť odev naruby pred praním,</li>
              <li>nežehliť priamo cez potlač,</li>
              <li>nepoužívať sušičku,</li>
              <li>nepoužívať bielidlá alebo agresívne čistiace prostriedky.</li>
            </ul>`}
            questionEN="How should I care for Lost Ocean clothing?"
            answerEN={`<p>To keep your clothing in great condition and preserve both its shape and print, we recommend:</p> <ul style="list-style-type: disc; padding-left: 20px; margin-left: 20px;"> <li>Washing at a maximum of 30 °C,</li> <li>turning the garment inside out before washing,</li> <li>avoiding ironing directly over the print,</li> <li>not using a dryer,</li> <li>avoiding bleach and harsh cleaning agents.</li> </ul>`}
          />
          <Qustions
            questionSK="Máte viac otázok?"
            answerSK={`<p>Napíšte nám na <a
                href="mailto:hello@lostoceanapparel.com"
                aria-label="Email to Lost Ocean"
                style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >
                hello@lostoceanapparel.com </a> a radi vám pomôžeme.</p>`}
            questionEN="Do you have more questions?"
            answerEN={`<p>Write to us at  
              <a 
              href="mailto:hello@lostoceanapparel.com" 
              aria-label="Email to Lost Ocean" 
              style="font-weight:500; color:#485d7c; text-decoration:underline;"
              >hello@lostoceanapparel.com</a> and we’ll be happy to help you.</p>`}
          />
          {/* <Qustions questionSK="" answerSK="" /> */}
        </div>
      </div>
    </div>
  );
};

const Qustions = ({questionSK, answerSK, questionEN, answerEN}) => {
  const {language} = useLocale();
  const questionLabel = language === 'sk' ? questionSK : questionEN;
  const answerLabel = language === 'sk' ? answerSK : answerEN;

  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState('0px');
  const contentRef = useRef(null);

  // Kľúčový useEffect na zistenie skutočnej výšky obsahu pre plynulú animáciu
  useEffect(() => {
    if (contentRef.current) {
      // Nastaví výšku na scrollHeight, ak je otvorené, inak 0
      setHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [open]);

  // Icon: Chevron Down (inline SVG)
  const ChevronDown = () => (
    <svg
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.4s ease-in-out',
        marginLeft: '16px',
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div className="container-style" onClick={() => setOpen(!open)}>
      <div className="question-style">
        {questionLabel}
        <ChevronDown />
      </div>
      <div
        style={{
          maxHeight: height,
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          ref={contentRef}
          className="answer-content"
          style={{pointerEvents: open ? 'auto' : 'none'}}
          dangerouslySetInnerHTML={{__html: answerLabel}}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default Faq;
