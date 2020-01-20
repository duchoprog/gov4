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
    md: "",
    newLegs: []
  },
  methods: {
    activadosM: function () {
      listaFiltrada = [];

      var checkados = this.checkedPartiesOS;
      //console.log(checkados);

      for (m = 0; m < this.newLegs.length; m++) {
        if (
          checkados.indexOf(this.newLegs[m].party) != -1 &&
          (this.sel == "ALL" || this.sel == this.newLegs[m].state)
        ) {
          listaFiltrada.push(this.newLegs[m]);
        }
      }
      return listaFiltrada;
    }



  },
  computed: {

  }
});




function cachedFetch(url, options, quienes, cacheKey = url) {
  //sessionStorage.clear();
  let x;
  let cached = sessionStorage.getItem(cacheKey);
  if (cached !== null) {
    x = JSON.parse(sessionStorage.getItem(cacheKey));
    x = x
    app[quienes] = x

    if (quienes == "mdlegislators") {
      console.log("quienes=mdlegis 251")

      cachedFetch("https://openstates.org/api/v1/metadata/md/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3", {}, "md")
    }
    else if (quienes == "md") {
      console.log("quienes=md 256")
      getChamberTitle()
    }

  } else {
    return fetch(url, options)
      .then(response => {
        if (response.status === 200) {
          // response.clone().text().then(content => {
          //sessionStorage.setItem(cacheKey, content);
          //app.vmembers=JSON.parse(sessionStorage.getItem(cacheKey)).results[0].members
          return response.json();
        } else {
          alert(response.statusText);
        }
      })
      .then(function (json) {
        x = json;
        stats[quienes] = x;
        app[quienes] = x;
        sessionStorage.setItem(cacheKey, JSON.stringify(json));
        //console.log("esto devuelve si  fetch", x)

        if (quienes == "mdlegislators") {
          cachedFetch("https://openstates.org/api/v1/metadata/md/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3", {}, "md")
        }
        else if (quienes == "md") {
          getChamberTitle()
          app.activadosM()
        }
      });
  }
}


url =
  "https://openstates.org/api/v1/legislators/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3&state=md";
app.mdLegUrl = url;
options = {};

function getChamberTitle() {

  for (m = 0; m < app.mdlegislators.length; m++) {
    let camara = app.mdlegislators[m].chamber;
    app.mdlegislators[m].memberTitle = app.md.chambers[camara].title;
  }

  app.newLegs = app.mdlegislators


}
