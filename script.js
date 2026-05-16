const gameContainer = document.getElementById("matches-container");

function reformateMatchDate(dateStr, timeStr) {
  const [day, month, year] = dateStr.split(".").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

fetch("./wm-gamedata.json")
  .then((response) => response.json())
  .then((data) => {
    data.matches.sort(
      (a, b) =>
        reformateMatchDate(a.date, a.time) - reformateMatchDate(b.date, b.time),
    );

    const today = new Date();

    data.matches.forEach((match) => {
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
            <h4>${match.team1} : ${match.team2}</h4>
            <p>${match.ground}</p>
            </div>
        `;

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
  });
