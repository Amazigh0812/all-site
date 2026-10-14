fetch("data/all.json")
  .then((data) => data.json())
  .then((data) => {
    const MINNUM = 0;
    const MAXNUM = 10;
    const btn = document.querySelector(".btn");
    const input = document.querySelector(".input");
    const verbe = document.querySelector(".verbe");
    const rndnum = Math.floor(Math.random() * (MAXNUM - MINNUM)) + MINNUM;
    const conjNum = Math.floor(Math.random() * 4);
    let conjTime = ["prasens", "prateritum", "perfekt", "fr"];
    // const qConjTime = conjTime[conjNum];
    const qConjTime = "inf";
    conjTime.splice(conjNum, 1);
    // const aConjTime = conjTime[Math.floor(Math.random() * 3)];
    const aConjTime = "fr";
    console.log(aConjTime);
    const question = data["verbe"][rndnum][qConjTime];
    verbe.innerText = question + "(" + qConjTime + ")" + ", " + aConjTime;
    console.log(data["verbe"][rndnum]);
    btn.addEventListener("click", () => {
      // verbe.innerText = input.value;
      if (input.value == data["verbe"][rndnum][aConjTime]) {
        input.classList.add("right");
      } else {
        if (input.value != "") {
          input.classList.add("false");
        }
        input.value = "Bonne réponse: " + data["verbe"][rndnum][aConjTime];
      }
    });
  });
