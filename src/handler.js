const { nanoid } = require('nanoid');

const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
      };
      notes.push(newNote);


      const isSuccess = notes.filter((note) => note.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.code(500);
      return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});


const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};
 const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    //dapatkan data notes terbaru yang dikirimkan oleh client melalui body request
    const { title, tags, body}   = request.payload;
    //perbaharui nilai dari properti updatedAt dengan menggunakan new Date().toISOString()
    const updatedAt = new Date().toISOString();

    //dapatkan index array pada objek catatan sesuai id yang ditentukan dengan method array findIndex()
    const index = notes.findIndex((note) => note.id === id);

    //bila note dengan id yang dicari ditemukan, maka index akan bernilai array index dari catatan yang dicari. jika tidak index bernilai -1
    if(index !== -1){
      notes[index] = {
        ...notes[index],
        title,
        tags,
        body,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbaharui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

const deleteNoteByIdHandler = (request, h) => {
  //dapatkan nilai id yang dikirim melalui path parameters
  const { id } = request.params;
  //dapatkan index dari objek catatan sesuai dengan id yang didapat
  const index = notes.findIndex((note) => note.id === id);
  //lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1
  if(index !== -1) {
    notes.splice(index, 1);//menghapus data pada array berdasarkan index dengan method array splice()
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  //bila index bernilai -1
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };