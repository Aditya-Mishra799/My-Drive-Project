import { UAParser } from "ua-parser-js";

const captureClickData = async (req) => {
  const parser = new UAParser(req.headers["user-agent"]);

  // Extract real IP safely
  const fwd = req.headers["x-forwarded-for"];
  let ip = fwd ? fwd.split(",")[0].trim() : req.socket.remoteAddress;

  // If localhost or invalid IP - skip geolocation
  const isLocal = !ip || ip === "::1" || ip.startsWith("192.") || ip.startsWith("127.") || ip.startsWith("10.");

  const captured = {
    ip_address: ip,
    language: req.headers["accept-language"] || null,
    referrer: req.headers["referer"] || null,
    user_agent: req.headers["user-agent"] || "Unknown",
    device_type: parser.getDevice().type || "desktop",
    os_used: parser.getOS().name || "Unknown",
    browser: parser.getBrowser().name || "Unknown",
    country: "Unknown",
    region: "Unknown",
    city: "Unknown",
    latitude: null,
    longitude: null,
  };

  // Fetch geo only if real public IP
  if (!isLocal) {
    try {
      const token = process.env.IP_INFO_TOKEN
      const res = await fetch(`https://ipinfo.io/${ip}/json?token=${token}`);
      const data = await res.json();

      if (!data.error) {
        captured.country = data.country || "Unknown";
        captured.region = data.region || "Unknown";
        captured.city = data.city || "Unknown";

        if (data.loc) {
          const [lat, lon] = data.loc.split(",");
          captured.latitude = lat;
          captured.longitude = lon;
        }
      }
    } catch (e) {
      console.log("[Log Error] Unable to capture click data", e)
    }
  }

  return captured;
};

export default captureClickData;
