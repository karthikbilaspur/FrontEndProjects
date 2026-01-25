// Constants
const TOAST_DURATION = 5000; // milliseconds
const TOAST_ANIMATION_DURATION = 3; // seconds
const ICON = {
  success: '<span class="material-symbols-outlined">task_alt</span>',
  danger: '<span class="material-symbols-outlined">error</span>',
  warning: '<span class="material-symbols-outlined">warning</span>',
  info: '<span class="material-symbols-outlined">info</span>',
};

// Get DOM elements
const urlInput = document.getElementById("urlInput");
const addBookmarkButton = document.getElementById("addBookmark");
const deleteAllButton = document.getElementById("deleteAll");
const bookmarkList = document.getElementById("bookmarkList");

// Function to validate URLs
function isValidURL(url) {
  // Check if URL is valid
  const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
  return pattern.test(url);
}

// Function to show toast notification
function showToast(message, toastType, duration = TOAST_DURATION) {
  // Check if toastType is valid
  if (!Object.keys(ICON).includes(toastType)) toastType = "info";

  // Create toast element
  const box = document.createElement("div");
  box.classList.add("toast", `toast-${toastType}`);
  box.setAttribute("role", "alert");
  box.setAttribute("aria-live", "assertive");
  box.innerHTML = ` <div class="toast-content-wrapper">
    <div class="toast-icon">
      ${ICON[toastType]}
    </div>
    <div class="toast-message">${message}</div>
    <div class="toast-progress"></div>
  </div>`;
  box.querySelector(".toast-progress").style.animationDuration = `${TOAST_ANIMATION_DURATION}s`;

  // Remove existing toast
  const toastAlready = document.body.querySelector(".toast");
  if (toastAlready) {
    toastAlready.remove();
  }

  // Add toast to body
  document.body.appendChild(box);

  // Remove toast after duration
  setTimeout(() => {
    box.remove();
  }, duration);
}

// Event listener for adding a bookmark
addBookmarkButton.addEventListener("click", async () => {
  try {
    // Get URL from input
    const url = urlInput.value.trim();
    if (!isValidURL(url)) {
      showToast("Please enter a valid URL (http:// or https://).", "danger");
      return;
    }

    // Check if URL is reachable
    const response = await fetch(url);
    if (!response.ok) {
      showToast(`Failed to add bookmark: ${response.statusText}`, "danger");
      return;
    }

    // Create bookmark element
    const bookmarkItem = document.createElement("li");
    bookmarkItem.classList.add("bookmark-item");
    bookmarkItem.innerHTML = `<a href="${url}" target="_blank">${url}</a>
      <div class="buttons">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>`;
    bookmarkList.appendChild(bookmarkItem);
    urlInput.value = "";
    addEditBookmarkListener(bookmarkItem);
    addDeleteBookmarkListener(bookmarkItem);
    showToast("Bookmark added successfully", "success");
  } catch (error) {
    showToast(`Error adding bookmark: ${error.message}`, "danger");
  }
});

// Event listener for deleting all bookmarks
deleteAllButton.addEventListener("click", () => {
  while (bookmarkList.firstChild) {
    bookmarkList.removeChild(bookmarkList.firstChild)
  }
  showToast("All bookmarks deleted", "info");
});

// Event listener for editing bookmarks
function addEditBookmarkListener(bookmarkItem) {
  const editButton = bookmarkItem.querySelector(".edit");
  const bookmarkLink = bookmarkItem.querySelector("a");

  editButton.addEventListener("click", async () => {
    try {
      const newURL = prompt("Edit the URL:", bookmarkLink.getAttribute("href"));
      if (!newURL || !isValidURL(newURL)) {
        showToast("Please enter a valid URL (http:// or https://).", "danger");
        return;
      }

      // Check if URL is reachable
      const response = await fetch(newURL);
      if (!response.ok) {
        showToast(`Failed to update bookmark: ${response.statusText}`, "danger");
        return;
      }

      bookmarkLink.setAttribute("href", newURL);
      bookmarkLink.innerHTML = newURL;
      showToast("Bookmark updated successfully", "success");
    } catch (error) {
      showToast(`Error updating bookmark: ${error.message}`, "danger");
    }
  });
}

// Event listener for deleting a bookmark
function addDeleteBookmarkListener(bookmarkItem) {
  const deleteButton = bookmarkItem.querySelector(".delete");
  deleteButton.addEventListener("click", () => {
    bookmarkItem.remove();
    showToast("Bookmark deleted", "info");
  });
}

// Event listeners for toast buttons
document.querySelector(".custom-toast.success-toast").addEventListener("click", () => {
  showToast("Article Submitted Successfully", "success");
});
document.querySelector(".custom-toast.success-toast").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    showToast("Article Submitted Successfully", "success");
  }
});

document.querySelector(".custom-toast.danger-toast").addEventListener("click", () => {
  showToast("Failed unexpected error", "danger");
});
document.querySelector(".custom-toast.danger-toast").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    showToast("Failed unexpected error", "danger");
  }
});

document.querySelector(".custom-toast.info-toast").addEventListener("click", () => {
  showToast("Do POTD and Earn Coins", "info");
});
document.querySelector(".custom-toast.info-toast").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    showToast("Do POTD and Earn Coins", "info");
  }
});

document.querySelector(".custom-toast.warning-toast").addEventListener("click", () => {
  showToast("!warning! server error", "warning");
});
document.querySelector(".custom-toast.warning-toast").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    showToast("!warning! server error", "warning");
  }
});