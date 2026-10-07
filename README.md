![Frame 39264](https://github.com/user-attachments/assets/dd3d0f5d-3b19-496f-ac52-8547566103bc)

# Gml.Web.Client

A modern web client for the Gml Launcher, built with Next.js. This project provides a user-friendly interface to
interact with the Gml Launcher's backend services.

## Features

- Seamless integration with the Gml Launcher backend
- Responsive and intuitive UI
- Real-time interaction with launcher functionalities
- Easy configuration via environment variables

## Prerequisites

- [Node.js](https://nodejs.org/) (v17 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Access to the Gml Launcher backend API

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Gml-Launcher/Gml.Web.Client.git
cd Gml.Web.Client
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Configure Environment Variables

The development server proxies API and WebSocket requests to the local backend on port
5002 and skin requests to port 5086. To use different upstreams, create `.env.development.local`:

```env
DEV_BACKEND_URL=http://127.0.0.1:5002
DEV_SKINS_URL=http://127.0.0.1:5086
```

These variables are server-side only. Browser requests use the frontend origin, including
`/api/v1` and `/ws`; no separate browser-facing backend URL is needed. Restart the development
server after changing upstreams.

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

Development routing follows Angie's `gml-routes.conf`: `/api*`, `/swagger*`, `/ws*`, and
exact `/health` retain their paths; `/skins` and `/skins/*` strip the `/skins` prefix.
The root redirects to `/mnt` while setup is needed. Once installed, `/mnt` and its nested
pages redirect to `/`. An unavailable API or a setup check exceeding three seconds leaves
the root reachable and redirects `/mnt` to `/`.

For the complete backend repository, open `Gml.Backend.sln` in Rider and run **GML Development**,
or use `./scripts/dev.sh` from its root on Linux/macOS.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

The development proxy and setup check are disabled for production. Run the production
frontend behind Angie, which supplies API, skins, and setup routing.

## Environment Variables

- `DEV_BACKEND_URL`: development API upstream; defaults to `http://127.0.0.1:5002`.
- `DEV_SKINS_URL`: development skins upstream; defaults to `http://127.0.0.1:5086`.
- `NEXT_PUBLIC_BACKEND_URL`: optional setup form placeholder; requests use the frontend origin.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add your feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Contact

For issues or questions, please open an issue on
the [GitHub Issues page](https://github.com/Gml-Launcher/Gml.Web.Client/issues).
