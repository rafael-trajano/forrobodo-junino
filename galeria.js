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
        { id: 'dia10', titulo: 'Dia 22/06', fotos: 16 },
        { id: 'dia11', titulo: 'Dia 23/06', fotos: 8 },
        { id: 'dia12', titulo: 'Dia 24/06', fotos: 8 },
        { id: 'dia13', titulo: 'Dia 25/06', fotos: 10 },
        { id: 'dia14', titulo: 'Dia 28/06', fotos: 6 },
        { id: 'dia15', titulo: 'Dia 04/07', fotos: 8 },
        { id: 'dia16', titulo: 'Dia 05/07', fotos: 8 },
        { id: 'dia17', titulo: 'Dia 11/07', fotos: 14 },
    ];

    var conteudo = document.getElementById('galeria-conteudo');
    var btnAnt   = document.getElementById('btn-anterior');
    var btnProx  = document.getElementById('btn-proximo');
    var dropdown = document.getElementById('galeria-dropdown');
    var botao    = document.getElementById('galeria-dropdown-botao');
    var lista    = document.getElementById('galeria-dropdown-lista');
    var indice   = 0;
    var destaque = 0;   // opção marcada pelo teclado enquanto a lista está aberta

    // monta a lista de dias
    DIAS.forEach(function (dia, i) {
        var li = document.createElement('li');
        li.className = 'galeria-dropdown-opcao';
        li.id = 'galeria-opcao-' + i;
        li.setAttribute('role', 'option');
        li.textContent = dia.titulo;
        li.addEventListener('click', function () { escolher(i); });
        // o mouse e o teclado usam o mesmo destaque, então só um dia fica marcado por vez
        li.addEventListener('mousemove', function () { if (destaque !== i) marcar(i, true); });
        lista.appendChild(li);
    });
    var opcoes = lista.querySelectorAll('.galeria-dropdown-opcao');

    function marcar(i, peloMouse) {
        opcoes[destaque].classList.remove('destacada');
        destaque = i;
        opcoes[i].classList.add('destacada');
        lista.setAttribute('aria-activedescendant', opcoes[i].id);
        if (peloMouse) return;
        // mantém a opção visível dentro da lista
        var o = opcoes[i];
        if (o.offsetTop < lista.scrollTop) lista.scrollTop = o.offsetTop - 8;
        else if (o.offsetTop + o.offsetHeight > lista.scrollTop + lista.clientHeight)
            lista.scrollTop = o.offsetTop + o.offsetHeight - lista.clientHeight + 8;
    }

    function abrir(peloTeclado) {
        lista.hidden = false;
        botao.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('aberto');
        // abre já mostrando o dia atual no meio da lista
        lista.scrollTop = opcoes[indice].offsetTop - lista.clientHeight / 2;
        // pelo teclado o dia atual já vem destacado; pelo mouse, o destaque só aparece ao passar por cima
        if (peloTeclado) {
            marcar(indice);
        } else {
            opcoes[destaque].classList.remove('destacada');
            destaque = indice;
            lista.setAttribute('aria-activedescendant', opcoes[indice].id);
        }
        lista.focus();
    }

    function fechar(devolverFoco) {
        if (lista.hidden) return;
        lista.hidden = true;
        botao.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('aberto');
        if (devolverFoco) botao.focus();
    }

    function escolher(i) {
        fechar(true);
        if (i !== indice) mostrarPainel(i, true);
    }

    botao.addEventListener('click', function () {
        if (lista.hidden) abrir(); else fechar(true);
    });

    botao.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            abrir(true);
        }
    });

    // tirou o mouse da lista: some o destaque
    lista.addEventListener('mouseleave', function () {
        opcoes[destaque].classList.remove('destacada');
    });

    lista.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown')      { e.preventDefault(); marcar(Math.min(destaque + 1, opcoes.length - 1)); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); marcar(Math.max(destaque - 1, 0)); }
        else if (e.key === 'Home')      { e.preventDefault(); marcar(0); }
        else if (e.key === 'End')       { e.preventDefault(); marcar(opcoes.length - 1); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); escolher(destaque); }
        else if (e.key === 'Escape')    { e.preventDefault(); fechar(true); }
        else if (e.key === 'Tab')       { fechar(false); }
    });

    // clicar fora fecha a lista
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) fechar(false);
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

    function mostrarPainel(i, trocou) {
        document.querySelectorAll('.galeria-painel').forEach(function (p) {
            p.classList.remove('ativo');
        });
        document.getElementById('painel-' + i).classList.add('ativo');

        // se a pessoa já desceu nas fotos, volta para o começo do novo dia
        if (trocou) {
            var barra = document.querySelector('.galeria-selector-wrap').offsetHeight;
            var topo  = conteudo.getBoundingClientRect().top + window.scrollY - barra - 80;
            if (window.scrollY > topo) window.scrollTo({ top: topo, behavior: 'smooth' });
        }

        botao.textContent = DIAS[i].titulo;
        opcoes.forEach(function (o, j) {
            o.setAttribute('aria-selected', j === i ? 'true' : 'false');
        });
        btnAnt.disabled  = i === 0;
        btnProx.disabled = i === DIAS.length - 1;
        indice           = i;
        ativarLightbox();
    }

    btnAnt.addEventListener('click', function () {
        if (indice > 0) mostrarPainel(indice - 1, true);
    });
    btnProx.addEventListener('click', function () {
        if (indice < DIAS.length - 1) mostrarPainel(indice + 1, true);
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