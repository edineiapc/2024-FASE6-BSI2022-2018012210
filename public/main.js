
const mainForm = document.querySelector('form')
// Seleciona o primeiro elemento <form> no documento e armazena sua referência na variável mainForm.

void async function () {
  const response = await fetch('/users')
  // Faz uma requisição HTTP GET para a rota '/users' para obter uma lista de usuários.

  const users = await response.json()
  // Converte a resposta da requisição em JSON e a armazena na variável users.

  users.forEach(user => {
    // Itera sobre o array de usuários retornados da API.

    const newForm = mainForm.cloneNode(true)
    // Clona o formulário armazenado em mainForm para criar um novo formulário para cada usuário.

    newForm.name.value = user.name
    // Define o valor do campo "name" do novo formulário com o nome do usuário.

    newForm.email.value = user.email
    // Define o valor do campo "email" do novo formulário com o email do usuário.

    newForm.dataset.id = user.id
    // Define o atributo de dados "data-id" do novo formulário com o id do usuário.

    newForm.id.readOnly = true
    // Define o campo de id como somente leitura para impedir que seja editado.

    mainForm.before(newForm)
    // Insere o novo formulário clonado antes do formulário principal no DOM.
  })

  console.log(users)
  // Exibe a lista de usuários no console.
}()

document.addEventListener('submit', async (event) => {
  event.preventDefault()
  // Previne o comportamento padrão do formulário (que seria enviar uma requisição HTTP).

  const action = event.submitter.dataset.action ?? null
  // Obtém o valor do atributo "data-action" do botão que submeteu o formulário. Se não houver ação, define como null.

  const currentForm = event.target
  // Obtém o formulário atual que foi submetido.

  if (action === 'delete') {
    // Verifica se a ação do botão é 'delete' (exclusão de usuário).

    const id = currentForm.dataset.id
    // Obtém o id do usuário do atributo "data-id" do formulário.

    const method = 'DELETE'
    // Define o método HTTP como DELETE para a requisição.

    const url = `/users/${id}`
    // Define a URL da API com o id do usuário que será deletado.

    const response = await fetch(url, { method })
    // Envia a requisição DELETE para o servidor.

    if (!response.ok)
      return console.error('Error:', response.statusText)
    // Se a resposta não for bem-sucedida, exibe um erro no console e interrompe a execução.

    currentForm.remove()
    // Remove o formulário do DOM se o usuário foi deletado com sucesso.

    return
  }

  if (action === 'update') {
    // Verifica se a ação do botão é 'update' (atualização de dados do usuário).

    const id = currentForm.dataset.id
    // Obtém o id do usuário a partir do atributo "data-id" do formulário.

    const method = 'PUT'
    // Define o método HTTP como PUT para a requisição.

    const url = `/users/${id}`
    // Define a URL da API com o id do usuário que será atualizado.

    const headers = { 'Content-Type': 'application/json' }
    // Define o cabeçalho da requisição para indicar que o corpo da requisição está em formato JSON.

    const name = currentForm.name.value
    // Obtém o valor atualizado do campo "name" do formulário.

    const email = currentForm.email.value
    // Obtém o valor atualizado do campo "email" do formulário.

    const body = JSON.stringify({ name, email })
    // Cria o corpo da requisição com os valores de nome e email em formato JSON.

    const response = await fetch(url, { method, headers, body })
    // Envia a requisição PUT para o servidor com os dados do usuário.

    if (!response.ok)
      return console.error('Error:', response.statusText)
    // Se a resposta não for bem-sucedida, exibe um erro no console e interrompe a execução.

    const responseData = await response.json()
    // Converte a resposta da requisição (dados atualizados) em JSON.

    currentForm.name.value = responseData.name
    // Atualiza o campo "name" do formulário com o valor atualizado retornado da API.

    currentForm.email.value = responseData.email
    // Atualiza o campo "email" do formulário com o valor atualizado retornado da API.

    return
  }

  if (action === 'create') {
    // Verifica se a ação do botão é 'create' (criação de um novo usuário).

    const method = 'POST'
    // Define o método HTTP como POST para a requisição.

    const url = '/users'
    // Define a URL da API para criar um novo usuário.

    const headers = { 'Content-Type': 'application/json' }
    // Define o cabeçalho da requisição para indicar que o corpo da requisição está em formato JSON.

    const name = currentForm.name.value
    // Obtém o valor do campo "name" do formulário para o novo usuário.

    const email = currentForm.email.value
    // Obtém o valor do campo "email" do formulário para o novo usuário.

    const body = JSON.stringify({ name, email })
    // Cria o corpo da requisição com os valores de nome e email em formato JSON.

    const response = await fetch(url, { method, headers, body })
    // Envia a requisição POST para o servidor com os dados do novo usuário.

    if (!response.ok)
      return console.error('Error:', response.statusText)
    // Se a resposta não for bem-sucedida, exibe um erro no console e interrompe a execução.

    const responseData = await response.json()
    // Converte a resposta da requisição (dados do novo usuário) em JSON.

    const newForm = mainForm.cloneNode(true)
    // Clona o formulário principal para criar um novo formulário para o novo usuário.

    newForm.name.value = responseData.name
    // Define o valor do campo "name" do novo formulário com o nome retornado da API.

    newForm.email.value = responseData.email
    // Define o valor do campo "email" do novo formulário com o email retornado da API.

    newForm.dataset.id = responseData.id
    // Define o atributo "data-id" do novo formulário com o id retornado da API.

    newForm.id.readOnly = true
    // Define o campo de id como somente leitura para impedir que seja editado.

    mainForm.reset()
    // Reseta o formulário principal após a criação do novo usuário.

    mainForm.before(newForm)
    // Insere o novo formulário clonado antes do formulário principal no DOM.

    return
  }
})
// Adiciona um ouvinte de evento que escuta submissões de formulários e executa o código acima de acordo com a ação (create, update ou delete).
