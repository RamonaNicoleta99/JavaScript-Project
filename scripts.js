// Functie de deschidere a modalului
function openModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden");
}

// Functie de închidere a modalului
function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}

// Functie pentru actualizarea UI-ului in functie de autentificare
function updateUI() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Dacă există un utilizator autentificat
  if (currentUser) {
    // Ascundem butoanele de Log In și Sign Up
    document.getElementById("loginButton").classList.add("hidden");
    document.getElementById("signUpButton").classList.add("hidden");

    // Afișăm butonul de Log Out
    document.getElementById("logoutButton").classList.remove("hidden");
  } else {
    // Dacă nu există utilizator autentificat, ascundem butonul de Log Out
    document.getElementById("logoutButton").classList.add("hidden");

    // Afișăm butoanele de Log In și Sign Up
    document.getElementById("loginButton").classList.remove("hidden");
    document.getElementById("signUpButton").classList.remove("hidden");
  }
  loadReviews();
}

// Funcție de logout
function logoutUser() {
  // Eliminăm utilizatorul din localStorage (deconectăm utilizatorul)
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");

  // Actualizăm UI-ul pentru a reflecta starea de deconectare
  updateUI();
}

// Funcție pentru logare
document
  .getElementById("loginForm")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Verificăm dacă există un utilizator cu acest email și parolă
    const storedUser = JSON.parse(localStorage.getItem("users")) || [];

    const user = storedUser.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Salvăm utilizatorul în localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Logged in successfully!");
      closeModal("loginModal");
      updateUI();
    } else {
      alert("Invalid email or password");
    }
  });

// Funcție pentru înregistrare
document
  .getElementById("signUpForm")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;

    // Verificăm dacă există deja un utilizator cu acest email
    const storedUser = JSON.parse(localStorage.getItem("users")) || [];

    if (storedUser.find((u) => u.email === email)) {
      alert("Email already taken");
    } else {
      const newUser = { email, password };

      // Salvăm utilizatorul în localStorage
      storedUser.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUser));

      alert("Account created successfully!");
      closeModal("signUpModal");
    }
  });

// Apelăm updateUI pentru a verifica dacă utilizatorul este autentificat la încărcarea paginii
window.onload = updateUI;
// Theme Toggle Function
function toggleTheme() {
  let isDay = document.body.classList.contains("bg-gray-100");

  if (isDay) {
    document.body.classList.remove("bg-gray-100", "text-gray-900");
    document.body.classList.add("bg-gray-900", "text-white");
    document.getElementById("themeIcon").textContent = "🌚";
    document.getElementById("themeText").textContent = "Night";
    localStorage.setItem("theme", "night");
  } else {
    document.body.classList.remove("bg-gray-900", "text-white");
    document.body.classList.add("bg-gray-100", "text-gray-900");
    document.getElementById("themeIcon").textContent = "🌞";
    document.getElementById("themeText").textContent = "Day";
    localStorage.setItem("theme", "day");
  }
}

// Load saved theme from localStorage on page load
window.onload = function () {
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme === "night") {
    document.body.classList.add("bg-gray-900", "text-white");
    document.getElementById("themeIcon").textContent = "🌚";
    document.getElementById("themeText").textContent = "Night";
  } else {
    document.body.classList.add("bg-gray-100", "text-gray-900");
    document.getElementById("themeIcon").textContent = "🌞";
    document.getElementById("themeText").textContent = "Day";
  }

  loadReviews(); // Load reviews when page loads
};

function sortBooks() {
  const sortOption = document.getElementById("sortSelect").value;
  if (sortOption === "title") {
    books.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "author") {
    // Verifică dacă există autor și sortează
    books.sort((a, b) => {
      const authorA = a.author_name ? a.author_name[0] : "";
      const authorB = b.author_name ? b.author_name[0] : "";
      return authorA.localeCompare(authorB);
    });
  } else if (sortOption === "year") {
    books.sort(
      (a, b) => (a.first_publish_year || 0) - (b.first_publish_year || 0)
    );
  }
  loadBooks();
}

