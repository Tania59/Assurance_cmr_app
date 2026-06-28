import { useEffect } from "react";

export function useWebApp() {
  useEffect(() => {
    // 1. Titre de l'application
    document.title = "AssurCRM - Gestion de portefeuille d'assurance";

    // 2. Fonction pour ajouter/modifier les meta tags
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // 3. Meta tags pour le web (version simplifiée)
    setMeta("description", "AssurCRM - Application de gestion de portefeuille d'assurance");
    setMeta("theme-color", "#0A3D6B");
    setMeta("viewport", "width=device-width, initial-scale=1.0");

    // 4. Supprimer le manifest (PWA)
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.remove();
    }

    // 5. Ajouter un style global pour le web
    const style = document.createElement("style");
    style.textContent = `
      /* Reset et styles de base */
      html, body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background-color: #CBD5E1;
        font-family: 'Inter', sans-serif;
      }
      
      #root {
        min-height: 100vh;
        display: flex;
        justify-content: center;
      }
      
      /* Amélioration du scroll sur web */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #F1F1F1;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #D1D5DB;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #9CA3AF;
      }
    `;
    document.head.appendChild(style);

    // 6. Nettoyage (optionnel)
    return () => {
      style.remove();
    };
  }, []);
}