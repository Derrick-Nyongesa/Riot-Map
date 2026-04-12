import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

const fallbackCenter = [0, 0];

const reportStyles = {
  Active: { color: "#dc2626", fillColor: "#ef4444" },
  Unverified: { color: "#d97706", fillColor: "#f59e0b" },
  Resolved: { color: "#475569", fillColor: "#64748b" },
};

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    invalidate();
    const t1 = setTimeout(invalidate, 100);
    const t2 = setTimeout(invalidate, 350);

    window.addEventListener("resize", invalidate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  return null;
}

function Recenter({ target }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    map.setView(target, target[0] === 0 && target[1] === 0 ? 2 : 14, {
      animate: true,
    });

    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map, target]);

  return null;
}

function MapClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function MapView({
  currentLocation,
  selectedLocation,
  reports,
  places,
  onSelectLocation,
}) {
  const focusLocation = selectedLocation || currentLocation || fallbackCenter;

  return (
    <div className="map-shell panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Map</p>
          <h2>Live incident view</h2>
        </div>
        <p className="panel-note">Click the map to pick coordinates.</p>
      </div>

      <div className="map-wrap">
        <MapContainer
          className="riot-map"
          center={focusLocation}
          zoom={currentLocation ? 14 : 2}
          scrollWheelZoom={false}
        >
          <MapResizeFix />
          <Recenter target={focusLocation} />
          <MapClickHandler onSelectLocation={onSelectLocation} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {currentLocation && (
            <CircleMarker
              center={currentLocation}
              radius={10}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#60a5fa",
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <strong>Your current location</strong>
              </Popup>
            </CircleMarker>
          )}

          {selectedLocation && (
            <CircleMarker
              center={selectedLocation}
              radius={8}
              pathOptions={{
                color: "#f97316",
                fillColor: "#fb923c",
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <strong>Selected location</strong>
              </Popup>
            </CircleMarker>
          )}

          {reports.map((report) => {
            const style = reportStyles[report.status] || reportStyles.Active;

            return (
              <CircleMarker
                key={report.id}
                center={[report.lat, report.lng]}
                radius={9}
                pathOptions={{
                  color: style.color,
                  fillColor: style.fillColor,
                  fillOpacity: 0.85,
                }}
              >
                <Popup>
                  <div className="popup-card">
                    <strong>{report.title}</strong>
                    <p>{report.description}</p>
                    <span className="tag">{report.status}</span>
                    <span className="tag tag-soft">
                      {report.severity} severity
                    </span>
                    <small>{formatDate(report.createdAt)}</small>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {places.map((place) => (
            <CircleMarker
              key={place.id}
              center={[place.lat, place.lng]}
              radius={8}
              pathOptions={{
                color: "#16a34a",
                fillColor: "#22c55e",
                fillOpacity: 0.85,
              }}
            >
              <Popup>
                <div className="popup-card">
                  <strong>{place.label}</strong>
                  <p>{place.notes || place.type}</p>
                  <span className="tag tag-green">{place.type}</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="map-legend">
          <div>
            <span className="legend-dot blue" />
            You
          </div>
          <div>
            <span className="legend-dot orange" />
            Selected
          </div>
          <div>
            <span className="legend-dot red" />
            Reports
          </div>
          <div>
            <span className="legend-dot green" />
            Important places
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;
