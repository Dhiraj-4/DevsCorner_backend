export const users = new Map(); // userId -> socketId

export function addUser(userId, socketId) {
  users.set(userId.toString(), socketId);
  console.log("added user successfully");
}

export function removeUser(userId) {
  users.delete(userId?.toString());
}

export function getUserSocket(userId) {
  return users.get(userId?.toString());
}

export function getUserNumber() {
  return users.size;
}