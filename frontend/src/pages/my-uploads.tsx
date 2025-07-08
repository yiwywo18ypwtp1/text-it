'use client';

import React, {useEffect, useState} from 'react';
import {useUser} from '@clerk/nextjs';
import axios from 'axios';
import Header from "../../components/Header"

type Upload = {
   id: number;
   result: string | null;
   createdAt: string;
   paid: boolean;
};

const UploadsPage = () => {
   const {user} = useUser();

   const [uploads, setUploads] = useState<Upload[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!user) return;

      setLoading(true);
      axios.get('https://text-it-hu9a.vercel.app/api/upload/my', {
         headers: {'x-clerk-user-id': user.id}
      })
         .then(res => setUploads(res.data))
         .catch(() => setError('Failed to load uploads'))
         .finally(() => setLoading(false));
   }, [user]);

   if (!user) return <p className='text-center text-violet-400'>Please, sign in to see your uploads</p>;

   if (loading) return <p className='text-center text-violet-400'>Loading uploads...</p>;

   if (error) return <p className="text-red-400 animate-pulse">{error}</p>;

   if (uploads.length === 0) return <p className='text-center text-violet-400'>U have no uploads yet :(</p>;

   return (
      <div className='flex flex-row'>
         <Header/>

         <div className='flex flex-col items-center justify-center'>
            <div className="flex flex-col gap-5 w-1/3 mt-25">
               {uploads.map(upload => (
                  <div key={upload.id} className="border-1 p-3 rounded-2xl border-violet-400 text-violet-400/85 cursor-pointer hover:scale-105 transition duration-300">
                     <p><b>Created at:</b> {new Date(upload.createdAt).toLocaleString()}</p>
                     <p><b>Upload ID:</b> {upload.id}</p>
                     <p><b>Paid:</b> {upload.paid ? 'Yes' : 'No'}</p>
                     <p><b>Result:</b></p>
                     <pre className="whitespace-pre-wrap">{upload.result || 'Processing...'}</pre>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default UploadsPage;
