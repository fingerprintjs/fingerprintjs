(function () {
  "use strict";

  const element = document.currentScript;
  const config = element.dataset;
  let agentPromise;

  function cookie(name) {
    const prefix = name + "=";
    const item = document.cookie.split(";").map(v => v.trim())
      .find(v => v.startsWith(prefix));
    return item ? decodeURIComponent(item.slice(prefix.length)) : "";
  }

  function recentlyRegistered() {
    try {
      const timestamp = Number(sessionStorage.getItem(config.fpjsCacheKey));
      return timestamp && Date.now() - timestamp < Number(config.fpjsCacheTtl) * 1000;
    } catch (_) {
      return false;
    }
  }

  function loadAgent() {
    if (!agentPromise) {
      agentPromise = import(config.fpjsScriptUrl).then(module => module.load());
    }
    return agentPromise;
  }

  async function register(options) {
    options = options || {};
    if (!options.force && recentlyRegistered()) return { cached: true };

    const agent = await loadAgent();
    const result = await agent.get();
    const response = await fetch(config.fpjsEndpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": config.fpjsCsrfToken || cookie("csrftoken")
      },
      body: JSON.stringify({ visitor_id: result.visitorId })
    });
    if (!response.ok) throw new Error("Fingerprint registration failed: " + response.status);

    try { sessionStorage.setItem(config.fpjsCacheKey, String(Date.now())); } catch (_) {}
    return response.json();
  }

  window.DjangoFingerprintJS = { register: register };
  const mayAutoRegister = config.fpjsAuto === "true" && config.fpjsConsent !== "true";
  if (mayAutoRegister) {
    register().catch(error => console.warn("DjangoFingerprintJS:", error));
  }
})();
