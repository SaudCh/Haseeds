import "bootstrap/dist/css/bootstrap.css";
import "../styles/style.css";
import "../styles/responsive-style.css";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
