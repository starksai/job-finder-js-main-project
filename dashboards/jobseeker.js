import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged , signOut} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, query, equalTo, orderByChild, get, update, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxvBsuVNvhTSJeE1Z8pWpg2wYhaPLr6Xc",
    authDomain: "job-finder-js-main-project.firebaseapp.com",
    projectId: "job-finder-js-main-project",
    storageBucket: "job-finder-js-main-project.appspot.com",
    messagingSenderId: "45504269940",
    appId: "1:45504269940:web:06855a661768398aee8b21",
    databaseURL: "https://job-finder-js-main-project-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//  auto load jobs in dispaly

async function fetchJobListings() {
    let jobListings = document.getElementById("jobListings");

    try {
        const jobsRef = ref(db, "jobs");
        const snapshot = await get(jobsRef);

        if (snapshot.exists()) {
            const jobs = snapshot.val();
            jobListings.innerHTML = "";

            Object.keys(jobs).forEach((key) => {
                const job = jobs[key];

                const jobCard = `
             <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card h-100 p-3 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${job.title}</h5>
                <p class="card-text"><strong>Company:</strong> ${job.companyName}</p>
                <p class="card-text"><strong>skills:</strong> ${job.skills}</p>
                <p class="card-text"><strong>Location:</strong> ${job.location}</p>
                <p class="card-text"><strong>Experience:</strong> ${job.experience}</p>
                <p class="card-text"><strong>Posted Date:</strong> ${job.postedDate}</p>
                <button class="btn btn-primary mt-auto w-100" onclick="applyJob('${key}')">Apply</button>
              </div>
            </div>
          </div>
            `

                jobListings.innerHTML += jobCard;
            });


        }
        else {
            jobListingsContainer.innerHTML = "<p>No jobs found.</p>";
        }
    }
    catch (err) {
        console.error("Error fetching jobs:", err);
        jobListingsContainer.innerHTML = "<p>Error loading jobs.</p>";

    }
}

// Call function when the page loads
window.onload = fetchJobListings;



// logout

let jobseekerLogoutBtn = document.getElementById("jobseekerLogoutBtn");

jobseekerLogoutBtn.addEventListener("click",()=>{
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
                text: error.message,
                icon: "error"
              });
          });
        }
      });
})