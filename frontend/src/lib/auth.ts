import api from "../lib/api";

const API = "http://localhost:8080/auth";

export async function registerUser(
  name: string,
  profileName: string,
  email: string,
  password: string
) {
  const response = await api.post(`${API}/cadastro`, {
    name,
    profileName,
    email,
    password
  });

  return response.data;
}

export async function login(email: string, password: string) {

  const response = await api.post("/auth/login", {
    email,
    password
  });

  const token = response.data.token;

  localStorage.setItem("token", token);

  return response.data;
}