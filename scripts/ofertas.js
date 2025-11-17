document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos da página
    const offerList = document.getElementById('offer-list');
    const priceRange = document.getElementById('price-range');
    const priceValueSpan = document.getElementById('price-value');
    const cartBtn = document.getElementById('cart-btn');
    const applyFiltersBtn = document.querySelector(".primary-btn");
    const categoryCheckboxes = document.querySelectorAll(".filter-group input[type='checkbox']");

    let cartCount = 0; 
    let allProducts = []; // Armazena todos os produtos reais para filtragem

    function updateCartCount() {
        cartBtn.textContent = `🛒 Carrinho (${cartCount})`;
    }

    // Função auxiliar para exclusão
    async function deleteProduct(productId, productName) {
        const confirmar = confirm(`Deseja realmente excluir o produto "${productName}"?`);
        if (!confirmar) return;

        try {
            const response = await fetch(`http://localhost:3000/produtos/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao excluir produto');

            await loadOffersFromApi(); // Recarrega após excluir
            alert(`Produto ${productName} excluído com sucesso!`);

        } catch (error) {
            alert('Erro ao excluir produto.');
            console.error(error);
        }
    }

    // 1. Renderização dos produtos
    function renderOffers(data) {
        offerList.innerHTML = '';
        
        if (!data || data.length === 0) {
            offerList.innerHTML = '<p>Nenhum produto encontrado no momento.</p>';
            return;
        }

        data.forEach(product => {

            if (!product || typeof product.price !== 'number' || !product.id) {
                console.warn('Produto ignorado devido a dados inválidos:', product);
                return;
            }

            const currentPrice = product.price;
            const productName = product.name || product.nome || 'Produto Sem Nome';

            const card = document.createElement('div');
            card.classList.add('product-card'); 
            
            card.innerHTML = `
                <img src="${product.image || 'placeholder-oferta.jpg'}" alt="${productName}">
                <div class="product-info">
                    <span class="category">${product.category || 'Geral'}</span>
                    <h4>${productName}</h4>
                    <p class="price normal-price">R$ ${currentPrice.toFixed(2).replace('.', ',')}</p> 
                    
                    <div class="actions-container"> 
                        <button class="btn add-to-cart-btn" data-product-id="${product.id}">Adicionar</button>
                        <button class="btn btn-excluir" data-product-id="${product.id}" data-product-name="${productName}">Excluir</button>
                    </div>
                </div>
            `;
            offerList.appendChild(card);
        });
    }

    // 2. Carrega todos os produtos da API
    async function loadOffersFromApi() {
        offerList.innerHTML = '<p>Carregando produtos...</p>'; 
        
        try {
            const response = await fetch('http://localhost:3000/produtos');

            if (!response.ok) {
                throw new Error('Falha ao carregar produtos. Status: ' + response.status);
            }

            const products = await response.json();
            allProducts = products;   // Salva para filtragem
            renderOffers(products);   // Renderiza normalmente

        } catch (error) {
            console.error('Erro ao buscar produtos da API:', error);

            if (offerList) {
                offerList.innerHTML = `<p style="color: red;">❌ Erro ao conectar ao servidor de produtos. Certifique-se de que o backend esteja rodando.</p>`;
            }
        }
    }

    // 3. Atualiza valor mostrado do slider de preço
    priceRange.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        priceValueSpan.textContent = `R$ ${value.toFixed(2).replace('.', ',')}`;
    });

    // 4. Ações de carrinho e exclusão
    offerList.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('add-to-cart-btn')) {
            const productId = target.dataset.productId;

            cartCount++; 
            updateCartCount();
            
            target.textContent = 'Adicionado!';
            target.disabled = true;

            setTimeout(() => {
                target.textContent = 'Adicionar';
                target.disabled = false;
            }, 1000); 

        } else if (target.classList.contains('btn-excluir')) {
            const productId = target.dataset.productId;
            const productName = target.dataset.productName;
            deleteProduct(productId, productName);
        }
    });

    //  FILTRO COMPLETO
    function applyFilters() {

        // Categorias marcadas
        let selectedCategories = [];
        categoryCheckboxes.forEach(cb => {
            if (cb.checked) selectedCategories.push(cb.value);
        });

        const maxPrice = parseFloat(priceRange.value);

        const filtered = allProducts.filter(prod => {

            const categoryMatch =
                selectedCategories.length === 0 ||
                (prod.category && selectedCategories.includes(prod.category.toLowerCase()));

            const priceMatch = prod.price <= maxPrice;

            return categoryMatch && priceMatch;
        });

        renderOffers(filtered);
    }

    applyFiltersBtn.addEventListener("click", applyFilters);

    // Inicialização
    loadOffersFromApi(); 
    updateCartCount();
});
