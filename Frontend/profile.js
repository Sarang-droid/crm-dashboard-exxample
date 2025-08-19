// Elements
const editBtn = document.getElementById("edit-profile-btn");
const editForm = document.getElementById("edit-profile-form");
const cancelBtn = document.getElementById("cancel-edit");
const profileForm = document.getElementById("profile-form");

const profileName = document.getElementById("profile-name");
const profileRole = document.getElementById("profile-role");
const profileEmail = document.getElementById("profile-email");

// Show Edit Form
editBtn.addEventListener("click", () => {
  editForm.style.display = "block";
});

// Hide Edit Form
cancelBtn.addEventListener("click", () => {
  editForm.style.display = "none";
});

// Save Profile Data
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newName = document.getElementById("name").value;
  const newRole = document.getElementById("role").value;
  const newEmail = document.getElementById("email").value;

  profileName.textContent = newName;
  profileRole.textContent = newRole;
  profileEmail.textContent = newEmail;

  editForm.style.display = "none";
  alert("Profile updated successfully!");
});
