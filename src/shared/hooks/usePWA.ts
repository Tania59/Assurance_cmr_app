import { useEffect } from "react";

export function usePWA() {
  useEffect(() => {
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("theme-color", "#0A3D6B");
    setMeta("apple-mobile-web-app-capable", "yes");
    setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
    setMeta("apple-mobile-web-app-title", "AssurCRM");
    setMeta("mobile-web-app-capable", "yes");
    setMeta("application-name", "AssurCRM");
    setMeta(
      "viewport",
      "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no"
    );

    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "manifest";
      document.head.appendChild(link);
    }
    link.href = "/manifest.json";

    if ("serviceWorker" in navigator) {
      const swCode = `
        const CACHE="assur-crm-v1";
        self.addEventListener("install",e=>{self.skipWaiting();});
        self.addEventListener("activate",e=>{self.clients.claim();});
        self.addEventListener("fetch",e=>{
          if(e.request.method!=="GET")return;
          e.respondWith(
            caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
              if(r.ok){const cl=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,cl));}
              return r;
            }))
          );
        });
      `;
      const blob = new Blob([swCode], { type: "application/javascript" });
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl).catch(() => {});
    }
  }, []);
}