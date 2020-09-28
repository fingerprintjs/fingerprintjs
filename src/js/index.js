import tippy from 'tippy.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import $ from 'jquery-slim';
import 'regenerator-runtime/runtime';
import Splide from '@splidejs/splide';

// DOM Elements
const BODY = $('body');
const mobileToggler = $('.mobile-toggler');
const rangeSlider = $('.slider');
const rangeSliderInput = $('.slider-input');
const rangeSliderLabelOutput = $('.slider-output');
const rangeSliderPriceOutput = $('.payment-per-month .price');
const paymentSwitcher = $('.payment-switcher');
const paymentSwitcherAnnually = $('.payment-switcher__button--annually');
const paymentSwitcherMonthly = $('.payment-switcher__button--monthly');
const starCounter = document.querySelectorAll('.btn--github .github-counter');
const liveDemoMobileButtonsPrev = $('.live-demo--mobile .btn--prev');
const liveDemoMobileButtonsNext = $('.live-demo--mobile .btn--next');

// Pricing Table
const pricingTable = [
  { label: '100K', value: 100000 },
  { label: '250K', value: 250000 },
  { label: '500K', value: 500000 },
  { label: '1M', value: 1000000 },
  { label: '5M', value: 5000000 },
  { label: '10M', value: 10000000 },
  { label: '20M', value: 20000000 },
];

document.addEventListener('DOMContentLoaded', () => {
  // StarCounter
  const getStars = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/fingerprintjs/fingerprintjs');
      if (response.ok) {
        let json = await response.json();
        starCounter.forEach((counter) => {
          counter.innerHTML = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(json.stargazers_count);
        });
      }

      // return response.data.stargazers_count;
    } catch (error) {
      console.error({ error });
    }
  };
  // Set stars
  getStars();

  // Code highlights
  Prism.highlightAll();

  // Tooltips initializations
  tippy('[data-tippy-content]', {
    animation: 'shift-away',
    interactive: true,
    arrow: false,
  });

  // Mobile menu toggle
  mobileToggler.click(toggleMobileMenu);

  function toggleMobileMenu() {
    BODY.toggleClass('isMobileMenuOpen');
  }

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 1024px)').matches) {
      BODY.removeClass('isMobileMenuOpen');
    }

    // console.log('Created', proToolsSplide.State.is(proToolsSplide.STATES.CREATED));
    // console.log('Mounted', proToolsSplide.State.is(proToolsSplide.STATES.MOUNTED));
    // console.log('Destroyed', proToolsSplide.State.is(proToolsSplide.STATES.DESTROYED));
    if (window.matchMedia('(max-width: 640px)').matches) {
      if (proToolsSplide.State.is(proToolsSplide.STATES.DESTROYED)) {
        proToolsSplide.refresh();
        proToolsSplide.mount();
      }
      if (proToolsSplide.State.is(proToolsSplide.STATES.MOUNTED)) {
        return;
      } else if (proToolsSplide.State.is(proToolsSplide.STATES.CREATED)) {
        proToolsSplide.mount();
      }
    } else {
      proToolsSplide.destroy();
    }
  });

  // Range slider
  rangeSliderInput.change(handlePriceChange);
  rangeSliderInput[0].addEventListener('input', handlePriceChange);

  function handlePriceChange(e) {
    const minValue = Number(e.target.min);
    const maxValue = Number(e.target.max);
    const value = Number(e.target.value);
    const magicNumber = ((value - minValue) * 100) / (maxValue - minValue);
    const valueLabel = pricingTable[value].label;
    const newPrice = calculatePrice(pricingTable[value].value, paymentSwitcher[0].dataset.type);

    rangeSlider[0].style.setProperty(
      '--left',
      `calc(${magicNumber}% + (${15 - magicNumber * 0.3}px))`,
    );
    rangeSliderLabelOutput.html(valueLabel);
    rangeSliderPriceOutput.html(newPrice);
  }

  function calculatePrice(price, type) {
    const currencyFormatOptions = {
      maximumSignificantDigits: 3,
      style: 'currency',
      currencyDisplay: 'symbol',
      currency: 'USD',
      notation: 'standard',
    };

    if (type === 'monthly') {
      return new Intl.NumberFormat('en-US', currencyFormatOptions).format(price / 1000);
    }
    if (type === 'annually') {
      return new Intl.NumberFormat('en-US', currencyFormatOptions).format((price / 1000) * 0.8);
    }
  }

  // Switch billing types
  paymentSwitcherAnnually.click(switchToType);
  paymentSwitcherMonthly.click(switchToType);

  function switchToType(e) {
    paymentSwitcher[0].dataset.type = e.target.dataset.type;

    paymentSwitcherAnnually.removeClass('payment-switcher__button--active');
    paymentSwitcherMonthly.removeClass('payment-switcher__button--active');

    rangeSliderInput.trigger('change');
    e.target.classList.add('payment-switcher__button--active');
  }

  // Toggle Incognito
  $('.nav__link--logo').click(() => document.documentElement.classList.toggle('incognito'));

  const logoSplide = new Splide('.splide--trusted-by', {
    type: 'slide',
    focus: 0,
    perPage: 6,
    gap: '2rem',
    fixedHeight: 48,
    breakpoints: {
      425: { perPage: 1 },
      768: { perPage: 3 },
    },
    pagination: true,
  });
  logoSplide.mount();

  const proToolsSplide = new Splide('.splide--pro-tools', {
    type: 'loop',
    perPage: 1,
    padding: {
      left: '5rem',
      right: '5rem',
    },
    gap: '2rem',
    pagination: true,
    arrows: false,
  });
  if (window.innerWidth < 641) {
    proToolsSplide.mount();
  }

  const liveDemoMobileSplide = new Splide('.splide--live-demo', {
    type: 'slide',
    perPage: 1,
    focus: 0,
    padding: {
      left: '5rem',
      right: '5rem',
    },
    gap: '2rem',
    pagination: true,
    arrows: false,
  });
  liveDemoMobileSplide.mount();
  liveDemoMobileButtonsPrev.click(() => liveDemoMobileSplide.go('-'));
  liveDemoMobileButtonsNext.click(() => liveDemoMobileSplide.go('+'));

  // Form States - DEMO ONLY
  $('.form--get-started').submit((e) => {
    e.preventDefault();
    const form = $('.form--get-started');
    const state = Math.floor(Math.random() * Math.floor(2));

    form.toggleClass('form--success', state === 1);
    form.toggleClass('form--failed', state === 0);

    if (!!state) {
      setTimeout(() => {
        form.removeClass('form--success');
      }, 1000);
    } else {
      setTimeout(() => {
        form.removeClass('form--failed');
      }, 1000);
    }
  });
});
