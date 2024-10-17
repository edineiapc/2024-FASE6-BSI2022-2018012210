const mainForm = document.querySelector('form')

void async function () {
  const response = await fetch('/users')
  const users = await response.json()
  users.forEach(user => {
    const newForm = mainForm.cloneNode(true)
    newForm.name.value = user.name
    newForm.email.value = user.email
    newForm.dataset.id = user.id
    mainForm.before(newForm)
  })
  console.log(users)
}()

document.addEventListener('submit', async (event) => {
  event.preventDefault()
  const action = event.submitter.dataset.action ?? null
  const currentForm = event.target

  //Peguei o token do local storage, que foi inserido no login
  let data = localStorage.getItem("token");

  if (action === 'delete') {
    const id = currentForm.dataset.id
    const method = 'DELETE'
    //Enviei o token no cabaçalho da requisição para validar posteriormetne o usuário
    const headers = { 'Authorization': data }
    const url = `/users/${id}`
    const response = await fetch(url, { method, headers })

    const resposeData = await response.json()

    //Alterei o retorno para exiber o possível erro
    if (!response.ok) {
      alert("o servidor nos disse: " + resposeData.message)

      //Alterei o retorno par redirecionar para fazer novo login se expirou a sessão
      if(resposeData.message == "Token expired"){
        location.href = '/index.html'
      }
    }
    else{
      currentForm.remove()
    }
    
    return
  }
  
  if (action === 'update') {
    const id = currentForm.dataset.id
    const method = 'PUT'
    const url = `/users/${id}`
    const headers = { 'Content-Type': 'application/json','Authorization': data }
    const name = currentForm.name.value
    const email = currentForm.email.value
    const body = JSON.stringify({ name, email })
    const response = await fetch(url, { method, headers, body, })

    const resposeData = await response.json()

    //Alterei o retorno para exiber o possível erro
    if (!response.ok) {
      alert("o servidor nos disse: " + resposeData.message)
      
      //Alterei o retorno par redirecionar para fazer novo login se expirou a sessão
      if(resposeData.message == "Token expired"){
        location.href = '/index.html'
      }
      
    }

    return
  }
  
  if (action === 'create') {
    const method = 'POST'
    const url = '/users'
    const headers = { 'Content-Type': 'application/json' }
    const name = currentForm.name.value
    const email = currentForm.email.value
    const body = JSON.stringify({ name, email })
    const response = await fetch(url, { method, headers, body })
    if (!response.ok)
      return console.error('Error:', response.statusText)
    const responseData = await response.json()
    const newForm = mainForm.cloneNode(true)
    newForm.name.value = responseData.name
    newForm.email.value = responseData.email
    newForm.dataset.id = responseData.id
    mainForm.reset()
    mainForm.before(newForm)
    return
  }
})