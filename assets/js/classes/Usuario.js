class Usuario {
  constructor(id, nome, email, senha) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha; // Nota: Senhas não devem ser armazenadas em texto simples em um ambiente de produção real
    this.amigos = [];
    this.comentarios = [];
    this.jogos = [];
  }

  // Método para atualizar o nome do usuário
  atualizarNome(novoNome) {
    this.nome = novoNome;
  }

  // Método para atualizar o email do usuário
  atualizarEmail(novoEmail) {
    this.email = novoEmail;
  }

  // Método para atualizar a senha do usuário
  atualizarSenha(novaSenha) {
    this.senha = novaSenha;
  }

  // Método para exibir as informações do usuário (excluindo a senha por questões de segurança)
  exibirInformacoes() {
    console.log(`Nome: ${this.nome}`);
    console.log(`Email: ${this.email}`);
  }

  // Método para validar o email (exemplo simples de validação)
  validarEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(this.email);
  }

  // Método para verificar se a senha é segura (exemplo simples)
  verificarSenhaSegura() {
    return this.senha.length >= 6; // Exemplo: senha deve ter pelo menos 6 caracteres
  }

  // Método para adicionar um amigo
  adicionarAmigo(amigo) {
    if (!this.amigos.includes(amigo)) {
      this.amigos.push(amigo);
    }
  }

  // Método para remover um amigo
  removerAmigo(amigo) {
    this.amigos = this.amigos.filter(a => a !== amigo);
  }

  // Método para adicionar um comentário
  adicionarComentario(comentario) {
    this.comentarios.push(comentario);
  }

  // Método para adicionar um jogo
  adicionarJogo(jogo) {
    this.jogos.push(jogo);
  }

  // Método para exibir todos os amigos
  exibirAmigos() {
    console.log('Amigos:', this.amigos);
  }

  // Método para exibir todos os comentários
  exibirComentarios() {
    console.log('Comentários:', this.comentarios);
  }

  // Método para exibir todos os jogos
  exibirJogos() {
    console.log('Jogos:', this.jogos);
  }

  getNome() {
    return this.nome;
  }
}