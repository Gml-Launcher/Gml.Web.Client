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

Create a `.env` file in the root of the project and add the following configuration:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
```

Replace `http://localhost:5000/api/v1` with the actual URL of your Gml Launcher backend API if different.

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

## Building for Production

To create a production-ready build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Environment Variables

| Variable                  | Description                         | Default Value                  |
|---------------------------|-------------------------------------|--------------------------------|
| `NEXT_PUBLIC_BACKEND_URL` | URL of the Gml Launcher backend API | `http://localhost:5000/api/v1` |

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