import { useEffect, useState } from "react";

const initialState = {
  label: "",
  type: "Home",
  notes: "",
  lat: "",
  lng: "",
};

function PlacesForm({
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

    if (!form.label.trim()) {
      setError("Add a name for the place.");
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
          <p className="eyebrow">Places</p>
          <h2>Save important areas</h2>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="Home, Work, School, etc."
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

        <label className="field">
          <span>Type</span>
          <select name="type" value={form.type} onChange={handleChange}>
            <option>Home</option>
            <option>Work</option>
            <option>School</option>
            <option>Other</option>
          </select>
        </label>

        <label className="field">
          <span>Notes</span>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add a landmark, gate, building name, or anything useful."
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
          Save place
        </button>
      </form>
    </section>
  );
}

export default PlacesForm;
