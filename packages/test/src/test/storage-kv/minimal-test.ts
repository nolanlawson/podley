//    *******************************************************************************
//    *   PODLEY.AI: Your Agentic AI library                                        *
//    *                                                                             *
//    *   Copyright Steven Roussey <sroussey@gmail.com>                             *
//    *   Licensed under the Apache License, Version 2.0 (the "License");           *
//    *******************************************************************************

import "fake-indexeddb/auto";
import { uuid4 } from "@podley/util";
import { IndexedDbKvRepository } from "@podley/storage";
import { Type } from "@sinclair/typebox";

const dbName = `idx_test_${uuid4().replace(/-/g, "_")}`;

const repository = new IndexedDbKvRepository(`${dbName}`, Type.String(), Type.Any());

const key = "key1";
const value = "value1";
await repository.put(key, value);
await repository.get(key);

// Clean up after each test
// Close any open connections first
const closeRequest = indexedDB.open(`${dbName}`);
console.log("closing");
await new Promise(resolve => {
  closeRequest.onsuccess = (event) => {
    console.log("closed");
    const db = (event.target as IDBOpenDBRequest).result;
    db.close();
    resolve();
  };
});

// Delete the test databases
console.log("deleting");
await new Promise((resolve, reject) => {
  const req = indexedDB.deleteDatabase(`${dbName}`);
  req.onsuccess = resolve;
  req.onerror = e => reject((e.target as any).error);
  req.onblocked = e => reject((e.target as any).error);
});
