// src/idb.js
import { openDB } from "idb";

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        console.log("IndexedDB setup complete");
      }
    },
  });
}

export async function addNoteOffline(note) {
  const db = await initDB();
  await db.add(STORE_NAME, { ...note, synced: false, createdAt: Date.now() });
}

export async function getAllNotes() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function updateNote(id, updates) {
  const db = await initDB();
  const note = await db.get(STORE_NAME, id);
  if (note) {
    const updated = { ...note, ...updates };
    await db.put(STORE_NAME, updated);
  }
}

export async function getNote(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function deleteNote(id) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const note = await store.get(id);
  if (note) {
    await store.delete(id);
    console.log(`Note ${id} deleted from IndexedDB`);
    await tx.done;
    return true;
  } else {
    console.warn(`Note ${id} not found in IndexedDB`);
    await tx.done;
    return false;
  }
}
