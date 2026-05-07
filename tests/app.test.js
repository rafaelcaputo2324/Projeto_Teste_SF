const API = 'http://localhost:3000';

// ─── Mocks globais ────────────────────────────────────────────────────────────

global.fetch = jest.fn();
global.alert = jest.fn();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => { store[key] = String(value); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

delete window.location;
window.location = { href: '' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Cria um mock de resposta do fetch.
 */
function mockFetchResponse({ ok = true, status = 200, body = {} } = {}) {
  return Promise.resolve({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

/**
 * Insere elementos de formulário no DOM.
 */
function setDOMFields(fields = {}) {
  document.body.innerHTML = Object.entries(fields)
    .map(([id, value]) => `<input id="${id}" value="${value}" />`)
    .join('');
}

// ─── Funções extraídas do módulo (sem o side-effect do pathname) ──────────────

async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'products.html';
  } else {
    alert(data.message || 'Erro ao fazer login');
  }
}

async function loadProducts() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API}/products`, {
    headers: { Authorization: token },
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
  products.forEach((product) => {
    list.innerHTML += `<li>${product.name} - R$ ${product.price}</li>`;
  });
}

async function createProduct() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const token = localStorage.getItem('token');

  const response = await fetch(`${API}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ name, price }),
  });

  if (response.ok) {
    await loadProducts();
  } else {
    alert('Erro ao cadastrar produto');
  }
}

// ─── Testes ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  window.location.href = '';

  document.body.innerHTML = '';
});

// ════════════════════════════════════════════════════════════════════════════════
describe('register()', () => {
  const FIELDS = { name: 'João Silva', email: 'joao@email.com', password: '123456' };

  it('faz POST para /auth/register com os dados do formulário', async () => {
    setDOMFields(FIELDS);
    fetch.mockReturnValue(mockFetchResponse({ body: {} }));

    await register();

    expect(fetch).toHaveBeenCalledWith(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(FIELDS),
    });
  });

  it('exibe a mensagem de erro da API quando o cadastro falha', async () => {
    setDOMFields(FIELDS);
    fetch.mockReturnValue(
      mockFetchResponse({ ok: false, status: 400, body: { error: 'E-mail já cadastrado' } })
    );

    await register();

    expect(alert).toHaveBeenCalledWith('E-mail já cadastrado');
    expect(window.location.href).not.toBe('login.html');
  });

  it('exibe mensagem genérica quando a API não retorna campo error', async () => {
    setDOMFields(FIELDS);
    fetch.mockReturnValue(mockFetchResponse({ ok: false, status: 500, body: {} }));

    await register();

    expect(alert).toHaveBeenCalledWith('Erro ao cadastrar');
  });
});

// ════════════════════════════════════════════════════════════════════════════════
describe('login()', () => {
  const FIELDS = { email: 'joao@email.com', password: '123456' };

  it('faz POST para /auth/login com email e senha', async () => {
    setDOMFields(FIELDS);
    fetch.mockReturnValue(mockFetchResponse({ body: { token: 'abc123' } }));

    await login();

    expect(fetch).toHaveBeenCalledWith(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(FIELDS),
    });
  });

  it('exibe a mensagem de erro da API quando o login falha', async () => {
    setDOMFields(FIELDS);
    fetch.mockReturnValue(
      mockFetchResponse({ ok: false, status: 401, body: { message: 'Credenciais inválidas' } })
    );

    await login();

    expect(alert).toHaveBeenCalledWith('Credenciais inválidas');
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('exibe mensagem genérica quando a API não retorna campo message', async () => {
    setDOMFields(FIELDS);
    fetch.mockReturnValue(mockFetchResponse({ ok: false, status: 500, body: {} }));

    await login();

    expect(alert).toHaveBeenCalledWith('Erro ao fazer login');
  });
});

// ════════════════════════════════════════════════════════════════════════════════
describe('loadProducts()', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="products"></ul>';
    localStorageMock.getItem.mockReturnValue('token-valido');
  });

  it('faz GET para /products com o token de autorização', async () => {
    fetch.mockReturnValue(mockFetchResponse({ body: [] }));

    await loadProducts();

    expect(fetch).toHaveBeenCalledWith(`${API}/products`, {
      headers: { Authorization: 'token-valido' },
    });
  });

  it('renderiza a lista de produtos corretamente', async () => {
    const products = [
      { name: 'Notebook', price: '3500.00' },
      { name: 'Mouse', price: '150.00' },
    ];
    fetch.mockReturnValue(mockFetchResponse({ body: products }));

    await loadProducts();

    const list = document.getElementById('products');
    expect(list.innerHTML).toContain('Notebook');
    expect(list.innerHTML).toContain('3500.00');
    expect(list.innerHTML).toContain('Mouse');
    expect(list.innerHTML).toContain('150.00');
    expect(list.querySelectorAll('li')).toHaveLength(2);
  });

  it('limpa a lista antes de renderizar novos produtos', async () => {
    document.getElementById('products').innerHTML = '<li>Item antigo</li>';
    fetch.mockReturnValue(mockFetchResponse({ body: [{ name: 'Novo', price: '10' }] }));

    await loadProducts();

    expect(document.getElementById('products').innerHTML).not.toContain('Item antigo');
  });

  it('não redireciona em erros que não sejam 401', async () => {
    fetch.mockReturnValue(mockFetchResponse({ ok: false, status: 500 }));

    await loadProducts();

    expect(window.location.href).not.toBe('login.html');
  });

  it('não renderiza produtos quando a resposta não é ok', async () => {
    fetch.mockReturnValue(mockFetchResponse({ ok: false, status: 403 }));

    await loadProducts();

    expect(document.getElementById('products').innerHTML).toBe('');
  });
});

// ════════════════════════════════════════════════════════════════════════════════
describe('createProduct()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="name" value="Teclado" />
      <input id="price" value="250" />
      <ul id="products"></ul>
    `;
    localStorageMock.getItem.mockReturnValue('token-valido');
  });

  it('faz POST para /products com nome, preço e token', async () => {
    fetch.mockResolvedValue({ ok: true, status: 200, json: jest.fn().mockResolvedValue([]) });

    await createProduct();

    expect(fetch).toHaveBeenCalledWith(
      `${API}/products`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'token-valido' }),
        body: JSON.stringify({ name: 'Teclado', price: '250' }),
      })
    );
  });

  it('chama loadProducts após criar o produto com sucesso', async () => {
    // Primeira chamada: createProduct → Segunda: loadProducts
    fetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: jest.fn().mockResolvedValue({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: jest.fn().mockResolvedValue([]) });

    await createProduct();

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('exibe alerta de erro quando a criação falha', async () => {
    fetch.mockReturnValue(mockFetchResponse({ ok: false, status: 400 }));

    await createProduct();

    expect(alert).toHaveBeenCalledWith('Erro ao cadastrar produto');
  });

  it('não chama loadProducts quando a criação falha', async () => {
    fetch.mockReturnValue(mockFetchResponse({ ok: false, status: 400 }));

    await createProduct();

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});