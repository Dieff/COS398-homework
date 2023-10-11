/* 
  Create collapsible sections effect.

  The effect will automatically be applied to any article with
  the "collapsible" class and the correct children present.

  MDN was used extensively to create this script.
*/
document.addEventListener("DOMContentLoaded", () => {
  // find each article with .collapsible, and attempts to add event listeners
  document.querySelectorAll(".collapsible").forEach((collapsible) => {
    // there should be two sections, 1 with the title and one for hiding
    if (collapsible.childElementCount === 2) {
      // the first child is the title div. the first child of the title div is the collapser button
      if (
        collapsible.firstElementChild.firstElementChild?.tagName === "BUTTON"
      ) {
        const collapseButton = collapsible.firstElementChild.firstElementChild;
        const hiddenSection = collapsible.children.item(1);
        if (hiddenSection) {
          // toggle the presence of the "hideme" class
          collapseButton.addEventListener("click", () => {
            if (hiddenSection.classList.contains("hideme")) {
              hiddenSection.classList.remove("hideme");
            } else {
              hiddenSection.classList.add("hideme");
            }
          });
          // bail out, instead of printing the warning
          return;
        }
      }
    }

    console.warn("Failed to augment .collapsible article");
  });
});
