// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxvBsuVNvhTSJeE1Z8pWpg2wYhaPLr6Xc",
    authDomain: "job-finder-js-main-project.firebaseapp.com",
    projectId: "job-finder-js-main-project",
    storageBucket: "job-finder-js-main-project.firebasestorage.app",
    messagingSenderId: "45504269940",
    appId: "1:45504269940:web:06855a661768398aee8b21",
    databaseURL: "https://job-finder-js-main-project-default-rtdb.firebaseio.com/" // Add the Realtime Database URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let createAccBtn = document.getElementById("createAccBtn");

createAccBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let role = document.getElementById("role").value;

    let isValid = true;

    if (name === "") {
        document.getElementById("nameError").textContent = "Name is required";
        isValid = false;
    } else if (name.length < 3) {
        document.getElementById("nameError").textContent = "Name must be more than three characters";
        isValid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
        document.getElementById("emailError").textContent = "Email is required";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Invalid email";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (password === "") {
        document.getElementById("passwordError").textContent = "Password is required";
        isValid = false;
    } else if (!passwordPattern.test(password)) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters, contain a letter, a number, and a special character.";
        isValid = false;
    } else {
        document.getElementById("passwordError").textContent = "";
    }

    if (confirmPassword !== password) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
        isValid = false;
    } else {
        document.getElementById("confirmPasswordError").textContent = "";
    }

    if (isValid) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data in Realtime Database
            await set(ref(db, `users/${name}`), {
                uid: user.uid,
                name: name,
                email: email,
                role: role,
                createdAt: new Date().toISOString(),
            });
            

            Swal.fire({
                title: "Signup successful!",
                icon: "success",
                draggable: true
            });

            // Clear the form
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirmPassword").value = "";
            document.getElementById("role").value = "";

            // Redirect after success
            setTimeout(() => {
                location.href = "../signin/signin.html";
            }, 1500);

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.message,
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
    }
});
