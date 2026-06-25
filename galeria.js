// GALERIA.JS — FORROBODÓ JUNINO

(function () {

    'use strict';

    /*
    ─────────────────────────────────────────
    CONFIGURAÇÃO DOS DIAS — edite aqui.
    id:     prefixo dos arquivos de imagem
            ex: 'dia01' → galeria/dia01-01.webp
    titulo: texto no dropdown e no topo do grid
    fotos:  quantidade de fotos do dia
    ─────────────────────────────────────────
    */
    var DIAS = [
        { id: 'dia01', titulo: 'Dia 05/06', fotos: 12 },
        { id: 'dia02', titulo: 'Dia 06/06', fotos: 10 },
        { id: 'dia03', titulo: 'Dia 07/06', fotos: 12 },
        { id: 'dia04', titulo: 'Dia 12/06', fotos: 10 },
        { id: 'dia05', titulo: 'Dia 13/06', fotos: 22 },
        { id: 'dia06', titulo: 'Dia 14/06', fotos: 10 },
        { id: 'dia07', titulo: 'Dia 19/06', fotos: 8 },
        { id: 'dia08', titulo: 'Dia 20/06', fotos: 8 },
        { id: 'dia09', titulo: 'Dia 21/06', fotos: 18 },
    ];

    var select   = document.getElementById('galeria-select');
    var conteudo = document.getElementById('galeria-conteudo');
    var btnAnt   = document.getElementById('btn-anterior');
    var btnProx  = document.getElementById('btn-proximo');
    var indice   = 0;

    DIAS.forEach(function (dia, i) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.textContent = dia.titulo;
        select.appendChild(opt);
    });

    function gerarPainel(dia, i) {
    var fotos = '';
    for (var f = 1; f <= dia.fotos; f++) {
        var num = f < 10 ? '0' + f : '' + f;
        var src = 'galeria/' + dia.id + '-' + num + '.webp';
        var alt = 'Forrobodó Junino — ' + dia.titulo + ', foto ' + f;
        var lazy = (i === 0 && f <= 4) ? '' : ' loading="lazy"';
        fotos += '<div class="momentos-item"><img src="' + src + '" alt="' + alt + '"' + lazy + '></div>';
    }
        return (
            '<div class="galeria-painel' + (i === 0 ? ' ativo' : '') + '" id="painel-' + i + '" role="tabpanel">' +
                '<div class="galeria-painel-header">' +
                    '<p class="galeria-painel-titulo">' + dia.titulo + '</p>' +
                    '<span class="galeria-painel-contagem">' + dia.fotos + ' fotos</span>' +
                '</div>' +
                '<div class="momentos-grid">' + fotos + '</div>' +
            '</div>'
        );
    }

    var html = '';
    DIAS.forEach(function (dia, i) { html += gerarPainel(dia, i); });
    conteudo.innerHTML = html;

    function mostrarPainel(i) {
        document.querySelectorAll('.galeria-painel').forEach(function (p) {
            p.classList.remove('ativo');
        });
        document.getElementById('painel-' + i).classList.add('ativo');
        select.value     = i;
        btnAnt.disabled  = i === 0;
        btnProx.disabled = i === DIAS.length - 1;
        indice           = i;
        ativarLightbox();
    }

    select.addEventListener('change', function () {
        mostrarPainel(parseInt(select.value));
    });
    btnAnt.addEventListener('click', function () {
        if (indice > 0) mostrarPainel(indice - 1);
    });
    btnProx.addEventListener('click', function () {
        if (indice < DIAS.length - 1) mostrarPainel(indice + 1);
    });

    mostrarPainel(0);

    var lightbox    = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var contador    = document.getElementById('lightbox-contador');
    var fotosAtivas = [];
    var fotoIndice  = 0;

    function abrirLightbox(imgs, i) {
        fotosAtivas = imgs;
        fotoIndice  = i;
        mostrarFoto();
        lightbox.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    }

    function fecharLightbox() {
        lightbox.classList.remove('ativo');
        document.body.style.overflow = '';
    }

    function mostrarFoto() {
        var img = fotosAtivas[fotoIndice];
        lightboxImg.src      = img.src;
        lightboxImg.alt      = img.alt;
        contador.textContent = (fotoIndice + 1) + ' / ' + fotosAtivas.length;
    }

    function navegar(dir) {
        fotoIndice = (fotoIndice + dir + fotosAtivas.length) % fotosAtivas.length;
        mostrarFoto();
    }

    function ativarLightbox() {
        document.querySelectorAll('.momentos-item').forEach(function (item) {
            if (item._clickHandler) {
                item.removeEventListener('click', item._clickHandler);
            }
            item._clickHandler = function () {
                var painel = document.querySelector('.galeria-painel.ativo');
                var imgs   = Array.from(painel.querySelectorAll('.momentos-item img'));
                var img    = item.querySelector('img');
                abrirLightbox(imgs, imgs.indexOf(img));
            };
            item.addEventListener('click', item._clickHandler);
        });
    }

    document.getElementById('lightbox-prev').addEventListener('click', function () { navegar(-1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { navegar(1); });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) fecharLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('ativo')) return;
        if (e.key === 'Escape')     fecharLightbox();
        if (e.key === 'ArrowLeft')  navegar(-1);
        if (e.key === 'ArrowRight') navegar(1);
    });

}());