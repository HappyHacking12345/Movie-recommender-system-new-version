import axios from "axios";
import config from "../config.json";

// const API_URL = "/api/auth/";
const API_URL = "http://localhost:8080/api/auth/"

const register = (username, email, password) => {
  return axios.post(API_URL + "register", { username, email, password });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", { username, password })
    .then((response) => {
      if (response.data.sessionId) {
          let user = {
              'displayName': response.data.displayName,
              'sessionId': response.data.sessionId,
              'userId': response.data.userId,
              'gg': 0
          }
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data;
    });
};
const checkEmailExist = (email) => {
    return axios
        .post(API_URL + "checkEmailExist", { email })
        .then((response) => {
            return response.data.message;
        });
};
const checkUsernameExist = (username) => {
    return axios
        .post(API_URL + "checkUsernameExist", { username })
        .then((response) => {
            return response.data.message;
        });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
    checkEmailExist,
    checkUsernameExist
};

export default AuthService; 