let players = JSON.parse(localStorage.getItem("players")) || [];

// Save to localStorage
function save() {
  localStorage.setItem("players", JSON.stringify(players));
}

// Calculate total safely
function calculateTotal(player) {
  if (!player.scores) return 0;

  return player.scores.reduce((sum, val) => {
    const num = parseInt(val, 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
}

// Add player
function addPlayer(name) {
  if (!name.trim()) return;

  players.push({
    name: name.trim(),
    scores: []
  });

  save();
  render();
}

// Add round
function addRound() {
  players.forEach(p => {
    if (!p.scores) p.scores = [];
    p.scores.push("");
  });

  save();
  render();
}

// Main render
function render() {
  const table = document.getElementById("scoreTable");
  table.innerHTML = "";

  if (players.length === 0) return;

  const rounds = Math.max(...players.map(p => p.scores.length));

  // Calculate lowest total
  let lowest = null;
  players.forEach(p => {
    const total = calculateTotal(p);
    if (lowest === null || total < lowest) {
      lowest = total;
    }
  });

  // ===== HEADER =====
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const blank = document.createElement("th");
  blank.textContent = "Round";
  headerRow.appendChild(blank);

  players.forEach((p, i) => {
    const th = document.createElement("th");
    th.textContent = p.name;

    const total = calculateTotal(p);
    if (total === lowest && lowest !== null) {
      th.classList.add("winner");
    }

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // ===== BODY =====
  const tbody = document.createElement("tbody");

  for (let r = 0; r < rounds; r++) {
    const row = document.createElement("tr");

    const roundLabel = document.createElement("td");
    roundLabel.textContent = r + 1;
    row.appendChild(roundLabel);

    players.forEach((p, playerIndex) => {
      const td = document.createElement("td");
      const input = document.createElement("input");

      input.type = "number";
      input.value = p.scores[r] ?? "";

      input.addEventListener("input", () => {
        players[playerIndex].scores[r] = input.value;
        save();
        render();
      });

      td.appendChild(input);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  }

  // ===== TOTAL ROW =====
  const totalRow = document.createElement("tr");

  const label = document.createElement("td");
  label.textContent = "Total";
  totalRow.appendChild(label);

  players.forEach(p => {
    const td = document.createElement("td");
    const total = calculateTotal(p);

    td.textContent = total;
    td.className = "total";

    if (total === lowest && lowest !== null) {
      td.classList.add("winner");
    }

    totalRow.appendChild(td);
  });

  tbody.appendChild(totalRow);
  table.appendChild(tbody);
}

// Hook up buttons
document.getElementById("addPlayerBtn").addEventListener("click", () => {
  const input = document.getElementById("playerName");
  addPlayer(input.value);
  input.value = "";
});

document.getElementById("addRoundBtn").addEventListener("click", addRound);

// Initial render
render();
