const BaseService = require("./base.service");
let _commentRepository = null;
let _ideaRepository = null;

class CommentService extends BaseService {
  constructor({ CommentRepository, IdeaRepository }) {
    super(CommentRepository);
    _commentRepository = CommentRepository;
    _ideaRepository = IdeaRepository;
  }

  async getIdeaComments(ideaID) {
    if (!ideaID) {
      const error = new Error();
      error.status = 400;
      error.message = "Debes mandar una ideaID";
      throw error;
    }
    const idea = await _ideaRepository.get(ideaID);

    if (!idea) {
      const error = new Error();
      error.status = 404;
      error.message = "La idea no existe";
      throw error;
    }
    // desestructuramos los comentarios
    const { comments } = idea;
    return comments;
  }

  async createCommet(comment, ideaID) {
    if (!ideaID) {
      const error = new Error();
      error.status = 400;
      error.message = "Debes mandar una ideaID";
      throw error;
    }

    const idea = await _ideaRepository.get(ideaID);

    if (!idea) {
      const error = new Error();
      error.status = 404;
      error.message = "La idea no existe";
      throw error;
    }

    const createComment = await _commentRepository.create(comment);
    // las ideas pueden tener varios comentarios
    idea.comments.push(createComment);
    // actualizamos la bbdd
    return await _ideaRepository.update(ideaID, { comments: idea.comments });
  }
}

module.exports = CommentService;
