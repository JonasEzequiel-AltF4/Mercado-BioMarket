document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const cartBtn = document.getElementById('cart-btn');

    let produtos = [];
    let carrinho = [];

    // ==========================
    // Função para renderizar produtos
    // ==========================
    function renderProducts(lista) {
        productList.innerHTML = '';
        lista.forEach(p => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            card.innerHTML = `
                <img src="${p.image || 'placeholder.jpg'}" alt="${p.name}">
                <div class="product-info">
                    <span class="category">${p.category}</span>
                    <h4>${p.name}</h4>
                    <p class="price">R$ ${Number(p.price).toFixed(2).replace('.', ',')}</p>
                    <button class="btn add-to-cart-btn" data-product-id="${p.id}">Adicionar</button>
                </div>
            `;

            productList.appendChild(card);
        });

        // Adicionar evento nos botões
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.productId);
                addToCart(id);
            });
        });
    }

    // ==========================
    // Função para buscar produtos
    // ==========================
    function fetchProducts(busca = '') {
        fetch('http://localhost:3000/produtos')
            .then(res => res.json())
            .then(data => {
                produtos = data;

                if (busca) {
                    const filtrados = produtos.filter(p =>
                        p.name.toLowerCase().includes(busca.toLowerCase())
                    );
                    renderProducts(filtrados);
                } else {
                    renderProducts(produtos);
                }
            })
            .catch(err => console.error('Erro ao carregar produtos:', err));
    }

    // ==========================
    // Carrinho
    // ==========================
    function addToCart(id) {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;

        const existente = carrinho.find(p => p.id === id);
        if (existente) {
            existente.qtd += 1;
        } else {
            carrinho.push({ ...produto, qtd: 1 });
        }

        updateCartDisplay();
    }

    function updateCartDisplay() {
        const total = carrinho.reduce((sum, p) => sum + p.qtd, 0);
        cartBtn.textContent = `🛒 Carrinho (${total})`;
    }

    // ==========================
    // Eventos
    // ==========================
    searchInput.addEventListener('input', () => {
        fetchProducts(searchInput.value);
    });

    // ==========================
    // Inicial
    // ==========================
    fetchProducts();
});
