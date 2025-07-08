'use client';

import {useEffect, useState} from "react";
import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs';
import {useRouter} from 'next/navigation'
import {useUser} from '@clerk/nextjs'


const Header = () => {
   const router = useRouter();


   return (
      <div
         className="min-h-screen max-h-full bg-violet-400 flex flex-col justify-between items-center py-6 text-white min-w-80 drop-shadow-[0_0_10px_rgba(166,132,255,1)]">
         <div className="flex flex-col gap-5 items-center w-full px-4">
            <h1
               onClick={() => router.push("/")}
               className="text-3xl font-semibold text-shadow-[0_0px_10px_rgba(255_255_255/_1)] cursor-pointer">
               Text-It.ai
            </h1>

            <a
               className='px-3 py-2 border-1 border-white text-center rounded-lg w-full bg-white text-violet-400 hover:bg-violet-400 hover:text-white shadow-[0_0_10px_rgba(255,255,255,1)] hover:shadow-none transition cursor-pointer'
               onClick={() => router.push('/my-uploads')}
            >My History
            </a>

            <div
               className='px-3 py-2 border-1 text-center border-white rounded-lg w-full flex flex-row items-center justify-center hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,1)] hover:text-violet-400 transition cursor-pointer cursor-pointer'>
               <SignedOut>
                  <SignInButton/>
               </SignedOut>

               <SignedIn>
                  <UserButton afterSignOutUrl="/"/>
               </SignedIn>
            </div>
         </div>
      </div>
   );
};

export default Header;
