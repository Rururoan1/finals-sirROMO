const form = document.getElementById("eventForm");
const tableBody = document.querySelector("#eventTable tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    event_name: document.getElementById("event_name").value,
    date: document.getElementById("date").value,
    happened: document.getElementById("happened").value,
    description: document.getElementById("description").value,
  };

  const res = await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const msg = await res.text();
  alert(msg);
  form.reset();
  loadEvents();
});

async function loadEvents() {
  const res = await fetch("/view");
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
}

async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;
  await fetch(`/delete/${id}`, { method: "DELETE" });
  loadEvents();
}

async function editEvent(id) {
  const newName = prompt("Enter new event name:");
  if (!newName) return;
  await fetch(`/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_name: newName }),
  });
  loadEvents();
}

loadEvents();
