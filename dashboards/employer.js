import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAxvBsuVNvhTSJeE1Z8pWpg2wYhaPLr6Xc",
    authDomain: "job-finder-js-main-project.firebaseapp.com",
    projectId: "job-finder-js-main-project",
    storageBucket: "job-finder-js-main-project.firebasestorage.app",
    messagingSenderId: "45504269940",
    appId: "1:45504269940:web:06855a661768398aee8b21",
    databaseURL: "https://job-finder-js-main-project-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// profile feature

let profileBtn = document.getElementById("profileBtn");

profileBtn.addEventListener("click",()=>{
  Swal.fire({
    title: "Coming Soon!",
    text: "This feature is under development. Stay tuned!",
    icon: "info",
    confirmButtonText: "OK"
});
})

// logout feature
let employerLogoutBtn = document.getElementById("employerLogoutBtn");

employerLogoutBtn.addEventListener("click",()=>{
    Swal.fire({
        title: "Are you sure?",
        text: "You want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          signOut(auth)
          .then(()=>{
            Swal.fire({
                title: "Logged Out!",
                text: "You have been successfully logged out.",
                icon: "success"
              }).then(()=>{
                window.location.href = "../signin/signin.html"
              });
          })
          .catch((err)=>{
            Swal.fire({
                title: "Error!",
                text: err.message,
                icon: "error"
              });
          });
        }
      });
})