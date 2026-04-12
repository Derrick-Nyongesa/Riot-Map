# Riot Map

These days it seems that people are protesting about one thing or another. Most of these protests can be peaceful but others morph into violent running battles with police and rioters. There are looting and destruction of public and private property. No one really wants to find themselves in the middle of that.
Riot Map is a React + Firebase web application allows users to view areas prone to riots and also allow users to post areas where the riots are happening. It uses a clean responsive interface, geolocation, and local persistence for reported incidents and saved locations.

## Features

- Google sign-in authentication with Firebase
- View your current location on the map
- Click the map or enter coordinates manually to place a riot report
- Save important places with custom labels and notes
- View reported riot markers and saved places on the map
- Search and filter reports and places
- Responsive layout for desktop and mobile
- Persistent data using `localStorage`

## Tech Stack

- React
- React Router
- Firebase Authentication
- React Leaflet + Leaflet
- CSS in `index.css`

## Project Structure

```text
src/
├── components/
│   ├── Header.js
│   ├── IncidentForm.js
│   ├── MapView.js
│   └── PlacesForm.js
├── context/
│   ├── AuthContext.js
│   └── RiotContext.js
├── pages/
│   ├── Authentication.js
│   └── Home.js
├── App.js
├── PrivateRoute.js
├── firebase.js
├── index.js
└── index.css
```

## Prerequisites

- Node.js 18 or newer
- npm or yarn
- A Firebase project with Google Authentication enabled

## Firebase Setup

Create a `.env` file in the project root and add your Firebase values:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Also make sure Google sign-in is enabled in your Firebase Authentication settings.

## Installation

```bash
npm install
```

If you have not installed the map dependencies yet:

```bash
npm install react-leaflet leaflet
```

## Development

```bash
npm start
```

The app will run on `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

## How It Works

### Authentication

Users sign in with Google. Protected routes are handled through `PrivateRoute` and `AuthContext`.

### Map View

The main dashboard shows:

- your current location, when permission is allowed
- selected coordinates
- riot markers
- saved important places

### Reporting a Riot Location

You can:

- click the map to choose coordinates
- enter latitude and longitude manually
- submit a title, severity, status, and description

### Saving Important Places

You can store locations like:

- Home
- Work
- School
- Other important places

### Search and Filters

Search works across report and place names, descriptions, notes, statuses, severities, and coordinates.

## Data Storage

This app uses `localStorage` for riot reports and saved places. That means the data stays on the device and browser profile where it was created.

## Notes

- The map is powered by OpenStreetMap tiles through React Leaflet.
- The app is styled entirely through `src/index.css`.
- The layout is responsive and adapts to smaller screens.

## License

This project is provided for educational and demo purposes.
