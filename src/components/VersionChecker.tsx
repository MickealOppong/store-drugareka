import { useEffect } from "react";

declare const __APP_VERSION__: string;

const VersionChecker = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(
          `/version.json?t=${Date.now()}`,
          { cache: "no-store" }
        );

        if (!response.ok) return;

        const { version } = await response.json();

        if (version && version !== __APP_VERSION__) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Version check failed:", error);
      }
    };

    const interval = window.setInterval(checkVersion, 60000);

    return () => window.clearInterval(interval);
  }, []);

  return null;
};

export default VersionChecker;