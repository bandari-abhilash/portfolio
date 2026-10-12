// A small simulated desktop: workspaces switch with ⌥1–⌥7 (or the key buttons),
// and a tour plays the incident-call sequence from the article once it's in view.
document.querySelectorAll(".ws-demo").forEach((demo) => {
  const screen = demo.querySelector(".ws-screen");
  const pills = [...demo.querySelectorAll(".ws-pill")];
  const panes = [...demo.querySelectorAll(".ws-pane")];
  const app = demo.querySelector(".ws-front-app");
  const status = demo.querySelector(".ws-status");
  const keys = [...demo.querySelectorAll(".ws-key")];
  const tourButton = demo.querySelector(".ws-tour");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let current = "1";
  let previous = "1";
  let tourTimer = 0;

  const show = (ws, label) => {
    if (ws !== current) {
      previous = current;
      current = ws;
    }
    pills.forEach((pill) => pill.classList.toggle("is-active", pill.dataset.ws === current));
    panes.forEach((pane) => {
      pane.hidden = pane.dataset.ws !== current;
    });
    const pane = panes.find((p) => p.dataset.ws === current);
    app.textContent = pane ? pane.dataset.app : "";
    if (label) status.textContent = label;
  };

  const flip = () => {
    const pane = panes.find((p) => p.dataset.ws === current);
    if (pane) pane.classList.toggle("is-stacked");
  };

  const press = (key) => {
    const button = keys.find((k) => k.dataset.key === key);
    if (button) {
      button.classList.add("is-pressed");
      setTimeout(() => button.classList.remove("is-pressed"), 220);
    }
    if (key === "tab") {
      show(previous, `⌥ Tab → back to workspace ${previous}`);
    } else if (key === "/") {
      flip();
      status.textContent = "⌥ / → split flipped";
    } else {
      const pane = panes.find((p) => p.dataset.ws === key);
      show(key, `⌥ ${key} → ${pane ? pane.dataset.app : "empty workspace"}`);
    }
  };

  const stopTour = () => {
    clearTimeout(tourTimer);
    demo.classList.remove("is-touring");
  };

  // Same order as the recorded video: logs, split flip, every app's workspace, back, logs
  const tour = ["1", "/", "/", "2", "3", "4", "7", "tab", "1"];
  const playTour = () => {
    stopTour();
    demo.classList.add("is-touring");
    show("1", "Alert fired. Where is everything?");
    let i = 0;
    const next = () => {
      if (i >= tour.length) {
        demo.classList.remove("is-touring");
        status.textContent = "Your turn: press ⌥ 1–7 or click a key.";
        return;
      }
      press(tour[i++]);
      tourTimer = setTimeout(next, 1400);
    };
    tourTimer = setTimeout(next, 1200);
  };

  keys.forEach((button) =>
    button.addEventListener("click", () => {
      stopTour();
      press(button.dataset.key);
    })
  );

  // Option+digit while the demo has focus; e.code ignores what Option types on macOS
  demo.addEventListener("keydown", (event) => {
    if (!event.altKey) return;
    let key = null;
    if (/^Digit[1-7]$/.test(event.code)) key = event.code.slice(5);
    else if (event.code === "Tab") key = "tab";
    else if (event.code === "Slash") key = "/";
    if (!key) return;
    event.preventDefault();
    stopTour();
    press(key);
  });

  screen.addEventListener("click", () => demo.focus());
  tourButton.addEventListener("click", playTour);

  demo.classList.add("is-ready");
  show("1", "Press ⌥ 1–7 or click a key below.");

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          playTour();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(demo);
  }
});
