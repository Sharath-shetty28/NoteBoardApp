// src/db.js
import Dexie from "dexie";

export const db = new Dexie("NotesDB");
db.version(1).stores({
  notes: "++id,_id,text,synced", // id=local ID, _id=MongoDB ID
});
