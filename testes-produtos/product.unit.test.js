describe('Validação de Produtos', () => {

  function validarProduto(produto) {

    if (!produto.name || produto.name.trim() === '') {
      throw new Error('Nome do produto é obrigatório');
    }

    return true;
  }

  test('Deve impedir cadastro sem nome', () => {

    const produto = {
      name: '',
      price: 100
    };

    expect(() => {
      validarProduto(produto);
    }).toThrow('Nome do produto é obrigatório');

  });

});
