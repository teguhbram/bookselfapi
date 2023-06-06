const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const nameIsBlank = name === undefined;
  if (nameIsBlank) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const readPageOverSize = readPage > pageCount;
  if (readPageOverSize) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = res.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  if (name !== undefined) {
    const response = res.response({
      status: 'success',
      data: {
        books: books
          .filter((books) => books.name.toLowerCase().includes(name.toLowerCase()))
          .map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const isReading = reading === '1';
    const response = res.response({
      status: 'success',
      data: {
        books: books
          .filter((books) => books.reading === isReading)
          .map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const isFinish = finished === '1';
    const response = res.response({
      status: 'success',
      data: {
        books: books
          .filter((books) => books.finished === isFinish)
          .map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if ((name, reading, finished === undefined)) {
    const response = res.response({
      status: 'success',
      data: {
        books: books.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBooksByIdHanlder = (req, res) => {
  const { id } = req.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book != undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBooksByIdHandler = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const nameIsBlank = name === undefined;
  const readPageOverSize = readPage > pageCount;

  if (readPageOverSize) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } if (nameIsBlank) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = res.response({
      status: 'success',
      message: 'Berhasil memperbaharui buku',
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku gagal di perbaharui. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = res.response({
      status: 'success',
      message: 'Berhasil menghapus buku',
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHanlder,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
