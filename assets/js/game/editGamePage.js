document.addEventListener('DOMContentLoaded', function() {
  const gameId = new URLSearchParams(window.location.search).get('id');
  const editForm = document.getElementById('edit-game-form');
  const gameName = document.getElementById('game-name');
  const gamePhoto = document.getElementById('game-photo');
  const preview = document.getElementById('preview');
  const gameDescription = document.getElementById('game-description');
  const gameAgeRating = document.getElementById('game-age-rating');
  const message = document.getElementById('message');

  // Função para carregar os detalhes do jogo
  function loadGame() {
    const game = JSON.parse(localStorage.getItem(`jogo_${gameId}`));
    if (game) {
      gameName.value = game.nome;
      gameDescription.value = game.descricao;
      gameAgeRating.value = game.faixaEtaria;
      if (game.foto) {
        preview.src = game.foto;
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none'; // Esconde a pré-visualização se não houver foto
      }
    } else {
      message.textContent = 'Game not found.';
      message.className = 'alert alert-danger';
    }
  }

  // Função para exibir a pré-visualização da imagem
  gamePhoto.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = 'none'; // Esconde a pré-visualização se não houver arquivo
    }
  });

  // Função para salvar as alterações
  editForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Verifica se o jogo existe antes de atualizar
    const existingGame = JSON.parse(localStorage.getItem(`jogo_${gameId}`));
    if (!existingGame) {
      message.textContent = 'Game not found for update.';
      message.className = 'alert alert-danger';
      return;
    }

    const updatedGame = {
      id: gameId, // Mantém o mesmo ID
      nome: gameName.value.trim(),
      foto: preview.src,
      descricao: gameDescription.value.trim(),
      faixaEtaria: gameAgeRating.value.trim(),
      comentarios: existingGame.comentarios || [] // Mantém os comentários existentes
    };

    localStorage.setItem(`jogo_${gameId}`, JSON.stringify(updatedGame));

    message.textContent = 'Game updated successfully!';
    message.className = 'alert alert-success';
  });

  loadGame();
});
