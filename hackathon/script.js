const turfsContainer = document.getElementById("turfsContainer");
const bookingModal = document.getElementById("bookingModal");
const adminModal = document.getElementById("adminModal");
const bookingList = document.getElementById("bookingList");
const confirmBooking = document.getElementById("confirmBooking");

let selectedTurf = null;
let selectedSlot = null;

let turfs = JSON.parse(localStorage.getItem("turfs")) || [
  {
    id: 1,
    name: "Green Field",
    location: "Mumbai",
    price: 500,
    slots: ["08:00", "09:00", "10:00"]
  },
  {
    id: 2,
    name: "City Arena",
    location: "Pune",
    price: 700,
    slots: ["07:00", "09:00", "11:00"]
  }
];

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function renderTurfs() {
  turfsContainer.innerHTML = "";
  turfs.forEach(turf => {
    const div = document.createElement("div");
    div.className = "turf-card";
    div.innerHTML = `
      <h3>${turf.name}</h3>
      <p>${turf.location} | ₹${turf.price}</p>
      <div>${turf.slots.map(slot => {
        const isBooked = bookings.find(b => b.turfId === turf.id && b.slot === slot);
        return `<span class="slot ${isBooked ? 'booked' : ''}" data-turf="${turf.id}" data-slot="${slot}">${slot}</span>`;
      }).join("")}</div>
    `;
    turfsContainer.appendChild(div);
  });
}

document.body.addEventListener("click", function(e) {
  if (e.target.classList.contains("slot") && !e.target.classList.contains("booked")) {
    selectedTurf = parseInt(e.target.dataset.turf);
    selectedSlot = e.target.dataset.slot;
    document.getElementById("modalTurfName").textContent = "Book: " + selectedSlot;
    bookingModal.classList.remove("hidden");
  }
});

confirmBooking.onclick = () => {
  bookings.push({ turfId: selectedTurf, slot: selectedSlot, date: new Date().toLocaleString() });
  localStorage.setItem("bookings", JSON.stringify(bookings));
  bookingModal.classList.add("hidden");
  renderTurfs();
  renderBookings();
};

document.querySelector(".close").onclick = () => bookingModal.classList.add("hidden");
document.querySelector(".closeAdmin").onclick = () => adminModal.classList.add("hidden");
document.getElementById("openAdmin").onclick = () => adminModal.classList.remove("hidden");

document.getElementById("addTurfBtn").onclick = () => {
  const name = document.getElementById("adminTurfName").value;
  const location = document.getElementById("adminLocation").value;
  const price = parseInt(document.getElementById("adminPrice").value);
  const slots = document.getElementById("adminSlots").value.split(",").map(s => s.trim());
  turfs.push({ id: Date.now(), name, location, price, slots });
  localStorage.setItem("turfs", JSON.stringify(turfs));
  renderTurfs();
  adminModal.classList.add("hidden");
};

function renderBookings() {
  bookingList.innerHTML = "";
  bookings.forEach((b, index) => {
    const li = document.createElement("li");
    li.textContent = `Turf ${b.turfId} | Slot: ${b.slot} | ${b.date}`;
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = () => {
      bookings.splice(index, 1);
      localStorage.setItem("bookings", JSON.stringify(bookings));
      renderBookings();
      renderTurfs();
    };
    li.appendChild(cancel);
    bookingList.appendChild(li);
  });
}

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark-mode");
};

renderTurfs();
renderBookings();
