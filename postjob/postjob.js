// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxvBsuVNvhTSJeE1Z8pWpg2wYhaPLr6Xc",
    authDomain: "job-finder-js-main-project.firebaseapp.com",
    projectId: "job-finder-js-main-project",
    storageBucket: "job-finder-js-main-project.firebasestorage.app",
    messagingSenderId: "45504269940",
    appId: "1:45504269940:web:06855a661768398aee8b21",
    databaseURL: "https://job-finder-js-main-project-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM elements
let postJobBtn = document.getElementById("postJobBtn");

// Event listener for Post Job button
postJobBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get form inputs
    const companyName = document.getElementById("companyName").value.trim();
    const title = document.getElementById("jobTitle").value.trim();
    const description = document.getElementById("jobDescription").value.trim();
    const skills = document.getElementById("jobSkills").value.trim();
    const experience = document.getElementById("jobExperience").value.trim();
    const location = document.getElementById("jobLocation").value.trim();
    const salary = document.getElementById("jobSalary").value.trim();

    let isValid = true;

    // Input validation
    if (companyName === "") {
        document.getElementById("companyNameError").textContent = "Company Name is required.";
        isValid = false;
    } else {
        document.getElementById("companyNameError").textContent = "";
    }

    if (title === "") {
        document.getElementById("jobTitleError").textContent = "Job Title is required.";
        isValid = false;
    } else {
        document.getElementById("jobTitleError").textContent = "";
    }

    if (description === "") {
        document.getElementById("jobDescriptionError").textContent = "Job Description is required.";
        isValid = false;
    } else {
        document.getElementById("jobDescriptionError").textContent = "";
    }

    if (skills === "") {
        document.getElementById("jobSkillsError").textContent = "Skills are required.";
        isValid = false;
    } else {
        document.getElementById("jobSkillsError").textContent = "";
    }

    if (experience === "") {
        document.getElementById("jobExperienceError").textContent = "Experience Level is required.";
        isValid = false;
    } else {
        document.getElementById("jobExperienceError").textContent = "";
    }

    if (location === "") {
        document.getElementById("jobLocationError").textContent = "Location is required.";
        isValid = false;
    } else {
        document.getElementById("jobLocationError").textContent = "";
    }

    if (isValid) {
        try {
            // Get current authenticated user
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const employerId = user.uid;

                    // Prepare job data
                    const jobData = {
                        companyName, // Include company name
                        title,
                        description,
                        skills: skills.split(",").map(skill => skill.trim()), // Split skills into an array
                        experience,
                        location,
                        salary: salary || "Not disclosed", // Default to "Not disclosed" if salary is empty
                        employerId,
                        postedDate: new Date().toISOString(),
                    };

                    // Push job data to Firebase Realtime Database
                    const jobRef = ref(db, "jobs");
                    await push(jobRef, jobData);

                    Swal.fire({
                        title: "Job posted successfully!",
                        icon: "success",
                        draggable: true,
                    }).then(() => {
                        // Redirect to Employer Dashboard
                        window.location.href = "../dashboards/employer.html"; // Update with the actual path of your employer dashboard
                    });

                    // Clear form inputs
                    document.getElementById("companyName").value = "";
                    document.getElementById("jobTitle").value = "";
                    document.getElementById("jobDescription").value = "";
                    document.getElementById("jobSkills").value = "";
                    document.getElementById("jobExperience").value = "";
                    document.getElementById("jobLocation").value = "";
                    document.getElementById("jobSalary").value = "";

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Unauthorized",
                        text: "Please log in to post a job.",
                    });
                }
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    }
});
