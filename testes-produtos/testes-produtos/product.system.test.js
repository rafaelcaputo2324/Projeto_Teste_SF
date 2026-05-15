describe('Cadastro e exibição de produtos', () => {

  test('Deve cadastrar e exibir produto na tabela', () => {

    const produtos = [];

    const novoProduto = {
      name: 'Notebook',
      price: 3500
    };

    // Simula cadastro
    produtos.push(novoProduto);

    // Verifica se apareceu na lista
    expect(produtos).toContainEqual(
      expect.objectContaining({
        name: 'Notebook',
        price: 3500
      })
    );

  });

});
