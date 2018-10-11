const admin = require("firebase-admin");

const { getConfig } = require("./lib/utils/getConfig");

admin.initializeApp({ credential });
admin.firestore().settings({ timestampsInSnapshots: true });

const FUNCTION_NAME = process.env.FUNCTION_NAME;

// auth

if (!FUNCTION_NAME || FUNCTION_NAME === "onCreateUser") {
  exports.onCreateUser = require("./lib/auth/onCreateUser");
}

// firestore

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteFile") {
  exports.onDeleteFile = require("./lib/auth/onDeleteFile");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteImage") {
  exports.onDeleteImage = require("./lib/auth/onDeleteImage");
}

// https

// storage

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteStorageObject") {
  exports.onDeleteStorageObject = require("./lib/storage/onDeleteStorageObject");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onFinalizeStorageObject") {
  exports.onFinalizeStorageObject = require("./lib/storage/onFinalizeStorageObject");
}
