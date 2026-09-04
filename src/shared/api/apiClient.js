import axios from 'axios'

export const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// apiClient.interceptors.response.use( // display notification of error.message to user
//     (response) => response,
//     (error) => {
//         if(error.response.status == 401) {
//             //display error.message to user
//         }
//         else if(error.response.status == 404) {
//             //display error.message to user
//         }
//         else if(error.response.status == 500) {
//             //display error.message to user
//         }
//         else if(error.response.status == 502) {
//             //display error.message to user
//         }
//         else if(error.response.status == 503) {
//             //display error.message to user
//         }
//         else if(error.response.status == 504) {
//             //display error.message to user
//         }
//         else {
//             //display error.message to user
//         }
//     }
// )