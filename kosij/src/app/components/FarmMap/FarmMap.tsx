/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Dynamic imports để tránh lỗi SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Cấu hình icon marker
if (typeof window !== "undefined") {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
    iconUrl: "/leaflet/images/marker-icon.png",
    shadowUrl: "/leaflet/images/marker-shadow.png",
  });
}

interface Props {
  address: string;
  farmName?: string;
}

const FarmMap: React.FC<Props> = ({ address, farmName }) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCoords = async (address: string) => {
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: address,
              format: "json",
            },
            headers: {
              "Accept-Language": "en",
              "User-Agent": "KosijMap/1.0 (intern@example.com)",
            },
          }
        );

        if (res.data?.length > 0) {
          return {
            lat: parseFloat(res.data[0].lat),
            lon: parseFloat(res.data[0].lon),
          };
        }
        return null;
      } catch (err) {
        console.error("Lỗi khi gọi API lấy tọa độ:", err);
        return null;
      }
    };

    const tryFetchCoordinates = async (initialAddress: string) => {
      let currentAddress = initialAddress;
      const words = currentAddress.split(",").map((word) => word.trim());

      while (words.length > 0 && isMounted) {
        const coords = await fetchCoords(currentAddress);
        if (coords) {
          if (isMounted) {
            setCoordinates(coords);
            setLoading(false);
            setError(false);
          }
          return;
        }

        words.pop();
        currentAddress = words.join(", ");
      }

      if (isMounted) {
        setCoordinates(null);
        setLoading(false);
        setError(true);
      }
    };

    if (address) {
      setLoading(true);
      setError(false);
      tryFetchCoordinates(address);
    }

    return () => {
      isMounted = false;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [address]);

  useEffect(() => {
    if (coordinates && mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coordinates.lat, coordinates.lon],
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.marker([coordinates.lat, coordinates.lon])
        .addTo(map)
        .bindPopup(farmName || "Vị trí trang trại");

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates, farmName]);

  if (loading) {
    return (
      <div style={{ height: "400px", display: "grid", placeItems: "center" }}>
        <DotLottieReact
          src="https://lottie.host/4b5c1bc1-5d91-4bd2-ad30-544c36b49694/Sj2vtdN7jj.lottie"
          loop
          autoplay
          style={{ width: "100px", height: "100px" }}
        />
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div style={{ height: "400px", display: "grid", placeItems: "center" }}>
        Unable to find the address
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    />
  );
};

export default FarmMap;
