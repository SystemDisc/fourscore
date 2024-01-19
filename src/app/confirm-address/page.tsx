'use client';

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

export default function Page() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map>();
  const [center, setCenter] = useState<google.maps.LatLng>();
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    const centerString = localStorage.getItem('center');
    const placeId = localStorage.getItem('placeId') as string;
    if (centerString) {
      const center = JSON.parse(centerString);
      setCenter(center);

      const service = new google.maps.places.PlacesService(map);
      console.log(placeId);
      service.getDetails({
        placeId: placeId,
      }, (place, status) => {
        console.log({place, status});
        setPlace(place);
      })

      new google.maps.Marker({
        map,
        position: center,
      });
    }
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(undefined);
  }, []);

  return (
    <main className='max-w-2xl mx-auto md:my-4 md:border md:border-neutral-300 md:rounded-lg md:shadow-[#000_0px_2px_2px]'>
      {isLoaded &&
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '300px',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
          }}
          center={center}
          zoom={17}
          onLoad={onLoad}
          onUnmount={onUnmount}
        />
      }
      <section className='p-4 text-center grid gap-4'>
        <p>
          Is this the address where you&apos;re registered to vote?
        </p>
        <address className='[font-style:normal] text-xl'>
          <div>{place?.address_components?.find((a) => a.types.find((t) => t === 'street_number'))?.long_name} {place?.address_components?.find((a) => a.types.find((t) => t === 'route'))?.short_name}</div>
          <div>{place?.address_components?.find((a) => a.types.find((t) => t === 'locality'))?.long_name}, {place?.address_components?.find((a) => a.types.find((t) => t === 'administrative_area_level_1'))?.long_name} {place?.address_components?.find((a) => a.types.find((t) => t === 'postal_code'))?.long_name}</div>
        </address>
      </section>
    </main>
  );
}
