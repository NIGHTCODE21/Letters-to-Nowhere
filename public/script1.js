let lastAIReply = "";
let lastSecret = "";

async function fetchAIResponse(secret) {
  const response = await fetch("https://letters-to-nowhere-production.up.railway.app/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ secret }),
  });

  const data = await response.json();
  return data.reply;
}


const typeEffect = (text, element, callback) => {
  let i = 0;
  element.innerHTML = "";
  const interval = setInterval(() => {
    element.innerHTML += text.charAt(i) === " " ? "&nbsp;" : text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 40);
};

document.getElementById("submitBtn").addEventListener("click", async() => {
  const secretInput = document.getElementById("secretInput");
  const outputDiv = document.getElementById("aiResponse");
  const whisperSound = document.getElementById("whisperSound");
  const fireCrackle = document.getElementById("fireCrackle");
  const burnScreen = document.getElementById("burnScreen");

  const secret = secretInput.value.trim();
  if (!secret) return alert("Type your secret first...");

  lastSecret = secret;

  whisperSound.play();
 const reply = await fetchAIResponse(secret);
 lastAIReply = reply;




  outputDiv.innerText = "";
  outputDiv.classList.remove("hidden");

  typeEffect(reply, outputDiv, () => {
    setTimeout(() => {
      outputDiv.classList.add("fade-out");

      setTimeout(() => {
        outputDiv.innerText = "🫢 Your secret has been burned.";
        outputDiv.classList.remove("fade-out");
        secretInput.value = "";
        document.getElementById("makePosterBtn").style.display = "inline-block";


        // 🔥 Flame FX (5s)
        const flameInterval = setInterval(() => {
          const flame = document.createElement("div");
          flame.classList.add("flame");
          flame.style.setProperty("--size", Math.random() * 30 + 10 + "px");
          flame.style.setProperty("--color", ["#ff4500", "#ff6347", "#ffa500", "#ffff66"][Math.floor(Math.random() * 4)]);
          flame.style.setProperty("--duration", `${1.5 + Math.random()}s`);
          flame.style.left = Math.random() * 100 + "%";
          flame.style.bottom = Math.random() * 30 + "px";
          document.querySelector(".container").appendChild(flame);
          setTimeout(() => flame.remove(), 3000);
        }, 80);

        setTimeout(() => clearInterval(flameInterval), 5000);

        // 💨 Ash FX (5s)
        const ashInterval = setInterval(() => {
          const ash = document.createElement("div");
          ash.classList.add("ash");
          ash.style.setProperty("--size", Math.random() * 10 + 4 + "px");
          ash.style.setProperty("--color", ["#aaaaaa", "#ffffff", "#555555"][Math.floor(Math.random() * 3)]);
          ash.style.setProperty("--duration", `${2 + Math.random()}s`);
          ash.style.setProperty("--x", `${Math.random() * 200 - 100}px`);
          ash.style.left = Math.random() * 100 + "%";
          ash.style.bottom = Math.random() * 30 + "px";
          document.querySelector(".container").appendChild(ash);
          setTimeout(() => ash.remove(), 4000);
        }, 50);

        setTimeout(() => clearInterval(ashInterval), 5000);

        // 💥 Big ash burst
        for (let i = 0; i < 100; i++) {
          const ash = document.createElement("div");
          ash.classList.add("ash");
          ash.style.setProperty("--size", Math.random() * 10 + 4 + "px");
          ash.style.setProperty("--color", ["#aaaaaa", "#ffffff", "#555555"][Math.floor(Math.random() * 3)]);
          ash.style.setProperty("--duration", `${2 + Math.random()}s`);
          ash.style.setProperty("--x", `${Math.random() * 200 - 100}px`);
          ash.style.left = Math.random() * 100 + "%";
          ash.style.bottom = Math.random() * 30 + "px";
          document.querySelector(".container").appendChild(ash);
          setTimeout(() => ash.remove(), 4000);
        }

        // 🔥 Burn screen + sound
        burnScreen.style.opacity = "1";
        const fireSound = document.getElementById("fireCrackle");
fireSound.currentTime = 0; // Start from beginning
fireSound.play();

// Stop after 5s
setTimeout(() => fireSound.pause(), 5000);


        // Reset burn screen after a while
        setTimeout(() => {
          burnScreen.style.opacity = "0";
        }, 5000);

      }, 1000); // delay after typing
    }, 5000); // delay after reply
  });
});


document.getElementById("makePosterBtn").addEventListener("click", async () => {
  const secret = lastSecret;
  if (!secret) return alert("No secret found!");

  try {
    const res = await fetch("https://genifyme-production.up.railway.app/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: secret })
    });

    const data = await res.json();
    const imageUrl = data.imageUrl;

    if (imageUrl) {
      // Create an image element
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Generated Poster";
      img.classList.add("generated-poster");


      document.querySelector(".container").appendChild(img);
      document.getElementById("makePosterBtn").style.display = "none"; // hide after showing
    } else {
      alert("❌ Failed to generate poster.");
    }
  } catch (err) {
    console.error("Poster error:", err);
    alert("❌ Could not reach poster server.");
  }
});




