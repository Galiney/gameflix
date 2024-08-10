document.addEventListener('DOMContentLoaded', function() {
  const gameId = new URLSearchParams(window.location.search).get('id');
  const gameDetails = document.getElementById('game-details');
  const commentsSection = document.getElementById('comments-list');
  const commentForm = document.getElementById('comment-form');
  const commentText = document.getElementById('comment-text');
  const editGameButton = document.getElementById('edit-game-button');
  const authInfo = document.getElementById('auth-info');

  // Função para obter o usuário pelo ID
  function getUserById(userId) {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    const userKey = keys.find(key => JSON.parse(localStorage.getItem(key)).id === userId);
    return userKey ? JSON.parse(localStorage.getItem(userKey)) : null;
  }

  // Função para obter o usuário logado
  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || { nome: 'Anonymous' };
  }

  // Função para exibir detalhes do jogo
  function displayGameDetails(game) {
    const responsibleUser = getUserById(game.responsavel); // Obtém o usuário responsável pelo ID
    const responsávelNome = responsibleUser ? responsibleUser.nome : 'Unknown'; // Usa o nome do usuário ou 'Unknown'

    gameDetails.innerHTML = `
      <div class="col-md-6">
        <img src="${game.foto || 'default-image.jpg'}" class="img-fluid" alt="${game.nome}">
      </div>
      <div class="col-md-6">
        <h1>${game.nome}</h1>
        <p><strong>Description:</strong> ${game.descricao}</p>
        <p><strong>Age Rating:</strong> ${game.faixaEtaria}</p>
        <p><strong>Responsible:</strong> ${responsávelNome}</p>
      </div>
    `;
  }

  // Função para exibir comentários
  function displayComments(comments) {
    commentsSection.innerHTML = comments.map(comment => `
      <div class="comment mb-2">
        <p>${comment.text}</p>
        <small class="text-muted">- ${comment.user}</small>
      </div>
    `).join('');
  }

  // Função para atualizar as informações de autenticação
  function updateAuthInfo() {
    const user = getLoggedInUser();
    if (user) {
      // Se usuário estiver logado, mostrar nome e botão de logout
      authInfo.innerHTML = `
        <span class="mr-2">Olá, ${user.nome}</span>
        <button id="logout-btn" class="btn custom-bg-accent text-white">Logout</button>
      `;

      // Adicionar evento ao botão de logout
      document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.removeItem('currentUser'); // Remove o usuário do localStorage
        updateAuthInfo(); // Atualiza a interface após logout
        location.reload(); // Recarregar a página para atualizar as informações
      });
    } else {
      // Se não estiver logado, mostrar o botão de login
      authInfo.innerHTML = `
        <button id="auth-toggle" class="btn custom-bg-accent text-white">Login</button>
      `;
      document.getElementById('auth-toggle').addEventListener('click', function () {
        window.location.href = '../account/registerLogin.html'; // Redireciona para a página de Login/Registro
      });
    }
  }

  // Carregar detalhes do jogo
  function loadGame() {
    const game = JSON.parse(localStorage.getItem(`jogo_${gameId}`));
    if (game) {
      displayGameDetails(game);
      displayComments(game.comentarios || []);
      editGameButton.href = `editGamePage.html?id=${gameId}`; // Define o link de edição com o ID do jogo
    } else {
      gameDetails.innerHTML = '<p class="text-center">Game not found.</p>';
      editGameButton.style.display = 'none'; // Oculta o botão de edição se o jogo não for encontrado
    }
  }

// Adicionar um novo comentário
commentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const user = getLoggedInUser();
  const comment = {
    text: commentText.value.trim(),
    user: user.nome // Usando o nome do usuário logado
  };

  // Atualizar comentários do jogo
  const game = JSON.parse(localStorage.getItem(`jogo_${gameId}`));
  if (game) {
    game.comentarios = game.comentarios || [];
    game.comentarios.push(comment);
    localStorage.setItem(`jogo_${gameId}`, JSON.stringify(game));
    displayComments(game.comentarios);
  }

  // Atualizar comentários do usuário logado
  if (user) {
    const userKey = `user_${user.id}`;
    const loggedInUser = JSON.parse(localStorage.getItem(userKey));
    if (loggedInUser) {
      loggedInUser.comentarios = loggedInUser.comentarios || [];
      loggedInUser.comentarios.push(comment);
      localStorage.setItem(userKey, JSON.stringify(loggedInUser));
    }
  }

  // Atualizar o currentUser
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    currentUser.comentarios = currentUser.comentarios || [];
    currentUser.comentarios.push(comment);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Limpar o campo de comentário
  commentText.value = '';
});





  updateAuthInfo(); // Atualiza a interface com base no estado de login
  loadGame();
});
