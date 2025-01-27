// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxvBsuVNvhTSJeE1Z8pWpg2wYhaPLr6Xc",
    authDomain: "job-finder-js-main-project.firebaseapp.com",
    projectId: "job-finder-js-main-project",
    storageBucket: "job-finder-js-main-project.firebasestorage.app",
    messagingSenderId: "45504269940",
    appId: "1:45504269940:web:06855a661768398aee8b21",
    databaseURL: "https://job-finder-js-main-project-default-rtdb.firebaseio.com/" // Add the Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let signInBtn = document.getElementById("signInBtn");

signInBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let isValid = true;

    // Form validation
    if (email === "") {
        document.getElementById("emailError").textContent = "Please enter your email.";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    if (password === "") {
        document.getElementById("passwordError").textContent = "Please enter your password.";
        isValid = false;
    } else {
        document.getElementById("passwordError").textContent = "";
    }

    if (isValid) {
        try {
            // Sign in user with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get user data from Realtime Database
            const usersRef = ref(db, `users`);
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                let foundUser = null;
                snapshot.forEach((childSnapshot) => {
                    let userData = childSnapshot.val();
                    if (userData.email === email) {
                        foundUser = userData;
                    }
                });

                if (foundUser) {
                    if (foundUser.role === "employer") {
                        Swal.fire({
                            title: "Logged in successfully!",
                            icon: "success",
                            draggable: true,
                        });
                        location.href = "../dashboards/employer.html";
                    } else if (foundUser.role === "job_seeker") {
                        Swal.fire({
                            title: "Logged in successfully!",
                            icon: "success",
                            draggable: true,
                        });
                        location.href = "../dashboards/jobseeker.html";
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "No valid role found. Please contact support.",
                        });
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "User not found in the database.",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "No users found in the database.",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: err.message,
            });
        }
    }
});
