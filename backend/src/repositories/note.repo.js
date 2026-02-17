import prisma from "../config/db.js";

export const getAllNotes = (userId, page = 1, limit = 9) => {
  return prisma.note.findMany({
    where: { userId, isDeleted: false },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
};

export const getNoteById = (noteId, userId) => {
  return prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId: Number(userId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const createNote = (data) => {
  return prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      userId: Number(data.userId),
    },
  });
};

export const updateNote = (noteId, userId, data) => {
  return prisma.note.update({
    where: { id: noteId, userId },
    data: {
      ...data,
    },
  });
};

export const deleteNote = (noteId, userId) => {
  return prisma.note.update({
    where: {
      id: Number(noteId),
      userId: Number(userId),
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
