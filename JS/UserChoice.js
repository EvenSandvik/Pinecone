function display(tab) {
  // Needs to be here because of loading order
  let intro_h = document.getElementById("intro");
  let oversikt_h = document.getElementById("oversikt");
  let detaljer_h = document.getElementById("detaljer");
  let sammen_h = document.getElementById('sammen');

  intro_h.style.display = "none";
  oversikt_h.style.display = "none";
  detaljer_h.style.display = "none";
  sammen_h.style.display = "none";

  switch (tab) {
    case "intro":
      intro_h.style.display = "grid";
      break;
    case "oversikt":
      oversikt_h.style.display = "flex";
      break;
    case "detaljer":
      detaljer_h.style.display = "grid";
      break;
    case "sammen":
      sammen_h.style.display = "grid";
      break;
    default:
      break;
  }
}
