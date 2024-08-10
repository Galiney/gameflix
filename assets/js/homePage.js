document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('game-container');
  const noGamesMessage = document.getElementById('no-games-message');
  const clearGamesButton = document.getElementById('clear-games');
  const authInfo = document.getElementById('auth-info');
  const registerGameButton = document.querySelector('.auth-buttons .btn.custom-bg-accent');
  const searchInput = document.querySelector('.search-bar input');
  const filterButton = document.querySelector('.search-bar .btn.custom-bg-secondary');

  let games = []; // Armazena os jogos carregados

  // Função para exibir jogos
  function displayGames(filteredGames = games) {
      if (filteredGames.length === 0) {
          noGamesMessage.style.display = 'block';
          container.style.display = 'none';
      } else {
          noGamesMessage.style.display = 'none';
          container.style.display = 'flex';

          container.innerHTML = ''; // Limpa o container antes de adicionar os novos cards

          filteredGames.forEach(jogo => {
              // Criar o card do jogo
              const cardHTML = `
                  <div class="col-md-4 mb-4">
                      <a href="game/gamePage.html?id=${jogo.id}" class="text-decoration-none">
                          <div class="card custom-border-primary">
                              <img src="${jogo.foto || 'default-image.jpg'}" class="card-img-top" alt="${jogo.nome}">
                              <div class="card-body">
                                  <h5 class="card-title custom-text">${jogo.nome}</h5>
                                  <p class="card-text custom-text">${jogo.descricao}</p>
                              </div>
                          </div>
                      </a>
                  </div>
              `;

              container.insertAdjacentHTML('beforeend', cardHTML);
          });
      }
  }

  // Função para limpar os jogos salvos
  function clearGames() {
      if (confirm('Are you sure you want to clear all saved games?')) {
          localStorage.clear();
          games = []; // Limpa o array de jogos
          displayGames(); // Atualiza a visualização após limpar
      }
  }

  // Adicionar evento ao botão de limpar jogos
  clearGamesButton.addEventListener('click', clearGames);

  // Função para obter o usuário logado
  function getLoggedInUser() {
      return JSON.parse(localStorage.getItem('currentUser'));
  }

  // Função para atualizar as informações de autenticação
  function updateAuthInfo() {
      const user = getLoggedInUser();

      if (user) {
          // Se usuário estiver logado, mostrar nome e botão de logout
          authInfo.innerHTML = `
              <span class="mr-2">Olá, ${user.nome}</span>
              <a href="account/accountPage.html?id=${user.id}" class="btn custom-bg-primary text-white mr-2">My Page</a>
              <button id="logout-btn" class="btn custom-bg-accent text-white">Logout</button>
          `;
          
          // Mostrar o botão de registrar jogo
          registerGameButton.style.display = 'inline-block';

          // Adicionar evento ao botão de logout
          document.getElementById('logout-btn').addEventListener('click', function () {
              localStorage.removeItem('currentUser'); // Remove o usuário do localStorage
              updateAuthInfo(); // Atualiza a interface após logout
          });
      } else {
          // Se não estiver logado, mostrar o botão de login
          authInfo.innerHTML = `
              <button id="auth-toggle" class="btn custom-bg-accent text-white">Login</button>
          `;
          
          // Ocultar o botão de registrar jogo
          registerGameButton.style.display = 'none';

          document.getElementById('auth-toggle').addEventListener('click', function () {
              window.location.href = 'account/registerLogin.html'; // Redireciona para a página de Login/Registro
          });
      }
  }

  // Função para carregar e exibir todos os jogos
  function loadGames() {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('jogo_'));

      games = keys.map(key => JSON.parse(localStorage.getItem(key)));

      displayGames(games); // Exibe todos os jogos inicialmente
  }

  // Função para filtrar os jogos
  function filterGames(searchTerm) {
      const filteredGames = games.filter(jogo =>
          jogo.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      displayGames(filteredGames);
  }

  // Adicionar evento ao botão de filtro
  filterButton.addEventListener('click', function () {
      const searchTerm = searchInput.value.trim();
      filterGames(searchTerm);
  });

  // Atualiza a interface com base no estado de login e carrega os jogos
  updateAuthInfo();
  loadGames();
});
