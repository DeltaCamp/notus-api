export const notusJsonResponse = (status, data, message): object => {
  return {
    "status": status,
    "data": data,
    "message": message
  }
}
