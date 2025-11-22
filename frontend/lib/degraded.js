export class DegradedMode {
  constructor(limit = 3) {
    this.failures = 0;
    this.limit = limit;
  }

  registerFailure() {
    this.failures++;
    if (this.failures >= this.limit) this.showBanner();
  }

  reset() {
    this.failures = 0;
    this.hideBanner();
  }

  showBanner() {
    let el = document.getElementById("degraded");
    if (!el) {
      el = document.createElement("div");
      el.id = "degraded";
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.padding = "12px";
      el.style.background = "darkred";
      el.style.color = "white";
      el.style.textAlign = "center";
      el.style.fontSize = "18px";
      el.innerText = "⚠ Сервер перевантажений, повторіть пізніше";
      document.body.appendChild(el);
    }
  }

  hideBanner() {
    const el = document.getElementById("degraded");
    if (el) el.remove();
  }
}
