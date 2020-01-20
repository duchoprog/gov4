let stats = {
    R: {
        id: "R",
        full: "Republicans",
        num: "",
        wP: "",
        ids: []
    },
    I: {
        id: "I",
        full: "Independents",
        num: "",
        wP: "",
        ids: []
    },
    D: {
        id: "D",
        full: "Democrats",
        num: "",
        wP: "",
        ids: []
    },
    topNotWP: [],
    topMissed: []
}


//data.results[0].members[m].party

data.results[0].members.forEach((element, index) => stats[element.party].ids.push(index))

stats.R.num = stats.R.ids.length + ""
stats.D.num = stats.D.ids.length + ""
stats.I.num = stats.I.ids.length + ""

stats.totalReps = stats.R.ids.length + stats.D.ids.length + stats.I.ids.length



function avgWP(partido) {
    let largor = stats[partido].ids.length
    let titulo = stats[partido].full
    let wP = 0
    for (i = 0; i < largor; i++) {
        let orden = stats[partido].ids[i]
        wP += data.results[0].members[orden].votes_with_party_pct
    }
    wP = (wP / largor).toFixed(3)
    return `<tr><td>${titulo}</td><td>${largor}</td><td>${wP}</td></tr>`
}
function armarTablaAvg() {
    let reps = avgWP("R")
    reps += avgWP("D")
    reps += avgWP("I")
    document.querySelector("#tablaAverage").innerHTML = reps

}
var topFaltas = []
var porFaltas = []
function faltadores() {
    porFaltas = data.results[0].members.sort((a, b) => b.missed_votes - a.missed_votes)
    var i = 0
    while (i < 10 || porFaltas[i + 1].missed_votes == porFaltas[i].missed_votes) {
        topFaltas.push(porFaltas[i].last_name)
        stats.topMissed.push(porFaltas[i])
        i++;
    }

    let faltadoresHTML = ``
    for (i = 0; i < topFaltas.length; i++) {
        let porcentaje = (porFaltas[i].missed_votes * 100 / porFaltas[i].total_votes).toFixed(2)
        faltadoresHTML += `<tr>
                        <td>${porFaltas[i].last_name}</td>
                        <td>${porFaltas[i].missed_votes}</td>
                        <td>${porcentaje}</td>
                        </tr>`
    }
    document.querySelector("#missedvotes").innerHTML = faltadoresHTML
}

if (document.querySelector("#missedvotes")) { faltadores() }

function votadores() {
    let i = 0
    let lowFaltas = []
    while (i < 10 || porFaltas[porFaltas.length - i - 1].missed_votes == porFaltas[porFaltas.length - i - 2].missed_votes) {

        let orden = porFaltas.length - i - 1

        lowFaltas.push(porFaltas[orden - 1].last_name)

        i++;

    }
    let votadoresHTML = ``
    for (i = porFaltas.length - 1; i > porFaltas.length - lowFaltas.length - 1; i--) {
        let porcentaje = porFaltas[i].missed_votes_pct
        votadoresHTML += `<tr><td>${porFaltas[i].last_name}</td><td>${porFaltas[i].missed_votes}</td><td>${porcentaje}</td></tr>`
    }
    document.querySelector("#castedvotes").innerHTML = votadoresHTML
}

if (document.querySelector("#castedvotes")) {
    votadores()
}
porLoyalty = data.results[0].members.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)

function mostLoyal() {
    mostLoyalHTML = ``
    let i = 0
    while (i < stats.totalReps / 10 || porLoyalty[porLoyalty.length - i - 1].votes_with_party_pct == porLoyalty[porLoyalty.length - i - 2].votes_with_party_pct) {

        let orden = porLoyalty.length - i - 1

        mostLoyalHTML += `<tr><td>${porLoyalty[orden].last_name}</td><td>${porLoyalty[orden].total_votes}</td><td>${porLoyalty[orden].votes_with_party_pct}</td></tr>`

        i++;
        document.querySelector("#mostLoyalTable").innerHTML = mostLoyalHTML
    }

}
if (document.querySelector("#mostLoyalTable")) {
    mostLoyal()
}



function leastLoyal() {
    leastLoyalHTML = ``
    let i = 0
    while (i < stats.totalReps / 10 || porLoyalty[i].votes_with_party_pct == porLoyalty[i + 1].votes_with_party_pct) {


        leastLoyalHTML += `<tr><td>${porLoyalty[i].last_name}</td><td>${porLoyalty[i].total_votes}</td><td>${porLoyalty[i].votes_with_party_pct}</td></tr>`

        i++;
        document.querySelector("#leastLoyalTable").innerHTML = leastLoyalHTML
    }

}
if (document.querySelector("#leastLoyalTable")) {
    leastLoyal()
}


armarTablaAvg()



