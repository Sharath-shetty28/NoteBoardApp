// src/idb.js
import { openDB } from "idb";

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

export async function initDB() {
  return openDB(DB_NAME, 2, {
    // bump version to trigger upgrade
    upgrade(db) {
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME); // drop old broken store
      }
      db.createObjectStore(STORE_NAME, {
        keyPath: "id", // use your Mongo string id
      });
      console.log("IndexedDB setup fixed: string ids supported");
    },
  });
}

export async function addNoteOffline(note) {
  const db = await initDB();
  const id = note.id || crypto.randomUUID();
  const newNote = {
    ...note,
    id,
    synced: false,
    createdAt: Date.now(),
  };

  await db.add(STORE_NAME, newNote);
  return newNote;
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
