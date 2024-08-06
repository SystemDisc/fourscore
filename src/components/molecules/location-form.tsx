'use client';

import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Button from '../atoms/button';
import LinkWithBackDetection from './link-with-back-detection';

export default function LocationForm() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const router = useRouter();

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>();

  const onPlaceChanged = useCallback(() => {
    const place = autocomplete!.getPlace();
    if (place) {
      const streetNumber = place.address_components?.find((a) => a.types.find((t) => 'street_number'));

      localStorage.setItem('center', JSON.stringify(place.geometry?.location));
      localStorage.setItem('placeId', place.place_id || '');

      if (streetNumber) {
        router.push('/confirm-address');
      } else {
        router.push('/edit-address');
      }
    }
  }, [autocomplete, router]);

  const onLoad = useCallback((newAutocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(newAutocomplete);
  }, []);

  return (
    <div className='min-h-[calc(100dvh_-_2.75rem_-_2rem_-_3rem)] flex items-center md:justify-start content-center flex-wrap md:pl-20 p-0 justify-center px-4 md:px-0'>
      <div className='md:w-full text-7xl font-black text-[#443423] mb-10 mt-4'>
        <div className='max-w-xl w-full text-center'>We Believe.</div>
      </div>
      <form
        className='flex items-center justify-start max-w-xl w-full mb-5 border border-black rounded-full overflow-hidden bg-white has-[:focus]:outline has-[:focus]:outline-2'
        onSubmit={(e) => {
          e.preventDefault();
          onPlaceChanged();
        }}
      >
        {isLoaded && (
          <Autocomplete
            onPlaceChanged={onPlaceChanged}
            onLoad={onLoad}
            className='w-[calc(100%_-_64px)]'
          >
            <input
              className='w-full h-16 pl-4 text-xl bg-transparent border-none focus-visible:outline-none'
              type='text'
              placeholder='Voter Registration Address'
            />
          </Autocomplete>
        )}
        {!isLoaded && (
          <input
            className='w-[calc(100%_-_64px)] h-16 pl-4 text-xl bg-transparent border-none focus-visible:outline-none'
            type='text'
            placeholder='Voter Registration Address'
          />
        )}
        <Button className='h-14 w-14 ml-1 text-4xl !px-0 !pt-0 pb-3 font-bold !tracking-normal'>go</Button>
      </form>
      <div className='md:w-full text-[#f99000] text-2xl'>
        <div className='max-w-xl w-full text-center text-stroke mb-4 font-bold'>
          Find your perfect political candidate
        </div>
        <div className='max-w-xl w-full text-center'>
          <LinkWithBackDetection
            className='mb-2'
            isButton
            href='/candidates'
          >
            View Candidates
          </LinkWithBackDetection>
          <br />
          <div className='text-sm tracking-wider text-stroke'>
            <Link href='/candidate'>
              Are you a candidate?
              <br />
              <span className='underline'>Discover how FourScore can boost your campaign and sign up today!</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
