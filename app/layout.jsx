import "./globals.css";

export const metadata = {
  title: "Dev Portfolio | Web Developer",
  description:
    "Full-stack developer specializing in React.js, React Native, and Android development.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
