document.addEventListener('DOMContentLoaded', function() {
  const formContainer = document.getElementById('form-container');
  const formTitle = document.getElementById('form-title');
  const submitButton = document.getElementById('submit-btn');
  const switchAuth = document.getElementById('switch-auth');
  const authForm = document.getElementById('auth-form');
  const message = document.getElementById('message');
  const nameField = document.getElementById('name');
  const nameGroup = document.getElementById('name-group');
  const profilePhotoInput = document.getElementById('profile-photo');
  const photoPreview = document.getElementById('photo-preview');
  const photoGroup = document.getElementById('photo-group');

  // Função para alternar entre login e registro
  function toggleForm() {
    const isLogin = authForm.getAttribute('data-type') === 'login';

    if (isLogin) {
      formTitle.textContent = 'Register';
      submitButton.textContent = 'Register';
      authForm.setAttribute('data-type', 'register');
      nameGroup.style.display = 'block';
      photoGroup.style.display = 'block';
    } else {
      formTitle.textContent = 'Login';
      submitButton.textContent = 'Login';
      authForm.setAttribute('data-type', 'login');
      nameGroup.style.display = 'none';
      photoGroup.style.display = 'none';
    }
  }

  // Exibe a pré-visualização da imagem quando selecionada
  profilePhotoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.style.display = 'none';
    }
  });

  // Função para gerar um ID único para o usuário
  function generateUserId() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    return keys.length > 0 ? Math.max(...keys.map(key => parseInt(key.split('_')[1], 10))) + 1 : 1;
  }

  // Função para verificar se o email já está registrado
  function emailExists(email) {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    return keys.map(key => JSON.parse(localStorage.getItem(key)))
               .some(user => user.email === email);
  }

  // Função para salvar um usuário no localStorage
  function saveUser(usuario, userId) {
    localStorage.setItem(`user_${userId}`, JSON.stringify(usuario));
  }

  // Função para exibir mensagens
  function displayMessage(text, type) {
    message.textContent = text;
    message.className = `alert alert-${type}`;
  }

  // Evento para alternar o formulário
  switchAuth.addEventListener('click', toggleForm);

  // Evento para o envio do formulário
  authForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formType = authForm.getAttribute('data-type');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();
    const photoFile = profilePhotoInput.files[0];

    if (!email || !password) {
      displayMessage('Email and password are required', 'danger');
      return;
    }

    if (formType === 'login') {
      // Lógica para login
      const keys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
      const user = keys.map(key => JSON.parse(localStorage.getItem(key)))
                       .find(user => user.email === email && user.senha === password);

      if (user) {
        displayMessage('Login successful!', 'success');
        localStorage.setItem('currentUser', JSON.stringify(user));
        setTimeout(() => {
          window.location.href = '../homePage.html'; // Redireciona para a página inicial
        }, 1000);
      } else {
        displayMessage('Invalid email or password', 'danger');
      }
    } else {
      // Lógica para registro
      if (!name) {
        displayMessage('Name is required', 'danger');
        return;
      }

      if (emailExists(email)) {
        displayMessage('Email is already registered', 'danger');
        return;
      }

      // Gera um novo ID para o usuário
      const userId = generateUserId();

      // Cria um novo objeto Usuario
      const novoUsuario = new Usuario(userId, name, email, password); // ID atribuído aqui

      // Adiciona a foto de perfil, se disponível
      if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          novoUsuario.foto = e.target.result;
          saveUser(novoUsuario, userId);
          localStorage.setItem('currentUser', JSON.stringify(novoUsuario)); // Define o novo usuário como o usuário atual
          displayMessage('User registered successfully!', 'success');
          setTimeout(() => {
            window.location.href = '../homePage.html'; // Redireciona para a página inicial
          }, 1000);
        };
        reader.readAsDataURL(photoFile);
      } else {
        saveUser(novoUsuario, userId);
        localStorage.setItem('currentUser', JSON.stringify(novoUsuario)); // Define o novo usuário como o usuário atual
        displayMessage('User registered successfully!', 'success');
        setTimeout(() => {
          window.location.href = '../homePage.html'; // Redireciona para a página inicial
        }, 1000);
      }
    }
  });
});
