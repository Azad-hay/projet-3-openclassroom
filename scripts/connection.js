
const form = document.getElementById('formulaire')

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email-user').value
    const password = document.getElementById('password-user').value
    
    try {
        const resLogin = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
        });
    
        if (!resLogin.ok) throw new Error (`HTTP ${resLogin.statut}`);

        const data = await resLogin.json();
        const token = data.token;

        localStorage.setItem('token', token);
        window.location.href= './index.html';

     
    } catch (e) {
        alert ('Email ou mot de passe incorrect.')
    }


})





