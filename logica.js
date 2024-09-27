// Adiciona um evento que aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todas as seções com a classe "section"
    const sections = document.querySelectorAll('.section');
    // Seleciona todos os links de navegação dentro do nav
    const navLinks = document.querySelectorAll('nav a');

    // Função para alterar o estado dos links da navegação com base na posição da rolagem
    function changeLinkState() {
        let index = sections.length; // Inicializa o índice com o número total de seções

        // Percorre as seções de baixo para cima
        while (--index && window.scrollY + 50 < sections[index].offsetTop) {}
        
        // Remove a classe 'active' de todos os links
        navLinks.forEach((link) => link.classList.remove('active'));
        // Adiciona a classe 'active' ao link correspondente à seção atualmente visível
        navLinks[index].classList.add('active');
    }

    // Função que revela uma seção quando ela está visível na viewport
    function revealSection(entries, observer) {
        // Percorre cada entrada observada
        entries.forEach((entry) => {
            // Verifica se a entrada está intersectando a viewport
            if (entry.isIntersecting) {
                // Adiciona a classe 'active' à seção visível
                entry.target.classList.add('active');
                // Para de observar a seção após ser revelada
                observer.unobserve(entry.target);
            }
        });
    }

    // Cria um observador de interseção para monitorar as seções
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null, // Define o root como a viewport
        threshold: 0.15, // Define o limite de interseção em 15%
    });

    // Observa cada seção usando o observador criado
    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    // Função para rolagem suave ao clicar nos links de navegação
    function smoothScroll(e) {
        e.preventDefault(); // Impede o comportamento padrão do link
        const targetId = e.currentTarget.getAttribute('href'); // Obtém o ID do destino
        const targetPosition = document.querySelector(targetId).offsetTop; // Obtém a posição do destino
        const startPosition = window.pageYOffset; // Posição atual da rolagem
        const distance = targetPosition - startPosition; // Distância a ser percorrida
        const duration = 1000; // Duração da animação em milissegundos
        let start = null; // Variável para armazenar o tempo de início

        // Função de animação
        function animation(currentTime) {
            if (start === null) start = currentTime; // Define o tempo de início
            const timeElapsed = currentTime - start; // Calcula o tempo decorrido
            const run = ease(timeElapsed, startPosition, distance, duration); // Calcula a posição atual
            window.scrollTo(0, run); // Rola a página para a posição calculada
            if (timeElapsed < duration) requestAnimationFrame(animation); // Continua a animação até a duração
        }

        // Função de easing para suavizar a animação
        function ease(t, b, c, d) {
            t /= d / 2; // Normaliza o tempo
            if (t < 1) return c / 2 * t * t + b; // Easing para a primeira metade
            t--; // Ajusta o valor de t
            return -c / 2 * (t * (t - 2) - 1) + b; // Easing para a segunda metade
        }

        requestAnimationFrame(animation); // Inicia a animação
    }

    // Adiciona o evento de clique em cada link para a rolagem suave
    navLinks.forEach((link) => {
        link.addEventListener('click', smoothScroll);
    });

    // Função para criar uma peça de Tetris
    function createTetrisPiece() {
        const piece = document.createElement('div'); // Cria um novo elemento div
        piece.classList.add('tetris-piece'); // Adiciona a classe 'tetris-piece' ao elemento
        piece.style.left = `${Math.random() * window.innerWidth}px`; // Define uma posição aleatória na horizontal
        piece.style.animation = `fall ${Math.random() * 3 + 2}s linear`; // Define uma animação de queda com duração aleatória
        document.body.appendChild(piece); // Adiciona a peça ao corpo do documento

        // Adiciona um evento para remover a peça e criar uma nova após a animação terminar
        piece.addEventListener('animationend', () => {
            piece.remove(); // Remove a peça após a animação
            createTetrisPiece(); // Cria uma nova peça
        });
    }

    // Define o número de peças com base na largura da janela
    const numPieces = window.innerWidth < 768 ? 15 : 100; // Se a largura da janela for menor que 768px, cria 5 peças; caso contrário, cria 10
    for (let i = 0; i < numPieces; i++) {
        setTimeout(createTetrisPiece, i * 500); // Cria cada peça com um atraso de 500ms entre elas
    }

    // Função para lidar com redimensionamentos da janela
    function handleResize() {
        // Se a largura da janela for menor que 768px
        if (window.innerWidth < 768) {
            // Remove todas as peças de Tetris existentes
            document.querySelectorAll('.tetris-piece').forEach(piece => piece.remove());
            // Cria 5 novas peças de Tetris
            for (let i = 0; i < 5; i++) {
                setTimeout(createTetrisPiece, i * 500);
            }
        }
    }

    // Adiciona um evento de redimensionamento da janela
    window.addEventListener('resize', handleResize);

    // Adiciona um evento de rolagem da janela
    window.addEventListener('scroll', () => {
        changeLinkState(); // Altera o estado do link ao rolar
        const scrolled = window.scrollY; // Obtém a quantidade de rolagem
        // Aplica um efeito de parallax nas seções com base na quantidade de rolagem
        sections.forEach((section, index) => {
            const speed = 0.2 * (index + 1); // Calcula a velocidade do parallax com base no índice da seção
            section.style.transform = `translateY(${scrolled * speed * 0.4}px)`; // Aplica a transformação
        });
    });
});
