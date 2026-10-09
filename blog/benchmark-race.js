// Each ball continuously crosses the same track and reverses at the edge.
// One-way travel time is proportional to packet latency or inverse throughput.
document.querySelectorAll(".benchmark-race").forEach((race) => {
  const rows = [...race.querySelectorAll(".race-row")].map((row) => ({
    track: row.querySelector(".race-track"),
    ball: row.querySelector(".race-ball"),
    value: Number(row.dataset.value),
  }));
  const replay = race.querySelector(".race-replay");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const throughput = race.dataset.raceKind === "throughput";
  const values = rows.map((row) => row.value);
  const fastest = throughput ? Math.max(...values) : Math.min(...values);
  const baseTripMs = throughput ? 2600 : 900;
  let distances = [];
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let inView = false;

  const measure = () => {
    distances = rows.map((row) => Math.max(0, row.track.clientWidth - 28));
  };

  const draw = () => {
    rows.forEach((row, index) => {
      const tripMs = throughput
        ? baseTripMs * fastest / row.value
        : baseTripMs * row.value / fastest;
      const phase = (elapsed / tripMs) % 2;
      const progress = phase <= 1 ? phase : 2 - phase;
      row.ball.style.transform = `translate3d(${distances[index] * progress}px, 0, 0)`;
    });
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
  };

  const tick = (now) => {
    if (lastFrame) elapsed += now - lastFrame;
    lastFrame = now;
    draw();
    frame = requestAnimationFrame(tick);
  };

  const syncMotion = () => {
    replay.hidden = reducedMotion.matches;
    if (reducedMotion.matches || !inView || document.hidden) {
      stop();
      if (reducedMotion.matches) {
        elapsed = 0;
        draw();
      }
    } else if (!frame) {
      frame = requestAnimationFrame(tick);
    }
  };

  race.classList.add("is-ready");
  measure();
  draw();
  replay.addEventListener("click", () => {
    elapsed = 0;
    lastFrame = performance.now();
    draw();
  });
  window.addEventListener("resize", () => {
    measure();
    draw();
  }, { passive: true });
  document.addEventListener("visibilitychange", syncMotion);
  reducedMotion.addEventListener("change", syncMotion);

  const observer = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    syncMotion();
  }, { threshold: 0.1 });
  observer.observe(race);
  syncMotion();
});
