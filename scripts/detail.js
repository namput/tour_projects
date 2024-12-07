let currentSlide = 0;

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "data/api.json";
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ไม่มี ID ใน URL");
    return;
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const place = data.find((p) => p.id === id);

      if (!place) {
        alert("ไม่พบข้อมูลสถานที่");
        return;
      }

      displayPlaceDetails(place);
    })
    .catch((error) => console.error("เกิดข้อผิดพลาด:", error));
});

function displayPlaceDetails(place) {
  const slides = document.getElementById("slides");
  place.additionalImages.forEach((image, index) => {
    const img = document.createElement("img");
    img.src = image;
    img.alt = `${place.name} - รูป ${index + 1}`;
    img.style.display = index === 0 ? "block" : "none";
    slides.appendChild(img);
  });

  const details = document.getElementById("details");
  details.innerHTML = `
    <h2>${place.name}</h2>
    <p>${place.description}</p>
  `;

  loadReviews(place.id);
}

function prevSlide() {
  const slides = document.querySelectorAll("#slides img");
  slides[currentSlide].style.display = "none";
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  slides[currentSlide].style.display = "block";
}

function nextSlide() {
  const slides = document.querySelectorAll("#slides img");
  slides[currentSlide].style.display = "none";
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].style.display = "block";
}

function loadReviews(placeId) {
  const reviews = JSON.parse(localStorage.getItem(`reviews-${placeId}`)) || [];
  const reviewList = document.getElementById("review-list");
  reviewList.innerHTML = "";

  reviews.forEach((review, index) => {
    const div = document.createElement("div");
    div.classList.add("review-card");
    div.innerHTML = `
      <p><strong>${review.user}</strong></p>
      <p>${review.comment}</p>
      <p>คะแนน: ${review.rating} ดาว</p>
      <button onclick="editReview('${placeId}', ${index})">แก้ไข</button>
      <button onclick="deleteReview('${placeId}', ${index})">ลบ</button>
    `;
    reviewList.appendChild(div);
  });
}

function addReview() {
  const name = document.getElementById("reviewer-name").value.trim();
  const comment = document.getElementById("review-comment").value.trim();
  const rating = document.getElementById("review-rating").value;

  if (!name || !comment) {
    alert("กรุณากรอกชื่อและความคิดเห็น");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const reviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
  reviews.push({ user: name, comment, rating });
  localStorage.setItem(`reviews-${id}`, JSON.stringify(reviews));

  loadReviews(id);
  clearReviewForm();
}

function editReview(placeId, index) {
  const reviews = JSON.parse(localStorage.getItem(`reviews-${placeId}`)) || [];
  const review = reviews[index];

  // เติมข้อมูลในฟอร์ม
  document.getElementById("reviewer-name").value = review.user;
  document.getElementById("review-comment").value = review.comment;
  document.getElementById("review-rating").value = review.rating;

  // เมื่อกดส่ง ให้แก้ไขรีวิวแทนการเพิ่มใหม่
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "บันทึกการแก้ไข";
  submitBtn.onclick = () => saveReview(placeId, index);
}

function saveReview(placeId, index) {
  const name = document.getElementById("reviewer-name").value.trim();
  const comment = document.getElementById("review-comment").value.trim();
  const rating = document.getElementById("review-rating").value;

  if (!name || !comment) {
    alert("กรุณากรอกชื่อและความคิดเห็น");
    return;
  }

  const reviews = JSON.parse(localStorage.getItem(`reviews-${placeId}`)) || [];
  reviews[index] = { user: name, comment, rating };
  localStorage.setItem(`reviews-${placeId}`, JSON.stringify(reviews));

  loadReviews(placeId);
  clearReviewForm();

  // เปลี่ยนปุ่มกลับเป็น "ส่งรีวิว"
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "ส่งรีวิว";
  submitBtn.onclick = addReview;
}

function deleteReview(placeId, index) {
  const reviews = JSON.parse(localStorage.getItem(`reviews-${placeId}`)) || [];
  reviews.splice(index, 1); // ลบรีวิวตามตำแหน่งที่ระบุ
  localStorage.setItem(`reviews-${placeId}`, JSON.stringify(reviews));

  loadReviews(placeId);
}

function clearReviewForm() {
  document.getElementById("reviewer-name").value = "";
  document.getElementById("review-comment").value = "";
  document.getElementById("review-rating").value = "5";
}
