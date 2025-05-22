
export interface Province {
  id: string;
  name: string;
  population: number;
  povertyRate: number;
  urbanPopulationPercentage: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  topCities: {
    name: string;
    povertyRate: number;
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
}

export const provinces: Province[] = [
  {
    id: "punjab",
    name: "Punjab",
    population: 110000000,
    povertyRate: 0.21,
    urbanPopulationPercentage: 0.37,
    coordinates: { lat: 31.1704, lng: 72.7097 },
    topCities: [
      {
        name: "Lahore",
        povertyRate: 0.12,
        coordinates: { lat: 31.5204, lng: 74.3587 }
      },
      {
        name: "Faisalabad",
        povertyRate: 0.19,
        coordinates: { lat: 31.4180, lng: 73.0790 }
      },
      {
        name: "Multan",
        povertyRate: 0.23,
        coordinates: { lat: 30.1984, lng: 71.4687 }
      },
      {
        name: "Rawalpindi",
        povertyRate: 0.10,
        coordinates: { lat: 33.5651, lng: 73.0169 }
      },
      {
        name: "Gujranwala",
        povertyRate: 0.18,
        coordinates: { lat: 32.1617, lng: 74.1883 }
      },
      {
        name: "Muzaffargarh",
        povertyRate: 0.41,
        coordinates: { lat: 30.0747, lng: 71.1893 }
      },
      {
        name: "Rajanpur",
        povertyRate: 0.48,
        coordinates: { lat: 29.1041, lng: 70.3297 }
      }
    ]
  },
  {
    id: "sindh",
    name: "Sindh",
    population: 47890000,
    povertyRate: 0.31,
    urbanPopulationPercentage: 0.52,
    coordinates: { lat: 25.8943, lng: 68.5247 },
    topCities: [
      {
        name: "Karachi",
        povertyRate: 0.19,
        coordinates: { lat: 24.8607, lng: 67.0011 }
      },
      {
        name: "Hyderabad",
        povertyRate: 0.27,
        coordinates: { lat: 25.3960, lng: 68.3578 }
      },
      {
        name: "Sukkur",
        povertyRate: 0.34,
        coordinates: { lat: 27.7055, lng: 68.8522 }
      },
      {
        name: "Larkana",
        povertyRate: 0.39,
        coordinates: { lat: 27.5600, lng: 68.2264 }
      },
      {
        name: "Tharparkar",
        povertyRate: 0.54,
        coordinates: { lat: 24.7368, lng: 70.1823 }
      }
    ]
  },
  {
    id: "kpk",
    name: "Khyber Pakhtunkhwa",
    population: 35530000,
    povertyRate: 0.27,
    urbanPopulationPercentage: 0.21,
    coordinates: { lat: 34.9526, lng: 72.3311 },
    topCities: [
      {
        name: "Peshawar",
        povertyRate: 0.18,
        coordinates: { lat: 34.0151, lng: 71.5249 }
      },
      {
        name: "Mardan",
        povertyRate: 0.29,
        coordinates: { lat: 34.1989, lng: 72.0231 }
      },
      {
        name: "Abbottabad",
        povertyRate: 0.14,
        coordinates: { lat: 34.1463, lng: 73.2115 }
      },
      {
        name: "Swat",
        povertyRate: 0.31,
        coordinates: { lat: 34.9479, lng: 72.3311 }
      },
      {
        name: "Bannu",
        povertyRate: 0.38,
        coordinates: { lat: 32.9889, lng: 70.6056 }
      }
    ]
  },
  {
    id: "balochistan",
    name: "Balochistan",
    population: 12340000,
    povertyRate: 0.37,
    urbanPopulationPercentage: 0.29,
    coordinates: { lat: 28.4907, lng: 65.0958 },
    topCities: [
      {
        name: "Quetta",
        povertyRate: 0.22,
        coordinates: { lat: 30.1798, lng: 66.9750 }
      },
      {
        name: "Gwadar",
        povertyRate: 0.28,
        coordinates: { lat: 25.1264, lng: 62.3225 }
      },
      {
        name: "Turbat",
        povertyRate: 0.41,
        coordinates: { lat: 26.0031, lng: 63.0544 }
      },
      {
        name: "Sibi",
        povertyRate: 0.39,
        coordinates: { lat: 29.5430, lng: 67.8772 }
      },
      {
        name: "Khuzdar",
        povertyRate: 0.46,
        coordinates: { lat: 27.8120, lng: 66.6165 }
      }
    ]
  }
];

export interface PovertyIndicator {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export const indicators: PovertyIndicator[] = [
  {
    id: "light",
    name: "Light Intensity",
    description: "Satellite measurements of nighttime light emissions, indicating electricity access and infrastructure development",
    weight: 0.30
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Density of schools, utilities, and public services",
    weight: 0.25
  },
  {
    id: "economic",
    name: "Economic Activity",
    description: "Retail presence, brand distribution, and property values",
    weight: 0.25
  },
  {
    id: "health",
    name: "Health Access",
    description: "Proximity and availability of healthcare facilities",
    weight: 0.20
  }
];

export interface PovertyStatistic {
  id: string;
  title: string;
  value: string;
  change: number;
  description: string;
}

export const stats: PovertyStatistic[] = [
  {
    id: "total-population",
    title: "Total Population in Poverty",
    value: "50.2M",
    change: -2.5,
    description: "Estimated population living below the national poverty line"
  },
  {
    id: "poverty-rate",
    title: "National Poverty Rate",
    value: "24%",
    change: -1.2,
    description: "Percentage of population living in poverty"
  },
  {
    id: "rural-poverty",
    title: "Rural Poverty Rate",
    value: "31%",
    change: -0.7,
    description: "Poverty rate in rural areas"
  },
  {
    id: "urban-poverty",
    title: "Urban Poverty Rate",
    value: "18%",
    change: -1.5,
    description: "Poverty rate in urban areas"
  }
];

export interface DataSource {
  id: string;
  name: string;
  type: string;
  description: string;
  lastUpdated: string;
}

export const dataSources: DataSource[] = [
  {
    id: "light-intensity",
    name: "NASA Black Marble",
    type: "Satellite",
    description: "Nighttime light intensity data from NASA's Black Marble and NOAA's VIIRS dataset",
    lastUpdated: "2023-09-15"
  },
  {
    id: "schools",
    name: "Google Maps API (Schools)",
    type: "API",
    description: "School and educational institution locations across Pakistan",
    lastUpdated: "2023-10-01"
  },
  {
    id: "retail",
    name: "Google Maps API (Retail)",
    type: "API",
    description: "Retail and utility locations for commerce index",
    lastUpdated: "2023-10-01"
  },
  {
    id: "brands",
    name: "Golootlo",
    type: "Web Scraping",
    description: "Distribution of national vs. international brands",
    lastUpdated: "2023-09-20"
  },
  {
    id: "property",
    name: "Zameen.com",
    type: "Web Scraping",
    description: "Property rates and listings across Pakistan",
    lastUpdated: "2023-10-05"
  },
  {
    id: "health",
    name: "PHIMC + Ministry of Health",
    type: "Manual + API",
    description: "Health facility locations and accessibility data",
    lastUpdated: "2023-08-12"
  }
];

export const timeSeriesData = {
  years: ["2018", "2019", "2020", "2021", "2022", "2023"],
  series: [
    {
      name: "Punjab",
      data: [26.3, 25.1, 24.8, 23.5, 22.0, 21.0]
    },
    {
      name: "Sindh",
      data: [37.8, 36.5, 35.9, 34.2, 32.8, 31.0]
    },
    {
      name: "KPK",
      data: [32.5, 31.8, 30.9, 29.5, 28.1, 27.0]
    },
    {
      name: "Balochistan",
      data: [42.3, 41.5, 40.8, 39.6, 38.2, 37.0]
    }
  ]
};

export const povertyComparisonData = {
  categories: ["Urban", "Rural", "Overall"],
  series: [
    {
      name: "Punjab",
      data: [14.5, 26.2, 21.0]
    },
    {
      name: "Sindh",
      data: [19.8, 43.1, 31.0]
    },
    {
      name: "KPK",
      data: [16.2, 30.1, 27.0]
    },
    {
      name: "Balochistan",
      data: [22.1, 45.6, 37.0]
    },
    {
      name: "National",
      data: [18.0, 31.0, 24.0]
    }
  ]
};

export const indicatorsData = {
  punjab: {
    light: 0.75,
    infrastructure: 0.68,
    economic: 0.72,
    health: 0.65
  },
  sindh: {
    light: 0.62,
    infrastructure: 0.57,
    economic: 0.65,
    health: 0.54
  },
  kpk: {
    light: 0.58,
    infrastructure: 0.52,
    economic: 0.60,
    health: 0.58
  },
  balochistan: {
    light: 0.45,
    infrastructure: 0.41,
    economic: 0.52,
    health: 0.38
  }
};
