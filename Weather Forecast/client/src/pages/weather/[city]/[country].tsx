import { useEffect } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import Layout from "@/components/layout/Layout";
import WeatherDisplay from "@/components/weather/WeatherDisplay";

const WeatherPageWithCountry = () => {
  const params = useParams<{ city: string; country: string }>();
  const city = params.city ? decodeURIComponent(params.city) : "";
  const country = params.country ? decodeURIComponent(params.country) : "";

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayName = country ? `${city}, ${country}` : city;

  return (
    <Layout>
      <Helmet>
        <title>{`Weather in ${displayName} - Weather App`}</title>
        <meta
          name="description"
          content={`Current weather conditions and 5-day forecast for ${displayName}. View temperature, humidity, wind, and more.`}
        />
      </Helmet>

      <WeatherDisplay city={city} country={country} />
    </Layout>
  );
};

export default WeatherPageWithCountry;
