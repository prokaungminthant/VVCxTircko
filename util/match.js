exports.openMatchConsole = function () {
  let reg0Ffa = "";
  let reg1Ffa = "";
  let reg2Ffa = "";
  let reg3Ffa = "";
  let reg0Ctg = "";
  let reg1Ctg = "";
  let reg2Ctg = "";
  let reg3Ctg = "";
  let reg0Svv = "";
  let reg1Svv = "";
  let reg2Svv = "";
  let reg3Svv = "";
  let urlReg0Ffa = "https://voxiom.io/find?region=0&game_mode=ffa";
  let urlReg1Ffa = "https://voxiom.io/find?region=1&game_mode=ffa";
  let urlReg2Ffa = "https://voxiom.io/find?region=2&game_mode=ffa";
  let urlReg3Ffa = "https://voxiom.io/find?region=3&game_mode=ffa";
  let urlReg0Ctg = "https://voxiom.io/find?region=0&game_mode=ctg";
  let urlReg1Ctg = "https://voxiom.io/find?region=1&game_mode=ctg";
  let urlReg2Ctg = "https://voxiom.io/find?region=2&game_mode=ctg";
  let urlReg3Ctg = "https://voxiom.io/find?region=3&game_mode=ctg";
  let urlReg0Svv = "https://voxiom.io/find?region=0&game_mode=svv";
  let urlReg1Svv = "https://voxiom.io/find?region=1&game_mode=svv";
  let urlReg2Svv = "https://voxiom.io/find?region=2&game_mode=svv";
  let urlReg3Svv = "https://voxiom.io/find?region=3&game_mode=svv";
  console.log("OPEN MATCH CONSOLE!");

  let listDom = document.getElementById("listBox");
  listDom.innerHTML = "";
  let listhead = `
<div id="row" class="listHead">
  <div class="listT">Region</div>
  <div class="listT">Mode</div>
  <div class="listT">URL</div>
  <div class="listT">Join</div>
  <div class="listT">CopyLink</div>
</div>`;
  listDom.insertAdjacentHTML("afterbegin", listhead);

  if (
    document.getElementById("matchList").getAttribute("style") ===
    "display:none"
  ) {
    document.getElementById("matchList").setAttribute("style", "display:block");
    fetchData();
  } else if (
    document.getElementById("matchList").getAttribute("style") ===
    "display:block"
  ) {
    document.getElementById("matchList").setAttribute("style", "display:none");
  }

  //URLの生成
  async function fetchData() {
    //FFA
    const f0f = await fetch(urlReg0Ffa);
    const f0fr = await f0f.json();
    reg0Ffa = await f0fr.tag;
    await console.log(reg0Ffa);
    let tempDom1 = `<div id="row">
    <div class="region">US-W</div>
    <div class="mode">FFA</div>
    <div class="url">https://voxiom.io/experimental#${reg0Ffa}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/experimental#${reg0Ffa}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/experimental#${reg0Ffa}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom1);

    const f1f = await fetch(urlReg1Ffa);
    const f1fr = await f1f.json();
    reg1Ffa = await f1fr.tag;
    await console.log(reg1Ffa);
    let tempDom2 = `<div id="row">
    <div class="region">US-E</div>
    <div class="mode">FFA</div>
    <div class="url">https://voxiom.io/experimental#${reg1Ffa}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/experimental#${reg1Ffa}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/experimental#${reg1Ffa}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom2);
    const f2f = await fetch(urlReg2Ffa);
    const f2fr = await f2f.json();
    reg2Ffa = await f2fr.tag;
    await console.log(reg2Ffa);
    let tempDom3 = `<div id="row">
    <div class="region">EU</div>
    <div class="mode">FFA</div>
    <div class="url">https://voxiom.io/experimental#${reg2Ffa}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/experimental#${reg2Ffa}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/experimental#${reg2Ffa}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom3);

    const f3f = await fetch(urlReg3Ffa);
    const f3fr = await f3f.json();
    reg3Ffa = await f3fr.tag;
    await console.log(reg3Ffa);
    let tempDom4 = `<div id="row">
    <div class="region">Asia</div>
    <div class="mode">FFA</div>
    <div class="url">https://voxiom.io/experimental#${reg3Ffa}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/experimental#${reg3Ffa}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/experimental#${reg3Ffa}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom4);

    //CTG
    const f0c = await fetch(urlReg0Ctg);
    const f0cr = await f0c.json();
    reg0Ctg = await f0cr.tag;
    await console.log(reg0Ctg);
    let tempDom5 = `<div id="row">
    <div class="region">US-W</div>
    <div class="mode">CTG</div>
    <div class="url">https://voxiom.io/#${reg0Ctg}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg0Ctg}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg0Ctg}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom5);

    const f1c = await fetch(urlReg1Ctg);
    const f1cr = await f1c.json();
    reg1Ctg = await f1cr.tag;
    await console.log(reg1Ctg);
    let tempDom6 = `<div id="row">
    <div class="region">US-E</div>
    <div class="mode">CTG</div>
    <div class="url">https://voxiom.io/#${reg1Ctg}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg1Ctg}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg1Ctg}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom6);

    const f2c = await fetch(urlReg2Ctg);
    const f2cr = await f2c.json();
    reg2Ctg = await f2cr.tag;
    await console.log(reg2Ctg);
    let tempDom7 = `<div id="row">
    <div class="region">EU</div>
    <div class="mode">CTG</div>
    <div class="url">https://voxiom.io/#${reg2Ctg}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg2Ctg}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg2Ctg}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom7);

    const f3c = await fetch(urlReg3Ctg);
    const f3cr = await f3c.json();
    reg3Ctg = await f3cr.tag;
    await console.log(reg3Ctg);
    let tempDom8 = `<div id="row">
    <div class="region">Asia</div>
    <div class="mode">CTG</div>
    <div class="url">https://voxiom.io/#${reg3Ctg}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg3Ctg}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg3Ctg}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom8);

    //Survival
    const f0s = await fetch(urlReg0Svv);
    const f0sr = await f0s.json();
    reg0Svv = await f0sr.tag;
    await console.log(reg0Svv);
    let tempDom9 = `<div id="row">
    <div class="region">US-W</div>
    <div class="mode">Survival</div>
    <div class="url">https://voxiom.io/#${reg0Svv}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg0Svv}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg0Svv}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom9);

    const f1s = await fetch(urlReg1Svv);
    const f1sr = await f1s.json();
    reg1Svv = await f1sr.tag;
    await console.log(reg1Svv);
    let tempDom10 = `<div id="row">
    <div class="region">US-E</div>
    <div class="mode">Survival</div>
    <div class="url">https://voxiom.io/#${reg1Svv}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg1Svv}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg1Svv}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom10);

    const f2s = await fetch(urlReg2Svv);
    const f2sr = await f2s.json();
    reg2Svv = await f2sr.tag;
    await console.log(reg2Svv);
    let tempDom11 = `<div id="row">
    <div class="region">EU</div>
    <div class="mode">Survival</div>
    <div class="url">https://voxiom.io/#${reg2Svv}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg2Svv}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg2Svv}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom11);

    const f3s = await fetch(urlReg3Svv);
    const f3sr = await f3s.json();
    reg3Svv = await f3sr.tag;
    await console.log(reg3Svv);
    let tempDom12 = `<div id="row">
    <div class="region">Asia</div>
    <div class="mode">Survival</div>
    <div class="url">https://voxiom.io/#${reg3Svv}</div>
    <div class="join" onclick="window.location.href ='https://voxiom.io/#${reg3Svv}'">
        <span class="material-symbols-outlined">
            play_circle
        </span>
    </div>
    <div class="copy" onclick="navigator.clipboard.writeText('https://voxiom.io/#${reg3Svv}')">
        <span class="material-symbols-outlined">
            content_copy
        </span>
    </div>
</div>`;
    listDom.insertAdjacentHTML("beforeend", tempDom12);
  }
};
