let allMatches = [];
let allTables = [];

const tableContainer = document.getElementById("table-container");

function isGroupStage(round) {
  return round.startsWith("Gruppe ");
}

function isPlayedMatch(match) {
  return match.goals1 !== "-" && match.goals2 !== "-";
}

function createEmptyTeamStats(teamName, flag) {
  return {
    name: teamName,
    flag,
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  };
}

function ensureTeam(groupTable, teamName, flag) {
  if (!groupTable[teamName]) {
    groupTable[teamName] = createEmptyTeamStats(teamName, flag);
  }
}

function applyMatchtoTeam(teamStats, goalsFor, goalsAgainst) {
  teamStats.matches++;
  teamStats.goalsFor += goalsFor;
  teamStats.goalsAgainst += goalsAgainst;
  teamStats.goalDiff = teamStats.goalsFor - teamStats.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    teamStats.wins++;
    teamStats.points += 3;
  } else if (goalsFor === goalsAgainst) {
    teamStats.draws++;
    teamStats.points += 1;
  } else {
    teamStats.losses++;
  }
}

function buildGroupTables(matches) {
  const group = {};

  for (const match of matches) {
    if (!isGroupStage(match.round)) continue;
    if (!group[match.round]) group[match.round] = {};

    ensureTeam(group[match.round], match.team1, match.flag1);
    ensureTeam(group[match.round], match.team2, match.flag2);

    if (!isPlayedMatch(match)) continue;

    applyMatchtoTeam(
      group[match.round][match.team1],
      match.goals1,
      match.goals2,
    );
    applyMatchtoTeam(
      group[match.round][match.team2],
      match.goals2,
      match.goals1,
    );
  }

  return Object.entries(group).map(([groupName, teamsObj]) => {
    const teams = Object.values(teamsObj).sort((a, b) => b.points - a.points);
    return { group: groupName, teams };
  });
}

function getTeamStats() {}

function renderTables(tables) {
  tableContainer.innerHTML = "";

  tables.forEach((groupData) => {
    const rowsHtml = groupData.teams
      .map((team, index) => {
        return `<tr>
    <th scope="row">${index + 1}</th>
    <td class="team-name">${team.flag} ${team.name}</td> 
    <td>${team.matches}</td>
    <td>${team.wins}-${team.draws}-${team.losses}</td>
    <td>${team.goalDiff}</td>
    <td>${team.points}</td>
  </tr>`;
      })
      .join("");

    const card = document.createElement("div");
    card.className = "table-card";
    card.innerHTML = `
            <div class="card-header">
                <span class="group">${groupData.group}</span>
            </div>
            <div class="card-body">
                <table>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col" class="team-name">Land</th>
                            <th scope="col">Sp.</th>
                            <th scope="col">S-U-N</th>
                            <th scope="col">Diff.</th>
                            <th scope="col">P.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
    `;
    tableContainer.appendChild(card);
  });
}

fetch("../assets/wm-gamedata.json")
  .then((response) => response.json())
  .then((data) => {
    allMatches = data.matches;
    allTables = buildGroupTables(allMatches);
    renderTables(allTables);
  });
