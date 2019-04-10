const intro_h = document.getElementById('intro');
const oversikt_h = document.getElementById('oversikt');
const detaljer_h = document.getElementById('detaljer');
const sammen_h = document.getElementById('sammen');




function diplay(tab) {
  intro_h.style.visibility = "hidden";
  oversikt_h.style.visibility = "hidden";
  detaljer_h.style.visibility = "hidden";
  sammen_h.style.visibility = "hidden";

  switch (tab) {
    case "intro":
      intro_h.style.visibility = "visible";
      break;
    case "oversikt":
      oversikt_h.style.visibility = "visible";
      break;
    case "oversikt":
      detaljer_h.style.visibility = "visible";
      break;
    case "oversikt":
      sammen_h.style.visibility = "visible";
      break;
  }
}
