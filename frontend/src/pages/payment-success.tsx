'use client';

import React from 'react';
import Header from '../../components/Header'


const UploadsPage = () => {


   return (
      <div className='flex flex-row'>
         <Header/>

         <div className='flex flex-col items-center justify-center w-full'>
            <p className='text-violet-400'>Payment successfully!</p>
         </div>
      </div>
   );
};

export default UploadsPage;
