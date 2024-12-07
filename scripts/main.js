document.addEventListener("DOMContentLoaded", () => {
  
  const apiUrl = "./data/api.json"; // URL ของ API
  const tourList = document.getElementById("tour-list");

  // ดึงข้อมูลจาก API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // สร้าง HTML สำหรับแต่ละสถานที่
      data.forEach((tour) => {
        const tourItem = document.createElement("div");
        tourItem.classList.add("tour-item");

        tourItem.innerHTML = `
          <img src="${tour.image}" alt="${tour.name}">
          <div class="info">
            <h2>${tour.name}</h2>
            <p>${tour.description}</p>
          </div>
         <button onclick="window.location.href='detail.html?id=1'">ดูเพิ่มเติม</button>


        `;

        tourList.appendChild(tourItem);
      });
    })
    .catch((error) => {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    });
});

// ฟังก์ชันสำหรับแสดงรายละเอียดเพิ่มเติม
function viewDetails(id) {
  alert(`คุณเลือกดูรายละเอียดสถานที่ ID: ${id}`);
}
