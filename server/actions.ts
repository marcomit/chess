export async function searchUsers(formData: FormData) {
  "use server"
  const username = formData.get("search")
  if (!username) {
    return;
  }
}