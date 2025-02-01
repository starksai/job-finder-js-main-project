import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, query, equalTo, orderByChild, get, update, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";



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
const db = getDatabase(app);


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

onAuthStateChanged(auth, (user) => {
  if (user) {
      let employerId = user.uid;
      // console.log(employerId);
      

      // Get all job posts by this employer
      const jobPostsRef = ref(db, 'jobs/');
      get(jobPostsRef).then((snapshot) => {
          if (snapshot.exists()) {
              const jobs = snapshot.val();
              for (let jobId in jobs) {
                  if (jobs[jobId].employerId === employerId) {
                      // For each job, fetch applications
                      // console.log(jobId);
                      
                      fetchApplicationsForJob(jobId);
                  }
              }
          } else {
              console.log("No jobs found");
          }
      }).catch((error) => {
          console.error(error);
      });
  } else {
      window.location.href = "../signin/signin.html";
  }
});

// Fetch applications for a specific job
function fetchApplicationsForJob(jobId) {
  const applicationsRef = ref(db, 'applications/' + jobId);
  get(applicationsRef).then((snapshot) => {
      const applicationsTable = document.getElementById("applicationsTable");

      
      if (snapshot.exists()) {
          const applications = snapshot.val();
          // console.log(applications);
          
          for (let applicationId in applications) {
              const application = applications[applicationId];
              console.log(application);
              
              // Append each application to the table
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${application.candidateName}</td>
                  <td><a href="${application.resumeLink}" target="_blank">View Resume</a></td>
                  <td><span class="badge bg-${getStatusClass(application.status)}">${application.status}</span></td>
                  <td>
                      <button class="btn btn-warning btn-sm" onclick="updateApplicationStatus('${jobId}', '${applicationId}', 'Under Review')">Review</button>
                      <button class="btn btn-success btn-sm" onclick="updateApplicationStatus('${jobId}', '${applicationId}', 'Shortlisted')">Shortlist</button>
                      <button class="btn btn-danger btn-sm" onclick="updateApplicationStatus('${jobId}', '${applicationId}', 'Rejected')">Reject</button>
                  </td>
              `;
              applicationsTable.appendChild(row);
          }
      } else {
          console.log("No applications found");
      }
  }).catch((error) => {
      console.error(error);
  });
}


// Helper function to get the class for the application status
function getStatusClass(status) {
  switch (status) {
      case 'New':
          return 'info';
      case 'Under Review':
          return 'warning';
      case 'Shortlisted':
          return 'success';
      case 'Rejected':
          return 'danger';
      default:
          return 'secondary';
  }
}

// Update application status in Firebase
function updateApplicationStatus(jobId, applicationId, newStatus) {
  const applicationRef = ref(database, 'applications/' + jobId + '/' + applicationId);
  update(applicationRef, {
      status: newStatus
  }).then(() => {
      Swal.fire({
          title: "Success!",
          text: "Application status updated.",
          icon: "success"
      }).then(() => {
          location.reload();
      });
  }).catch((error) => {
      Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error"
      });
  });
}