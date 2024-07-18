'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import Button from '@/components/atoms/button';
import Star from '@/components/atoms/star';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function ProfileBanner({
  profile
}: {
  profile?: {
    answeredQuestions: {
        count: string | number | bigint;
    } | undefined;
    totalQuestions: {
        count: string | number | bigint;
    } | undefined;
    candidateUserScore: {
      score: number;
    } | undefined;
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null; 
    seenVotingTutorial: boolean;
  }
}) {
  const [imageSrc, setImageSrc] = useState('https://via.placeholder.com/150');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImageSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const pollCompleteness = ()  => {
    if (profile?.totalQuestions?.count) {
      return Math.round(Number(profile.answeredQuestions?.count || 0) * 100 / Number(profile.totalQuestions.count))
    }
    return 0;
  }

  useEffect(() => {
    setImageSrc(profile?.image || 'https://via.placeholder.com/150')
  }, [profile])


  return (
    <div className='flex flex-col justify-between gap-6 p-4' style={{background: "linear-gradient(45deg, rgb(33, 34, 37), rgb(67, 70, 74), rgb(33, 34, 37))"}}>
      <div className='flex flex-col'>
        <div className='text-lg text-white'>
          Abe Lincoln
        </div>
        <div className='text-xs text-white'>
          For: Texas Railroad Commission
        </div>
      </div>

      <div className='flex flex-row justify-around'>
        <div className="relative w-36 h-36 rounded-full overflow-hidden cursor-pointer group">
          <Image 
            loader={() => imageSrc}
            src={imageSrc} 
            alt="Profile" 
            layout="fill"
            objectFit="cover" 
            className="w-full h-full"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-white">Edit</span>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div>
            <div className='text-sm text-white uppercase'>
              Poll complete
            </div>
            <div className='text-lg text-white uppercase'>
              {pollCompleteness()}%
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='text-sm text-white uppercase'>
              Fourscore
            </div>
            <div className='flex flex-row items-center gap-2'>
              <div className='text-lg text-white uppercase'>
                {profile?.candidateUserScore?.score}%
              </div>
              <Star rate={4} />
            </div>
            
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-between'>
        <Button isLink href='/candidate-matches' className='text-sm uppercase'>
          Pledge
        </Button>

        <Button onClick={() => signOut()} className='text-sm uppercase'>
          Candidate Answers
        </Button>
      </div>
    </div>
  );
}
