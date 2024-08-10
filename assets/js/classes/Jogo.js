class Jogo {
  constructor(id, nome, foto, descricao, faixaEtaria, responsavel, comentarios = []) {
    this.id = id;
    this.nome = nome;
    this.foto = foto;
    this.descricao = descricao;
    this.faixaEtaria = faixaEtaria;
    this.comentarios = comentarios;
    this.upVotes = 0;
    this.downVotes = 0;
    this.mediaVotes = 0;
    this.responsavel = responsavel;
  }

  adicionarComentario(usuario, comentario) {
    this.comentarios.push({ usuario, comentario });
  }

  removerComentario(indice) {
    if (indice >= 0 && indice < this.comentarios.length) {
      this.comentarios.splice(indice, 1);
    } else {
      console.error('Índice de comentário inválido');
    }
  }

  atualizarDescricao(novaDescricao) {
    this.descricao = novaDescricao;
  }

  adicionarVoto(voto) {
    if (voto === 'up') {
      this.upVotes++;
    } else if (voto === 'down') {
      this.downVotes++;
    } else {
      console.error('Voto inválido');
    }
    this.atualizarMediaVotes();
  }

  atualizarMediaVotes() {
    const totalVotes = this.upVotes + this.downVotes;
    if (totalVotes > 0) {
      this.mediaVotes = (this.upVotes / totalVotes) * 100; // Média em porcentagem
    } else {
      this.mediaVotes = 0;
    }
  }

  salvarNoLocalStorage() {
    localStorage.setItem(`jogo_${this.id}`, JSON.stringify(this));
  }

  static recuperarDoLocalStorage(id) {
    const jogoString = localStorage.getItem(`jogo_${id}`);
    if (jogoString) {
      const dados = JSON.parse(jogoString);
      return new Jogo(dados.id, dados.nome, dados.foto, dados.descricao, dados.faixaEtaria, dados.responsável, dados.comentarios);
    }
    return null;
  }
}
