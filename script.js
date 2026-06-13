// FORROBODÓ JUNINO — script.js 

(function () {
    'use strict';

    function initMenu() {
        const menuHamburguer = document.querySelector('.menu-hamburguer');
        const menuFechar     = document.querySelector('.menu-fechar');
        const nav            = document.querySelector('.nav');
        const overlay        = document.querySelector('.menu-overlay');

        if (!menuHamburguer || !menuFechar || !nav || !overlay) return;

        function fecharMenu() {
            nav.classList.remove('ativo');
            overlay.classList.remove('ativo');
            document.body.classList.remove('menu-aberto');
            menuHamburguer.setAttribute('aria-expanded', 'false');
            menuHamburguer.focus();
        }

        function abrirMenu(event) {
            event.stopPropagation();
            nav.classList.add('ativo');
            overlay.classList.add('ativo');
            document.body.classList.add('menu-aberto');
            menuHamburguer.setAttribute('aria-expanded', 'true');
            menuFechar.focus();
        }

        menuHamburguer.addEventListener('click', abrirMenu);
        menuFechar.addEventListener('click', fecharMenu);
        overlay.addEventListener('click', fecharMenu);

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', fecharMenu);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') fecharMenu();
        });
    }

    function initAnimacoes() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.animar').forEach(function (el) {
                el.classList.add('visivel');
            });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visivel');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.animar').forEach(function (el) {
            observer.observe(el);
        });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', function () {
            header.style.boxShadow = window.scrollY > 20
                ? '0 2px 20px rgba(44,31,14,0.15)'
                : '0 1px 0 rgba(44,31,14,0.12)';
        }, { passive: true });
    }

    initMenu();
    initAnimacoes();
    initHeaderScroll();

}());