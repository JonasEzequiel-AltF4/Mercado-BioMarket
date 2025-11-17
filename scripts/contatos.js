document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        // Coleta os dados do formulário (opcional)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Simulação de envio
        console.log("Dados a serem enviados:", { name, email, subject, message });

        // Feedback para o usuário
        alert(`Obrigado, ${name}! Sua mensagem sobre "${subject}" foi enviada com sucesso. Responderemos em breve.`);

        // Limpa o formulário após a submissão
        contactForm.reset();
    });
});