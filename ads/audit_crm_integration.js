/* ============================================================
   audit_crm_integration.js
   Нові скрипти сторінки crm-integration.html.
   Правило (SEO_ADS_BUILD_GUIDELINES.md): наявні скрипти
   seo-ads.html не редагуються — лише доповнюються цим файлом.
   ============================================================ */

(function () {
  'use strict';

  var root = document.querySelector('.audit_crm_integration');
  if (!root) return;

  /* ---------- Мем-тумблер «оберіть два з трьох» ----------
     Якісно / Швидко / Недорого. Активні максимум два:
     при виборі третього найстаріший знімається. */

  var memeBlocks = root.querySelectorAll('.crm_tariffs__meme');

  memeBlocks.forEach(function (block) {
    var toggles = block.querySelectorAll('.crm_tariffs__meme-toggle');

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();

        if (toggle.classList.contains('active')) {
          toggle.classList.remove('active');
          return;
        }

        var active = block.querySelectorAll('.crm_tariffs__meme-toggle.active');
        if (active.length >= 2) {
          active[0].classList.remove('active');
        }
        toggle.classList.add('active');
      });
    });
  });

  /* ---------- FAQ-акордеон ---------- */

  var faqItems = root.querySelectorAll('.crm_faq__itm');

  faqItems.forEach(function (itm) {
    var question = itm.querySelector('.crm_faq__question');
    var answer = itm.querySelector('.crm_faq__answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = itm.classList.contains('active');

      if (isOpen) {
        itm.classList.remove('active');
        answer.style.maxHeight = '';
        return;
      }

      itm.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });

  /* ---------- Плавний скрол до форми зустрічі (#meet) ---------- */

  var meetLinks = root.querySelectorAll('a[href="#meet"]');
  var meetSection = document.getElementById('meet');

  if (meetSection) {
    meetLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        meetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- Count-up лічильники цифр у кейсах ----------
     Працює на [data-count]; reduced-motion → одразу фінал.
     Текст у HTML лишається як fallback, якщо IO недоступний. */

  var counters = root.querySelectorAll('[data-count]');
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (counters.length && 'IntersectionObserver' in window && !prefersReduced) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 900;
      var start = null;
      var ease = function (p) { return 1 - Math.pow(1 - p, 3); };

      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var val = Math.round(target * ease(p));
        el.textContent = prefix + val.toLocaleString('uk-UA') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- AOS: підхопити нові елементи редизайну ---------- */

  if (window.AOS && typeof window.AOS.refreshHard === 'function') {
    window.AOS.refreshHard();
  }
})();
