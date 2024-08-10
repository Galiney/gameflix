document.addEventListener('DOMContentLoaded', function() {
  const userId = new URLSearchParams(window.location.search).get('id');
  const userProfile = document.getElementById('user-profile');
  const commentsSection = document.getElementById('comments-list');
  const gamesList = document.getElementById('games-list');
  const authInfo = document.getElementById('auth-info');
  const editProfileButton = document.getElementById('edit-profile-button');

  // Função para obter o usuário pelo ID
  function getUserById(userId) {
    if (!userId) return null;

    const keys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    const userKey = keys.find(key => {
      const user = JSON.parse(localStorage.getItem(key));
      return user && user.id.toString() === userId.toString(); // Comparar IDs como strings
    });
    return userKey ? JSON.parse(localStorage.getItem(userKey)) : null;
  }

  // Função para obter o usuário logado
  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || { nome: 'Anonymous' };
  }

  // Função para exibir detalhes do usuário
  function displayUserProfile(user) {
    userProfile.innerHTML = `
      <div class="col-md-6">
        <img src="${user.foto || 'default-user.jpg'}" class="img-fluid" alt="${user.nome}">
      </div>
      <div class="col-md-6">
        <h1>${user.nome}</h1>
        <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
        <p><strong>Bio:</strong> ${user.bio || 'No bio available'}</p>
      </div>
    `;
  }

  // Função para exibir comentários do usuário
  function displayComments(comments) {
    commentsSection.innerHTML = comments.map(comment => `
      <div class="comment mb-2">
        <p>${comment.text}</p>
        <small class="text-muted">- ${comment.user}</small>
      </div>
    `).join('');
  }

  // Função para exibir jogos registrados pelo usuário
  function displayUserGames(games) {
    gamesList.innerHTML = games.map(game => `
      <li>
        <a href="../game/gamePage.html?id=${game.id}" class="text-decoration-none">${game.nome}</a>
      </li>
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

  // Carregar detalhes do usuário
  function loadUser() {
    const user = getUserById(userId);
    if (user) {
      displayUserProfile(user);
      displayComments(user.comentarios || []);
      displayUserGames(user.jogos || []);
      editProfileButton.href = `editAccountPage.html?id=${userId}`; // Define o link de edição com o ID do usuário
    } else {
      userProfile.innerHTML = '<p class="text-center">User not found.</p>';
      editProfileButton.style.display = 'none'; // Oculta o botão de edição se o usuário não for encontrado
    }
  }

  updateAuthInfo(); // Atualiza a interface com base no estado de login
  loadUser();
});
