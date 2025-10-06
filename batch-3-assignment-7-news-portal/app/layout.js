import "./globals.css";

export const metadata = {
  title: "News App",
  description: "Get your todays news",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
