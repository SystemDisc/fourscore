'use client';

import Button from '@/components/atoms/button';
import Loading from '@/components/atoms/loading';
import MainCard from '@/components/atoms/main-card';
import { NewAddress } from '@/db/database';
import { notificationContext } from '@/providers/notification-provider';
import { saveAddress } from '@/utils/server-actions';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ConfirmAddress() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const { addNotification } = useContext(notificationContext);

  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map>();
  const [center, setCenter] = useState<google.maps.LatLng>();
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
    null,
  );
  const [isNotExact, setIsNotExact] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    const centerString = localStorage.getItem('center');
    const placeId = localStorage.getItem('placeId');
    if (centerString && placeId) {
      try {
        const center = JSON.parse(centerString);
        setCenter(center);

        const service = new google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: placeId,
          },
          (place, status) => {
            setPlace(place);
            if (place && place.address_components) {
              setMap(map);
              setTimeout(() => setIsLoading(false));
            } else {
              router.replace('/');
            }
          },
        );

        new google.maps.Marker({
          map,
          position: center,
        });
      } catch (e) {
        router.replace('/');
      }
    } else {
      router.replace('/');
    }
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(undefined);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const streetNumber = place?.address_components?.find((a) =>
        a.types.find((t) => t === 'street_number'),
      )?.long_name;
      const route = place?.address_components?.find((a) =>
        a.types.find((t) => t === 'route'),
      )?.short_name;
      const city = place?.address_components?.find((a) =>
        a.types.find((t) => t === 'locality'),
      )?.long_name;
      const state = place?.address_components?.find((a) =>
        a.types.find((t) => t === 'administrative_area_level_1'),
      )?.short_name;
      const zip = place?.address_components?.find((a) =>
        a.types.find((t) => t === 'postal_code'),
      )?.long_name;
      if (
        place &&
        place.address_components &&
        streetNumber &&
        route &&
        city &&
        state &&
        zip
      ) {
        setStreetNumber(streetNumber);
        setRoute(route);
        setCity(city);
        setState(state);
        setZip(zip);
      } else if (place) {
        if (streetNumber) {
          setStreetNumber(streetNumber);
        }
        if (route) {
          setRoute(route);
        }
        if (city) {
          setCity(city);
        }
        if (state) {
          setState(state);
        }
        if (zip) {
          setZip(zip);
        }
        setIsNotExact(true);
      } else {
        router.replace('/');
      }
    }
  }, [isLoading, place]);

  const [streetNumber, setStreetNumber] = useState<string>();
  const [route, setRoute] = useState<string>();
  const [city, setCity] = useState<string>();
  const [state, setState] = useState<string>();
  const [zip, setZip] = useState<string>();

  const confirmAddress = async (address: NewAddress) => {
    if (session && session.user) {
      const createdAddress = await saveAddress(session.user, address);
      if (!createdAddress) {
        addNotification({
          type: 'error',
          message: 'Your address could not be saved. Please try again later.',
        });
        router.replace('/');
      } else {
        router.push('/poll');
      }
    }
  };

  return (
    <>
      {isLoaded && (
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
      )}
      {isLoading && <Loading />}
      {!isLoading && (
        <section className='p-4 text-center flex flex-col gap-4 min-h-[calc(100dvh_-_300px)] md:min-h-0'>
          {isNotExact && (
            <p className='text-red-500'>
              You did not provide a street address. If you do not use your voter
              registration address, you will not be able to utilize some
              features.
            </p>
          )}
          {!isNotExact && (
            <p>Is this the address where you&apos;re registered to vote?</p>
          )}
          <address className='[font-style:normal] text-xl'>
            <div>
              {streetNumber} {route}
            </div>
            <div>
              {city}, {state} {zip}
            </div>
          </address>
          <div className='flex items-center justify-center gap-4'>
            <Button
              onClick={async () => {
                if (session && session.user) {
                  await confirmAddress({
                    userId: 'N/A',
                    streetNumber: streetNumber!,
                    route: route!,
                    city: city!,
                    state: state!,
                    zip: zip!,
                  });
                } else {
                  Cookies.set(
                    'confirmedAddress',
                    JSON.stringify({
                      userId: 'N/A',
                      streetNumber: streetNumber!,
                      route: route!,
                      city: city!,
                      state: state!,
                      zip: zip!,
                    }),
                  );
                  signIn();
                }
              }}
            >
              Yes
            </Button>
            <Button buttonType='white' isLink href='/'>
              Edit
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
