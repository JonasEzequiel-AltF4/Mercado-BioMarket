document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('product-register-form');


    registerForm.replaceWith(registerForm.cloneNode(true));
    const newForm = document.getElementById('product-register-form');

    newForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            nome: document.getElementById('product-name').value,
            descricao: document.getElementById('product-description').value,
            categoria: document.getElementById('category').value,
            preco: parseFloat(document.getElementById('price').value),
            estoque: parseInt(document.getElementById('stock').value),
            unidade: document.getElementById('unit-measure').value,
            sku: document.getElementById('sku').value,

            // campo da imagem incluso
            img: document.getElementById('image-upload').value,
        };

        console.log("Enviando ao backend:", formData);

        try {
            const response = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("Resposta do backend:", result);

            alert(`Produto "${formData.nome}" cadastrado com sucesso!`);
            newForm.reset();

        } catch (error) {
            console.error("Erro ao enviar produto:", error);
            alert("Erro ao cadastrar o produto!");
        }
    });
});
