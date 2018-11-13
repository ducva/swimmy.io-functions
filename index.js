const admin = require("firebase-admin");

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

const FUNCTION_NAME = process.env.FUNCTION_NAME;

// auth

if (!FUNCTION_NAME || FUNCTION_NAME === "onCreateUser") {
  exports.onCreateUser = require("./lib/auth/onCreateUser");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteUser") {
  exports.onDeleteUser = require("./lib/auth/onDeleteUser");
}

// firestore

if (!FUNCTION_NAME || FUNCTION_NAME === "onCreatePost") {
  exports.onCreatePost = require("./lib/firestore/onCreatePost");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteFile") {
  exports.onDeleteFile = require("./lib/firestore/onDeleteFile");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteImage") {
  exports.onDeleteImage = require("./lib/firestore/onDeleteImage");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeletePost") {
  exports.onDeletePost = require("./lib/firestore/onDeletePost");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onUpdatePost") {
  exports.onUpdatePost = require("./lib/firestore/onUpdatePost");
}

// https

if (!FUNCTION_NAME || FUNCTION_NAME === "createChangelog") {
  exports.createChangelog = require("./lib/https/createChangelog");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "createPost") {
  exports.createPost = require("./lib/https/createPost");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "createPostLike") {
  exports.createPostLike = require("./lib/https/createPostLike");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "deletePost") {
  exports.deletePost = require("./lib/https/deletePost");
}

// storage

if (!FUNCTION_NAME || FUNCTION_NAME === "onDeleteStorageObject") {
  exports.onDeleteStorageObject = require("./lib/storage/onDeleteStorageObject");
}

if (!FUNCTION_NAME || FUNCTION_NAME === "onFinalizeStorageObject") {
  exports.onFinalizeStorageObject = require("./lib/storage/onFinalizeStorageObject");
}
