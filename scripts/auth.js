document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos do Modal
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const closeBtn = authModal.querySelector('.close-btn');

    // Funções de Gerenciamento do Modal
    function openModal() {
        authModal.classList.add('visible');
    }

    function closeModal() {
        authModal.classList.remove('visible');
    }

    // 1. Fechar Modal
    closeBtn.addEventListener('click', closeModal);

    // Fechar ao clicar fora do cartão
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // 2. Alternar entre Login e Cadastro (Abas)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todas as abas e formulários
            tabBtns.forEach(t => t.classList.remove('active'));
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            
            // Adiciona a classe 'active' na aba clicada
            btn.classList.add('active');

            // Exibe o formulário correspondente
            const formType = btn.dataset.form;
            if (formType === 'login') {
                loginForm.classList.add('active');
            } else if (formType === 'register') {
                registerForm.classList.add('active');
            }
        });
    });

    // 3. Lógica de Submissão (Simulação)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login realizado com sucesso! (Simulação de envio de dados)');
        closeModal();
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Cadastro realizado com sucesso! (Simulação de envio de dados)');
        // Após o cadastro, alterna para o formulário de login
        document.querySelector('.tab-btn[data-form="login"]').click();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos do Modal
    const authModal = document.getElementById('auth-modal');
    const closeBtn = authModal.querySelector('.close-btn');
    // ... outros elementos ...

    // Funções de Gerenciamento do Modal
    function openModal() {
        authModal.classList.add('visible');
    }

    // FUNÇÃO MODIFICADA PARA REDIRECIONAR
    function closeModal() {
        // Redireciona o usuário para a página principal (index.html)
        window.location.href = 'index.html'; 
    }

    // 1. Fechar Modal (o botão 'x')
    closeBtn.addEventListener('click', closeModal);

    // Fechar ao clicar fora do cartão
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // ... restante do seu código (alternância de abas e submissões) ...
});