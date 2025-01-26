document.addEventListener("DOMContentLoaded", () => {
    const firebaseConfig = {
      apiKey: "AIzaSyCV4duVE6tOXiw3LJIJjtbb7UUagBucSuQ",
      authDomain: "job-finder-js-project.firebaseapp.com",
      projectId: "job-finder-js-project",
      storageBucket: "job-finder-js-project.firebasestorage.app",
      messagingSenderId: "799117766093",
      appId: "1:799117766093:web:cf0598cfca59210776a884"
    };
  
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();
  
    const signupSubmitBtn = document.getElementById("signupSubmitBtn");
  
    if (!signupSubmitBtn) {
      console.error("Button with id 'signupSubmitBtn' not found.");
      return;
    }
  
    signupSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const role = document.getElementById("role").value;
  
      // Debug logs
      console.log("Name:", name, "Email:", email, "Role:", role);
  
      let isValid = true;
  
      // Name validation
      if (!name) {
        document.getElementById("nameError").textContent = "Name field is required";
        isValid = false;
      } else if (name.length < 3) {
        document.getElementById("nameError").textContent = "Name must be at least 3 characters";
        isValid = false;
      } else {
        document.getElementById("nameError").textContent = "";
      }
  
      // Email validation
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!email) {
        document.getElementById("emailError").textContent = "Email field is required";
        isValid = false;
      } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Email is not valid";
        isValid = false;
      } else {
        document.getElementById("emailError").textContent = "";
      }
  
      // Password validation
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!password) {
        document.getElementById("passwordError").textContent = "Password field is required";
        isValid = false;
      } else if (!passwordPattern.test(password)) {
        document.getElementById("passwordError").textContent =
          "Password must contain at least one number, one lowercase, one uppercase, and be 6-20 characters.";
        isValid = false;
      } else {
        document.getElementById("passwordError").textContent = "";
      }
  
      // Confirm password validation
      if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
        isValid = false;
      } else {
        document.getElementById("confirmPasswordError").textContent = "";
      }
  
      // Role validation
      if (!role) {
        document.getElementById("roleError").textContent = "Please select a role";
        isValid = false;
      } else {
        document.getElementById("roleError").textContent = "";
      }
  
      // Submit if valid
      if (isValid) {
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
  
            return database.ref("users/" + user.uid).set({
              name: name,
              email: email,
              role: role
            });
          })
          .then(() => {
            alert("Account created successfully! Please log in to continue.");
            window.location.href = "../signin/signin.html";
          })
          .catch((error) => {
            console.error("Error during signup:", error.message);
            alert(error.message);
          });
      }
    });
  });
  