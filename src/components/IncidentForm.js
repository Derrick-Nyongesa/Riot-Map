import { useEffect, useState } from "react";

const initialState = {
  title: "",
  severity: "Medium",
  status: "Active",
  description: "",
  lat: "",
  lng: "",
};

function IncidentForm({
  selectedLocation,
  currentLocation,
  onUseCurrentLocation,
  onClearLocation,
  onSubmit,
}) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedLocation) {
      setForm((current) => ({
        ...current,
        lat: String(selectedLocation[0]),
        lng: String(selectedLocation[1]),
      }));
    } else {
      setForm((current) => ({
        ...current,
        lat: "",
        lng: "",
      }));
    }
  }, [selectedLocation]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const lat = Number(form.lat);
    const lng = Number(form.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("Enter valid latitude and longitude.");
      return;
    }

    if (!form.title.trim()) {
      setError("Add a short title for the report.");
      return;
    }

    onSubmit({
      ...form,
      lat,
      lng,
    });

    setForm(initialState);
    setError("");
  };

  const coordsText =
    form.lat && form.lng
      ? `${form.lat}, ${form.lng}`
      : "No coordinates entered yet";

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Report</p>
          <h2>Set a riot location</h2>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Example: Road blocked near market"
          />
        </label>

        <div className="coords-grid">
          <label className="field">
            <span>Latitude</span>
            <input
              name="lat"
              value={form.lat}
              onChange={handleChange}
              inputMode="decimal"
              placeholder="-1.2921"
            />
          </label>

          <label className="field">
            <span>Longitude</span>
            <input
              name="lng"
              value={form.lng}
              onChange={handleChange}
              inputMode="decimal"
              placeholder="36.8219"
            />
          </label>
        </div>

        <div className="two-col">
          <label className="field">
            <span>Severity</span>
            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>Unverified</option>
              <option>Resolved</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Add safe, useful details for people who need to avoid the area."
          />
        </label>

        <div className="location-box">
          <div>
            <p className="location-label">Coordinates</p>
            <p className="location-value">{coordsText}</p>
          </div>

          <div className="location-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onUseCurrentLocation}
              disabled={!currentLocation}
            >
              Use current location
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClearLocation}
              disabled={!selectedLocation && !form.lat && !form.lng}
            >
              Clear
            </button>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary btn-full" type="submit">
          Post incident
        </button>
      </form>
    </section>
  );
}

export default IncidentForm;
