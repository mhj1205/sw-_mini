document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("mbti-form")) {
    const form = document.getElementById("mbti-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Initialize scores
      const scores = {
        E: 0,
        I: 0,
        N: 0,
        S: 0,
        T: 0,
        F: 0,
        J: 0,
        P: 0,
      };

      // Collect form data
      const formData = new FormData(form);
      formData.forEach((value, key) => {
        if (scores.hasOwnProperty(value)) {
          scores[value]++;
        }
      });

      // Determine MBTI type
      const mbtiType =
        (scores.E > scores.I ? "E" : "I") +
        (scores.N > scores.S ? "N" : "S") +
        (scores.T > scores.F ? "T" : "F") +
        (scores.J > scores.P ? "J" : "P");

      document.getElementById("mbti-type").textContent = mbtiType;
      document.getElementById("result").classList.remove("hidden");
    });
  }
});
