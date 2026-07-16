// ================================================================
// 1. VARIÁVEIS GLOBAIS (ESTADO DO APP)
// ================================================================
let imagensGaleriaAtiva = [];
let indiceAtual = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

// ================================================================
// 2. FUNÇÃO PARA AS ABAS (PLANOS)
// ================================================================
window.abrirAba = function(evt, nomeAba) {
    var i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { 
        tabcontent[i].classList.remove("active"); 
    }
    
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { 
        tablinks[i].classList.remove("active"); 
    }
    
    const abaAtiva = document.getElementById(nomeAba);
    abaAtiva.classList.add("active");
    evt.currentTarget.classList.add("active");

    const cards = abaAtiva.querySelectorAll('.plano-card-v2');
    cards.forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight; 
        card.style.animation = null;
    });
}

// ================================================================
// 3. LÓGICA DO PORTFÓLIO (FILTROS)
// ================================================================
const botoesFiltro = document.querySelectorAll('.filter-btn');
const itensPortfolio = document.querySelectorAll('#portfolio .portfolio-item');

botoesFiltro.forEach(button => {
    button.addEventListener('click', () => {
        botoesFiltro.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        let filtro = button.getAttribute('data-nicho');
        if (!filtro) {
            if (button.innerText.toUpperCase().includes("TODOS")) {
                filtro = 'todos';
            }
        }

        itensPortfolio.forEach(item => {
            const nichoItem = item.getAttribute('data-nicho');
            
            if (filtro === 'todos' || filtro === nichoItem) {
                item.style.display = "block";
                setTimeout(() => {
                    item.classList.remove('hide');
                    item.style.opacity = "1";
                    item.style.transform = "scale(1)";
                }, 10);
            } else {
                item.classList.add('hide');
                item.style.display = "none"; 
            }
        });
    });
});

// ================================================================
// 4. GALERIA UNIVERSAL (ZOOM, SETAS, TECLADO E GESTOS)
// ================================================================
window.abrirGaleria = function(elemento) {
    const listaOculta = elemento.querySelector('.lista-interna');
    if (!listaOculta) return;

    const imgs = listaOculta.querySelectorAll('img');
    imagensGaleriaAtiva = Array.from(imgs).map(img => img.src);
    indiceAtual = 0;

    if (imagensGaleriaAtiva.length > 0) {
        atualizarLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function atualizarLightbox() {
    if (lightboxImg && imagensGaleriaAtiva[indiceAtual]) {
        lightboxImg.src = imagensGaleriaAtiva[indiceAtual];
        const contador = document.getElementById('contador-lightbox');
        if (contador) {
            contador.innerText = `${indiceAtual + 1} / ${imagensGaleriaAtiva.length}`;
        }
    }
}

function proximaImagem() {
    indiceAtual = (indiceAtual + 1) % imagensGaleriaAtiva.length;
    atualizarLightbox();
}

function imagemAnterior() {
    indiceAtual = (indiceAtual - 1 + imagensGaleriaAtiva.length) % imagensGaleriaAtiva.length;
    atualizarLightbox();
}

function fecharGaleria() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Eventos de Clique e Fechamento
document.querySelector('.proxima').addEventListener('click', (e) => { e.stopPropagation(); proximaImagem(); });
document.querySelector('.anterior').addEventListener('click', (e) => { e.stopPropagation(); imagemAnterior(); });
document.querySelector('.fechar-lightbox').addEventListener('click', fecharGaleria);

document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === "ArrowRight") proximaImagem();
        if (e.key === "ArrowLeft")  imagemAnterior();
        if (e.key === "Escape")     fecharGaleria();
    }
});

lightbox.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') fecharGaleria();
});

// Lógica de Deslizar (Swipe) Otimizada para Celular (Sem conflito de rolagem vertical)
lightbox.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
}, {passive: true});

lightbox.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
}, {passive: true});

function handleGesture() {
    const diferencaX = touchendX - touchstartX;
    const diferencaY = touchendY - touchstartY;

    // Só detecta o swipe se o movimento horizontal for maior que o vertical
    // Isso impede que a tentativa de arrastar a tela para cima/baixo mude de imagem acidentalmente
    if (Math.abs(diferencaX) > Math.abs(diferencaY)) {
        if (diferencaX < -60) {
            proximaImagem(); // Deslizou para a esquerda
        } else if (diferencaX > 60) {
            imagemAnterior(); // Deslizou para a direita
        }
    }
}

// ================================================================
// 5. WHATSAPP E MENU SCROLL (VERSÃO CORRIGIDA)
// ================================================================
document.querySelectorAll('.btn-whatsapp-plano').forEach(botao => {
    botao.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.plano-card-v2');
        const nomePlano = card.querySelector('.plano-header-v2').innerText;
        const valorPlano = card.querySelector('.plano-investimento h3').innerText;
        const numeroWhatsapp = "5582991638322";
        const mensagem = `Olá! Gostaria de solicitar o plano: *${nomePlano}* %0A` +
                         `Valor anunciado: *${valorPlano}* %0A%0A` +
                         `Pode me passar mais informações sobre como começar?`;
        window.open(`https://wa.me/${numeroWhatsapp}?text=${mensagem}`, '_blank');
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-cyan a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (current && href && href.includes(`#${current}`)) {
            link.classList.add('active');
        }
    });
});

// ================================================================
// 6. EFEITO DE REVELAR AO ROLAR (SCROLL REVEAL)
// ================================================================
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => revealObserver.observe(el));
});
