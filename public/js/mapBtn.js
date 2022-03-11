// Events on Map
const viewMap = document.querySelector("[viewMap]");
const BG = document.querySelector("[BG]");
const clusterMap = document.querySelector("[cluster-map]");

viewMap.addEventListener("click", () => {
  if (viewMap.id == "viewMap") {
    BG.style.display = "none";
    viewMap.innerText = "Hide";
    viewMap.style.width = "150px";
    viewMap.setAttribute("id", "hideMap");
  } else {
    BG.style.display = "inline-flex";
    viewMap.style.width = "300px";
    viewMap.innerText = "View Global Map";
    viewMap.setAttribute("id", "viewMap");
  }
});
