import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import MapView from "../components/MapView";
import IncidentForm from "../components/IncidentForm";
import PlacesForm from "../components/PlacesForm";
import { useRiot } from "../context/RiotContext";

function formatCoords(coords) {
  if (!coords) return "Not set";
  return `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}

function matchesQuery(item, query, fields) {
  if (!query) return true;
  const haystack = fields.map((field) => normalize(field)).join(" | ");
  return haystack.includes(query);
}

function Home() {
  const { reports, places, addReport, removeReport, addPlace, removePlace } =
    useRiot();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(coords);
        setSelectedLocation(coords);
        setLocationError("");
      },
      (error) => {
        setLocationError(
          error.message ||
            "Location access was blocked. You can still use the map manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  const query = normalize(search);

  const visibleReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesSeverity =
        severityFilter === "All" || item.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSearch = matchesQuery(item, query, [
        item.title,
        item.description,
        item.status,
        item.severity,
        item.lat,
        item.lng,
      ]);

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [reports, query, severityFilter, statusFilter]);

  const visiblePlaces = useMemo(() => {
    return places.filter((item) =>
      matchesQuery(item, query, [
        item.label,
        item.type,
        item.notes,
        item.lat,
        item.lng,
      ]),
    );
  }, [places, query]);

  const clearSelectedLocation = () => setSelectedLocation(null);

  const useCurrentLocation = () => {
    if (currentLocation) setSelectedLocation(currentLocation);
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="home-layout">
        <section className="sidebar">
          <section className="panel">
            <p className="eyebrow">Overview</p>
            <h1>Riot Map dashboard</h1>
            <p className="intro-text">
              View incidents near you, save important places, and drop a report
              when something is happening.
            </p>

            <div className="stats-grid">
              <article className="stat-card">
                <strong>{visibleReports.length}</strong>
                <span>Reports visible</span>
              </article>
              <article className="stat-card">
                <strong>{visiblePlaces.length}</strong>
                <span>Saved places</span>
              </article>
            </div>

            <div className="search-grid">
              <label className="field">
                <span>Search</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, notes, type, or coordinates"
                />
              </label>

              <div className="two-col">
                <label className="field">
                  <span>Severity</span>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                  >
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>

                <label className="field">
                  <span>Status</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Unverified</option>
                    <option>Resolved</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="location-banner">
              <p className="location-label">Current location</p>
              <p className="location-value">{formatCoords(currentLocation)}</p>
              {locationError && <p className="error-text">{locationError}</p>}
            </div>
          </section>

          <IncidentForm
            selectedLocation={selectedLocation}
            currentLocation={currentLocation}
            onUseCurrentLocation={useCurrentLocation}
            onClearLocation={clearSelectedLocation}
            onSubmit={(payload) => addReport(payload)}
          />

          <PlacesForm
            selectedLocation={selectedLocation}
            currentLocation={currentLocation}
            onUseCurrentLocation={useCurrentLocation}
            onClearLocation={clearSelectedLocation}
            onSubmit={(payload) => addPlace(payload)}
          />

          <section className="panel list-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Reports</p>
                <h2>Recent riot markers</h2>
              </div>
            </div>

            {visibleReports.length === 0 ? (
              <p className="empty-state">
                No reports match your search or filters.
              </p>
            ) : (
              <div className="list-stack">
                {visibleReports.map((report) => (
                  <article className="list-item" key={report.id}>
                    <div>
                      <div className="list-topline">
                        <h3>{report.title}</h3>
                        <span
                          className={`tag tag-${report.status.toLowerCase()}`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p>{report.description}</p>
                      <p className="meta-text">
                        {report.severity} severity · {report.lat.toFixed(4)},{" "}
                        {report.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeReport(report.id)}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel list-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Places</p>
                <h2>Saved important areas</h2>
              </div>
            </div>

            {visiblePlaces.length === 0 ? (
              <p className="empty-state">No places match your search.</p>
            ) : (
              <div className="list-stack">
                {visiblePlaces.map((place) => (
                  <article className="list-item" key={place.id}>
                    <div>
                      <div className="list-topline">
                        <h3>{place.label}</h3>
                        <span className="tag tag-green">{place.type}</span>
                      </div>
                      <p>{place.notes || "No notes added."}</p>
                      <p className="meta-text">
                        {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => removePlace(place.id)}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <section className="map-panel">
          <MapView
            currentLocation={currentLocation}
            selectedLocation={selectedLocation}
            reports={visibleReports}
            places={visiblePlaces}
            onSelectLocation={setSelectedLocation}
          />
        </section>
      </main>
    </div>
  );
}

export default Home;
