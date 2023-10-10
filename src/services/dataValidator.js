export function validateData(data) {
  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Invalid data");
  }
}

export function validateBookId(data) {
  if (typeof data !== "number" || data <= 0) {
    throw new Error("Invalid data");
  }
}
