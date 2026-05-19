let allMatches = [];

const gameContainer = document.getElementById("matches-container");

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
  renderMatches(e.target.value.trim());
});

function reformateMatchDate(dateStr, timeStr) {
  const [day, month, year] = dateStr.split(".").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function matchesSearch(match, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [
    match.team1,
    match.team2,
    match.ground,
    match.round,
    match.date,
    match.time,
  ].some((val) => val && val.toLowerCase().includes(q));
}

function renderMatches(query) {
  gameContainer.innerHTML = "";
  const filtered = allMatches.filter((match) => {
    if (!query) return true;
    return matchesSearch(match, query);
  });
  const today = new Date();
  filtered.forEach((match) => {
    const card = document.createElement("div");
    card.className += "match-card";
    card.innerHTML = `
            <div class="card-header">
                <span class="time">${match.time}</span>
                <span class="round">${match.round}</span>
                <span class="date">${match.date}</span>
            </div>

            <div class="card-body">
            <h2>${match.flag1} ${match.goals1} : ${match.goals2} ${match.flag2}</h2>
            <div class="teams">
            <span class="team1">${match.team1}</span>
            <span> : </span>
            <span class="team2">${match.team2}</span>
            </div>
            <p>${match.ground}</p>
            </div>
        `;

    if (match.goals1 > match.goals2) {
      card.getElementsByClassName("team2")[0].style.fontWeight = "normal";
    } else if (match.goals2 > match.goals1) {
      card.getElementsByClassName("team1")[0].style.fontWeight = "normal";
    }

    const matchDate = reformateMatchDate(match.date, match.time);

    if (
      matchDate.getFullYear() === today.getFullYear() &&
      matchDate.getMonth() === today.getMonth() &&
      matchDate.getDate() === today.getDate()
    ) {
      card.classList.add("today");
    }

    gameContainer.appendChild(card);

    const todayCard = document.querySelector(".match-card.today");
    if (todayCard) {
      todayCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

fetch("./wm-gamedata.json")
  .then((response) => response.json())
  .then((data) => {
    allMatches = data.matches.sort(
      (a, b) =>
        reformateMatchDate(a.date, a.time) - reformateMatchDate(b.date, b.time),
    );

    renderMatches("");
  });
