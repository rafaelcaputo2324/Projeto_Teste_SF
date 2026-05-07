const API = 'http://localhost:3000';

async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
  } else {
    alert(data.error || 'Erro ao cadastrar');
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'products.html';
  } else {
    alert(data.message || 'Erro ao fazer login');
  }
}

async function createProduct() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;

  const token = localStorage.getItem('token');

  const response = await fetch(`${API}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ name, price })
  });

  if (response.ok) {
    loadProducts();
  } else {
    alert('Erro ao cadastrar produto');
  }
}

async function loadProducts() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API}/products`, {
    headers: {
      'Authorization': token
    }
  });

  if (!response.ok) {
      if (response.status === 401) {
          window.location.href = 'login.html';
      }
      return;
  }

  const products = await response.json();

  const list = document.getElementById('products');

  list.innerHTML = '';

  products.forEach(product => {
    list.innerHTML += `
      <li>
        ${product.name} - R$ ${product.price}
      </li>
    `;
  });
}

if (window.location.pathname.includes('products.html')) {
  loadProducts();
}