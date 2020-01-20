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
  topMissed: [],
  topWP: [],
  topNotMissed: [],
  hMembers: [],
  sMembers: ["3"]
};
var app = new Vue({
  el: "#app",
  data: {
    sMembers: [],
    hMembers: [],
    vmembers: ["mal"],
    checkedParties: ["R", "D", "I"],
    checkedPartiesOS: ["Republican", "Democratic", "Independent"],
    sel: "ALL",
    vestados: [],
    ppurl: "",
    mdLegUrl: "",
    mdlegislators: {},
    mdOver: "",
    md: ""
  },
  methods: {




  },
  computed: {
    lealtad: function () {
      if (this.vmembers[0]) {
        let reps = { id: "R", name: "Republicans", cuantos: 0, leal: 0 };
        let dems = { id: "D", name: "Democrats", cuantos: 0, leal: 0 };
        let inds = { id: "I", name: "Independents", cuantos: 0, leal: 0 };
        let result = [reps, dems, inds];
        let total = 0
        let promedio = 0
        for (m = 0; m < this.vmembers.length; m++) {

          if (this.vmembers[m].votes_with_party_pct) {

            promedio = promedio + parseFloat(this.vmembers[m].votes_with_party_pct);
            total++
          }
          if (this.vmembers[m].party == "R") {
            reps.cuantos++;
            reps.leal += this.vmembers[m].votes_with_party_pct;
          } else if (this.vmembers[m].party == "D") {
            dems.cuantos++;
            dems.leal += this.vmembers[m].votes_with_party_pct;
          } else if (this.vmembers[m].party == "I") {
            inds.cuantos++;
            inds.leal += this.vmembers[m].votes_with_party_pct;
          }
        }
        for (r = 0; r < result.length; r++) {
          result[r].leal = (result[r].leal / result[r].cuantos).toFixed(2);

        }

        promedio = (promedio / total).toFixed(2)
        console.log("total: ", total, "promedio: ", promedio)
        result.push({ id: '', name: 'Average', cuantos: total, leal: promedio })
        return result;
      }
    },
    faltantes: function () {
      let porFaltasDec = [...this.vmembers].sort(
        (a, b) => b.missed_votes - a.missed_votes
      );
      if (porFaltasDec[2]) {
        console.log(porFaltasDec[0]);
      }

      let topFaltantes = [];

      if (porFaltasDec[2]) {
        let i = 0;
        //console.log(porFaltasDec.length / 10)
        while (
          i < porFaltasDec.length / 10 ||
          porFaltasDec[i + 1].missed_votes == porFaltasDec[i].missed_votes
        ) {
          topFaltantes.push(porFaltasDec[i]);
          topFaltantes[i].pc_falt = (
            (topFaltantes[i].missed_votes * 100) /
            topFaltantes[i].total_votes
          ).toFixed(2);

          i++;
        }
        // console.log(topFaltantes)
        return topFaltantes;
      }

      return topFaltantes;
    },

    votantes: function () {
      let porFaltas = [...this.vmembers].sort(
        (a, b) => a.missed_votes - b.missed_votes
      );
      let topVotantes = [];
      let v = 0;
      let divisor = 0
      let aux = porFaltas.filter(e => e.missed_votes != 0 && e.total_votes != 0)

      while (
        v < porFaltas.length / 10 ||
        aux[v - 1].missed_votes == aux[v].missed_votes
      ) {
        topVotantes.push(aux[v]);
        //console.log(topVotantes[v].missed_votes, " ", topVotantes[v].total_votes)
        topVotantes[v].pc_falt = (

          (topVotantes[v].missed_votes * 100) /
          topVotantes[v].total_votes
        ).toFixed(2);
        v++;
      }

      return topVotantes;
    },

    least: function () {
      let porInfiel = [...this.vmembers].sort(
        (a, b) => a.votes_with_party_pct - b.votes_with_party_pct
      );
      let topInfiel = [];
      let v = 0;
      while (
        v < porInfiel.length / 10 ||
        porInfiel[v - 1].votes_with_party_pct ==
        porInfiel[v].votes_with_party_pct
      ) {
        topInfiel.push(porInfiel[v]);

        v++;
      }

      return topInfiel;
    },

    most: function () {
      let porFiel = [...this.vmembers].sort(
        (a, b) => b.votes_with_party_pct - a.votes_with_party_pct
      );
      let topFiel = [];
      let v = 0;
      while (
        v < porFiel.length / 10 ||
        porFiel[v - 1].votes_with_party_pct == porFiel[v].votes_with_party_pct
      ) {
        topFiel.push(porFiel[v]);

        v++;
      }

      return topFiel;
    },

    /* armarSelect: function(quienes) {
      estados = [];
      for (m = 0; m < this.quienes.length; m++) {
        if (estados.indexOf(this.quienes[m].state) < 0) {
          estados.push(this.quienes[m].state);
        }
      }

      estados = estados.sort();
      estados.unshift("ALL");
      return estados;
    }, */

    activados: function () {
      listaFiltrada = [];

      var checkados = this.checkedParties;

      for (m = 0; m < this.vmembers.length; m++) {
        if (
          checkados.indexOf(this.vmembers[m].party) != -1 &&
          (this.sel == "ALL" || this.sel == this.vmembers[m].state)
        ) {
          listaFiltrada.push(this.vmembers[m]);
        }
      }
      //console.log(checkados);
      return listaFiltrada;
    },


  }
});

//de statistics


function cachedFetch(url, options, quienes, cacheKey = url) {

  let x;
  let cached = sessionStorage.getItem(cacheKey);
  if (cached !== null) {
    x = JSON.parse(sessionStorage.getItem(cacheKey));
    x = x.results[0].members
    app.vmembers = x

    return x;
  } else {
    return fetch(url, options)
      .then(response => {
        if (response.status === 200) {

          return response.json();
        } else {
          alert(response.statusText);
        }
      })
      .then(function (json) {
        x = json;
        stats[quienes] = x.results[0].members;
        app.vmembers = x.results[0].members;

        sessionStorage.setItem(cacheKey, JSON.stringify(json));

        return x;
      });
  }
}

url =
  "https://openstates.org/api/v1/legislators/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3&state=md";
app.mdLegUrl = url;
options = {};


url =
  "https://openstates.org/api/v1/metadata/md/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3";
app.mdOver = url;
options = {};
//app.md = cachedFetch(url, options);
//console.log('mdover', app.md)
//console.log('open', cachedFetch(url, options))

///////////////////////////////

function getChamberTitle() {
  for (m = 0; m < app.mdlegislators.length; m++) {
    let camara = app.mdlegislators[m].chamber;
    //console.log (md.chambers[camara].title)
    //app.mdlegislators[m].memberTitle = app.md.chambers[camara].title;
  }
}
