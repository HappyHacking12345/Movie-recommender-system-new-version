import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";
import config from "../config.json";
import Helpers, {jsonFetch} from "../helpers";
const API_URL = "/api/use/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getIsMovieUserFavorite = async (id, userId) => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/user/isfav?userid=${userId}&id=${id}`, {
      method: 'GET',
  })
  return res.json()
}

const getUserAllFavoriteMovies = async (userId) => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/user/myfav?userid=${userId}`, {
      method: 'GET',
  })
  return res.json()
}

const setFavorite = async (id, userId, fav) => {
  var res = await jsonFetch(`http://${config.server_host}:${config.server_port}/user/setfav`, {
      method: 'PUT',
      body: JSON.stringify({
          userId: userId,
          id: id,
          fav: fav,
      })
  })
  return res.json()
}

const UserService = {
  getPublicContent,
  getIsMovieUserFavorite,
  getUserAllFavoriteMovies,
  setFavorite
};

export default UserService; 
