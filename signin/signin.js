// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxvBsuVNvhTSJeE1Z8pWpg2wYhaPLr6Xc",
    authDomain: "job-finder-js-main-project.firebaseapp.com",
    projectId: "job-finder-js-main-project",
    storageBucket: "job-finder-js-main-project.firebasestorage.app",
    messagingSenderId: "45504269940",
    appId: "1:45504269940:web:06855a661768398aee8b21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Optional: Add form validation and handling logic here
let signInBtn = document.getElementById("signInBtn");

signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let isValid = true;



    if (email === "") {
        document.getElementById('emailError').textContent = 'Please enter your email.';
        isValid = false;
    }
    else {
        document.getElementById('emailError').textContent = '';

    }

    if (password === "") {
        document.getElementById('passwordError').textContent = 'Please enter your password.';
        isValid = false;
    }
    else {
        document.getElementById('passwordError').textContent = '';

    }

    if (isValid) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = userData.role;

                if (userRole === "employer") {
                    Swal.fire({
                        title: "logged in successfull!",
                        icon: "success",
                        draggable: true
                    });
                    location.href = "../dashboards/employer.html"
                } else if (userRole === "job_seeker") {
                    Swal.fire({
                        title: "logged in successfull!",
                        icon: "success",
                        draggable: true
                    });
                    location.href = "../dashboards/jobseeker.html"
                } else {
                    // alert("no role found plz contact support");
                    Swal.fire({
                        icon: "error",
                        title: "no role found plz contact support",
                        text: err.message,
                        footer: '<a href="#">Why do I have this issue?</a>'
                    });
                    
                }
            } else {
                // alert("no user found");
                Swal.fire({
                    icon: "error",
                    title: "no user found",
                    text: err.message,
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
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