document.addEventListener("DOMContentLoaded", () => {
  const tabHeaders = document.querySelectorAll("[data-tab]");
  const contentBoxes = document.querySelectorAll("[data-tab-content]");

  tabHeaders.forEach(function (item) {
    item.addEventListener("click", function () {
      contentBoxes.forEach(function (item) {
        item.classList.add("hidden");
      });

      const contentBox = document.querySelector("#" + this.dataset.tab);
      contentBox.classList.remove("hidden");
    });
  });

  for (let i = 0; i < tabHeaders.length; i++) {
    tabHeaders[i].addEventListener("click", () => {
      for (let jj = 0; jj < tabHeaders.length; jj++) {
        tabHeaders[jj].classList.remove("item--active");
      }
      tabHeaders[i].classList.add("item--active");
    });
  }
});
