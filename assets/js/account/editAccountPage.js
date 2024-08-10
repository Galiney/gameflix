document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id'); // Obtém o ID do usuário da URL
  const editForm = document.getElementById('edit-profile-form');
  const profileName = document.getElementById('profile-name');
  const profilePhoto = document.getElementById('profile-photo');
  const preview = document.getElementById('preview');
  const profileBio = document.getElementById('profile-bio');
  const message = document.getElementById('message');

  // Função para carregar os detalhes do perfil
  function loadProfile() {
      if (userId) {
          const user = JSON.parse(localStorage.getItem(`user_${userId}`));
          if (user) {
              profileName.value = user.nome;
              profileBio.value = user.bio || ''; // Adiciona valor padrão para bio
              if (user.foto) {
                  preview.src = user.foto;
                  preview.style.display = 'block';
              } else {
                  preview.style.display = 'none'; // Esconde a pré-visualização se não houver foto
              }
          } else {
              message.textContent = 'User not found.';
              message.className = 'alert alert-danger';
          }
      } else {
          message.textContent = 'No user ID provided.';
          message.className = 'alert alert-danger';
      }
  }

  // Função para exibir a pré-visualização da imagem
  profilePhoto.addEventListener('change', function(event) {
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

      if (userId) {
          const existingUser = JSON.parse(localStorage.getItem(`user_${userId}`));
          if (!existingUser) {
              message.textContent = 'User not found for update.';
              message.className = 'alert alert-danger';
              return;
          }

          const updatedUser = {
              id: userId, // Mantém o mesmo ID
              nome: profileName.value.trim(),
              foto: preview.src,
              bio: profileBio.value.trim(),
              jogos: existingUser.jogos || [], // Mantém os jogos existentes
              comentarios: existingUser.comentarios || [] // Mantém os comentários existentes
          };

          // Atualiza o perfil do usuário
          localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));

          // Atualiza o currentUser se o ID do usuário corresponde ao currentUser
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser && currentUser.id === userId) {
              localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }

          message.textContent = 'Profile updated successfully!';
          message.className = 'alert alert-success';
      } else {
          message.textContent = 'No user ID provided.';
          message.className = 'alert alert-danger';
      }
  });

  loadProfile();
});
