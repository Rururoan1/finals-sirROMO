const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://event-logger-backend.onrender.com"; // 🔁 Replace with your Render backend URL

const form = document.getElementById("eventForm");
const tableBody = document.querySelector("#eventTable tbody");

// Save event
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    event_name: document.getElementById("event_name").value,
    date: document.getElementById("date").value,
    happened: document.getElementById("happened").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const msg = await res.text();
    alert(msg);
    form.reset();
    loadEvents();
  } catch (err) {
    console.error("Error saving event:", err);
    alert("Failed to save event. Please check your server connection.");
  }
});

// Load events
async function loadEvents() {
  try {
    const res = await fetch(`${BASE_URL}/view`);
    const events = await res.json();

    tableBody.innerHTML = "";
    events.forEach((ev) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ev.id}</td>
        <td>${ev.event_name}</td>
        <td>${ev.date}</td>
        <td>${ev.happened}</td>
        <td>${ev.description}</td>
        <td>
          <button onclick="editEvent(${ev.id})">Edit</button>
          <button onclick="deleteEvent(${ev.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading events:", err);
  }
}

// Delete event
async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;
  try {
    await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
    loadEvents();
  } catch (err) {
    console.error("Error deleting event:", err);
  }
}

// Edit event
async function editEvent(id) {
  const newName = prompt("Enter new event name:");
  if (!newName) return;
  try {
    await fetch(`${BASE_URL}/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: newName }),
    });
    loadEvents();
  } catch (err) {
    console.error("Error editing event:", err);
  }
}

// Initial load
loadEvents();
