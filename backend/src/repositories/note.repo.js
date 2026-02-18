import prisma from "../config/db.js";
import { generateTags } from "../utils/generateTag.js";
import { redis } from "../lib/cache.js";

export const getAllNotes = async (userId, page = 1, limit = 9) => {
  const cacheKey = `notes:${userId}:page:${page}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return cached;
  }
  const notes = await prisma.note.findMany({
    where: { userId, isDeleted: false },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      createdAt: true,
    },
  });
  await redis.set(cacheKey, notes, { ex: 60 });
  return notes;
};

export const getNoteById = (noteId, userId) => {
  return prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId: Number(userId),
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
};

export const createNote = async (data) => {
  const tags = await generateTags(data.title, data.content);
  return prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      userId: Number(data.userId),
      tags,
    },
  });
};

export const updateNote = async (noteId, userId, data) => {
  const tags = await generateTags(data.title, data.content);
  return prisma.note.update({
    where: { id: noteId, userId },
    data: {
      ...data,
      tags,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
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

export const searchTag = (userId, tag) => {
  return prisma.note.findMany({
    where: {
      userId: Number(userId),
      tags: {
        some: {
          name: {
            contains: tag,
            mode: "insensitive",
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
};
