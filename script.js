const gameContainer = document.getElementById("matches-container");

fetch("./wm-gamedata.json")
  .then((response) => response.json())
  .then((data) => {
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
      gameContainer.appendChild(card);
    });
  });
