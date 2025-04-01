// Function to open a modal
function openModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden");
  document.getElementById(modalId).classList.add("flex");
}

// Function to close a modal
function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
  document.getElementById(modalId).classList.remove("flex");
}

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
    document.getElementById("themeIcon").textContent = "🌙";
    document.getElementById("themeText").textContent = "Night";
  } else {
    document.body.classList.add("bg-gray-100", "text-gray-900");
    document.getElementById("themeIcon").textContent = "🌞";
    document.getElementById("themeText").textContent = "Day";
  }

  loadReviews(); // Load reviews when page loads
};

// Search for books using Open Library API
function searchBooks() {
  const searchTerm = document.getElementById("searchInput").value;
  if (!searchTerm) return;

  fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=10`)
    .then((response) => response.json())
    .then((data) => {
      const books = data.docs;
      const resultsContainer = document.getElementById("results");
      resultsContainer.innerHTML = ""; // Clear previous results

      if (books.length === 0) {
        resultsContainer.innerHTML =
          "<p class='text-center text-red-500'>No results found.</p>";
        return;
      }

      books.forEach((book) => {
        const bookCover = book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : `https://via.placeholder.com/150`; // Default image if no cover

        resultsContainer.innerHTML += `
          <div class="book p-4 border rounded-lg bg-white">
            <img src="${bookCover}" alt="${
          book.title
        }" class="book-image mb-2 w-full h-64 object-cover">
            <p class="text-center">${book.title}</p>
            <p class="text-center text-sm text-gray-600">${
              book.author_name ? book.author_name[0] : "Unknown Author"
            }</p>
            <button onclick="openReviewModal('${
              book.title
            }')" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg">Leave Review</button>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Open review modal for a specific book
function openReviewModal(bookTitle) {
  document.getElementById("reviewTitle").value = bookTitle;
  openModal("reviewModal");
}

// Submit review
function submitReview() {
  const title = document.getElementById("reviewTitle").value;
  const reviewText = document.getElementById("reviewText").value;
  const rating = document.getElementById("rating").value;

  const review = {
    title: title,
    reviewText: reviewText,
    rating: rating,
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
  reviewsListContainer.innerHTML = ""; // Clear previous reviews

  reviews.forEach((review, index) => {
    reviewsListContainer.innerHTML += `
      <div class="p-4 border rounded-lg ">
        <h3 class="font-semibold">${review.title}</h3>
        <p>${review.reviewText}</p>
        <p class="text-sm">Rating: ${review.rating} ⭐</p>
        <button onclick="deleteReview(${index})" class="mt-2 bg-red-600 font-serif px-4 py-2 rounded-lg">Delete Review</button>
      </div>
    `;
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