function loadBooks() {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Curăță rezultatele anterioare

  books.forEach((book) => {
    const bookCover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : `https://via.placeholder.com/150;`; // Imagine implicită

    resultsContainer.innerHTML += `
      <div class="book p-4 border rounded-lg bg-white">
        <img src="${bookCover}" alt="${
      book.title
    }" class="book-image mb-2 w-full h-64 object-cover">
        <p class="text-center">${book.title}</p>
        <p class="text-center text-sm text-gray-600">${
          book.author_name ? book.author_name[0] : "Unknown Author"
        }</p>
        <p class="text-center text-xs text-gray-500">
        Published: ${book.first_publish_year || "N/A"}
        </p>
        <button onclick="openReviewModal('${
          book.title
        }')" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg">Leave Review</button>
      </div>
    `;
    document.getElementById("loadingContainer").classList.add("hidden");
  });
}

function searchBooks() {
  const searchTerm = document.getElementById("searchInput").value;
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Curăță rezultatele anterioare
  document.getElementById("loadingContainer").classList.remove("hidden");

  if (!searchTerm) return;

  fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=10`)
    .then((response) => response.json())
    .then((data) => {
      books = data.docs;
      // Verifică dacă sunt rezultate
      if (books.length === 0) {
        resultsContainer.innerHTML =
          "<p class='text-center text-red-500'>No results found.</p>";
        document.getElementById("loadingContainer").classList.add("hidden");
        return;
      }
      // Sortează rezultatele local după titlu sau autor
      sortBooks();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Open review modal for a specific book
function openReviewModal(bookTitle) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("reviewTitle").value = bookTitle;
    openModal("reviewModal");
  } else openModal("warningModal");
}

// Submit review
function submitReview() {
  const title = document.getElementById("reviewTitle").value;
  const reviewText = document.getElementById("reviewText").value;
  const rating = document.getElementById("rating").value;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const review = {
    title: title,
    reviewText: reviewText,
    rating: rating,
    user: currentUser.email,
  };

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));

  alert("Review submitted successfully!");
  closeModal("reviewModal");
  loadReviews(); // Reload reviews after submission
}

// Load reviews from localStorage
function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const reviewsListContainer = document.getElementById("reviewsList");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  reviewsListContainer.innerHTML = ""; // Clear previous reviews

  reviews.forEach((review, index) => {
    reviewsListContainer.innerHTML += `
      <div class="p-4 border rounded-lg ">
      <h3 class="font-semibold">User: ${review.user}</h3>
        <h3 class="font-semibold">${review.title}</h3>
        <p>${review.reviewText}</p>
        <p class="text-sm">Rating: ${review.rating} ⭐</p>
    `;
    if (currentUser.email === review.user) {
      reviewsListContainer.innerHTML += `  <button onclick="deleteReview(${index})" class="mt-2 bg-red-600 font-serif px-4 py-2 rounded-lg">Delete Review</button>`;
    }
    reviewsListContainer.innerHTML += `</div>`;
  });
}

// Delete review
function deleteReview(index) {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.splice(index, 1); // Remove the review at the specified index
  localStorage.setItem("reviews", JSON.stringify(reviews));
  loadReviews(); // Reload the reviews after deletion
}

// Carousel

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("carousel");
  const items = document.querySelectorAll(".carousel-item");
  const itemWidth = items[0].offsetWidth + 16; //
  let scrollAmount = 0;
  const scrollStep = itemWidth;
  const totalScroll = (items.length + 1) * itemWidth - carousel.offsetWidth;
  let autoScroll;

  function moveCarousel(direction) {
    if (direction === "next") {
      scrollAmount += scrollStep;
      if (scrollAmount > totalScroll) {
        scrollAmount = 0;
      }
    } else {
      scrollAmount -= scrollStep;
      if (scrollAmount < 0) {
        scrollAmount = totalScroll;
      }
    }
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
  }

  document.getElementById("nextBtn").addEventListener("click", function () {
    moveCarousel("next");
  });

  document.getElementById("prevBtn").addEventListener("click", function () {
    moveCarousel("prev");
  });

  document
    .getElementById("warningLoginButton")
    .addEventListener("click", function () {
      closeModal("warningModal");
    });

  document
    .getElementById("warningSignUpButton")
    .addEventListener("click", function () {
      closeModal("warningModal");
    });

  function startAutoScroll() {
    autoScroll = setInterval(() => moveCarousel("next"), 3000);
  }

  function stopAutoScroll() {
    clearInterval(autoScroll);
  }

  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);

  startAutoScroll();
});

function scrollToSection(event, sectionId) {
  event.preventDefault();
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}
