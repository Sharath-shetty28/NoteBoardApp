import prisma from "../config/db.js";

export const getAllNotes = (userId) => {
  return prisma.note.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
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

export const getNoteById = (noteId, userId) => {
  return prisma.note.findFirst({
    where: { id: noteId, userId },
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

export const deletedNote = (noteId, userId) => {
  return prisma.note.delete({
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
