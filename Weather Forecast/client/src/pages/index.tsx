import { Helmet } from 'react-helmet';
import Layout from '@/components/layout/Layout';
import CityTable from '@/components/city-table/CityTable';

const HomePage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Weather App - City Directory</title>
        <meta 
          name="description" 
          content="Browse cities worldwide and check their current weather conditions. Search and filter cities by name, country, population, and timezone."
        />
      </Helmet>
      
      <section className="bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Weather Forecast Web App
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Search for cities worldwide and check their current weather conditions and forecasts.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <CityTable />
      </section>
    </Layout>
  );
};

export default HomePage;
