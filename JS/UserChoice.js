function display(tab) {
  // Needs to be here because of loading order
  let intro_h = document.getElementById("intro");
  let oversikt_h = document.getElementById("oversikt");
  let detaljer_h = document.getElementById("detaljer");
  let sammen_h = document.getElementById("sammen");

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
    case "detaljer":
      detaljer_h.style.visibility = "visible";
      break;
    case "sammen":
      sammen_h.style.visibility = "visible";
      break;
    default:
      break;
  }
}
