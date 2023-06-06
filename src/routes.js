const {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHanlder,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksByIdHanlder,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBooksByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBooksByIdHandler,
  },
];

// melakukan exports routes
module.exports = routes;
