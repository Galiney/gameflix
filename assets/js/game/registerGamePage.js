document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('game-form');
  const message = document.getElementById('message');
  const preview = document.getElementById('preview');
  const fileInput = document.getElementById('game-photo');
  const authInfo = document.getElementById('auth-info');

  // Exibe a pré-visualização da imagem quando selecionada
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = 'none';
    }
  });

  // Função para gerar um ID único
  function generateUniqueId() {
    let id = localStorage.getItem('nextGameId') || 1;
    localStorage.setItem('nextGameId', parseInt(id) + 1);
    return id;
  }

  // Função para obter o usuário atual
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  // Função para atualizar as informações de autenticação
  function updateAuthInfo() {
    const user = getCurrentUser();

    if (user) {
      // Se usuário estiver logado, mostrar nome e botão de logout
      authInfo.innerHTML = `
        <span class="mr-2">Olá, ${user.nome}</span>
        <button id="logout-btn" class="btn custom-bg-accent text-white">Logout</button>
      `;

      // Adicionar evento ao botão de logout
      document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser'); // Remove o usuário do localStorage
        updateAuthInfo(); // Atualiza a interface após logout
      });
    } else {
      // Se não estiver logado, mostrar o botão de login
      authInfo.innerHTML = `
        <button id="auth-toggle" class="btn custom-bg-accent text-white">Login</button>
      `;
      document.getElementById('auth-toggle').addEventListener('click', function() {
        window.location.href = '../account/registerLogin.html'; // Redireciona para a página de Login/Registro
      });
    }
  }

  // Chama a função para atualizar as informações de autenticação
  updateAuthInfo();

  // Evento de submissão do formulário
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    // Gera um ID único
    const id = generateUniqueId();
    const nome = document.getElementById('game-name').value.trim();
    const descricao = document.getElementById('game-description').value.trim();
    const faixaEtaria = document.getElementById('game-age-rating').value.trim();

    // Obtém o usuário atual
    const currentUser = getCurrentUser();
    const responsável = currentUser ? currentUser.id : 'Anônimo'; // Usa o ID do usuário ou 'Anônimo'

    // Cria o objeto do jogo
    const novoJogo = new Jogo(
      id,
      nome,
      '', // Inicialmente vazio, será atualizado se uma imagem for selecionada
      descricao,
      faixaEtaria,
      responsável
    );

    // Adiciona a URL da imagem se disponível
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        novoJogo.foto = e.target.result;

        // Salva o jogo no localStorage
        novoJogo.salvarNoLocalStorage();

        // Atualiza a lista de jogos do usuário
        if (currentUser) {
          currentUser.jogos = currentUser.jogos || [];
          currentUser.jogos.push(novoJogo);
          localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(currentUser)); // Atualiza o usuário no localStorage
          localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Atualiza o currentUser
        }

        // Exibe uma mensagem de sucesso
        message.textContent = 'Game registered successfully!';
        message.className = 'alert alert-success';

        // Limpa o formulário e a pré-visualização
        form.reset();
        preview.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      // Salva o jogo sem a imagem
      novoJogo.salvarNoLocalStorage();

      // Atualiza a lista de jogos do usuário
      if (currentUser) {
        currentUser.jogos = currentUser.jogos || [];
        currentUser.jogos.push(novoJogo);
        localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(currentUser)); // Atualiza o usuário no localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Atualiza o currentUser
      }

      // Exibe uma mensagem de sucesso
      message.textContent = 'Game registered successfully!';
      message.className = 'alert alert-success';

      // Limpa o formulário e a pré-visualização
      form.reset();
      preview.style.display = 'none';
    }
  });
});