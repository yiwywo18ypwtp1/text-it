'use client'; // щоб клєрковський useUser() працював

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation'
import {useUser} from '@clerk/nextjs';
import axios from 'axios';

const UploadFile = () => {
   const {user} = useUser();
   const [canUpload, setCanUpload] = useState<boolean>(true);

   const [file, setFile] = useState<File | null>(null);
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const router = useRouter();

   useEffect(() => {
      const fetchUploadStatus = async () => {
         if (!user?.id) return;

         try {
            const res = await axios.get(`https://text-it-8kzf.onrender.com/api/users/me`, {
               headers: {
                  'x-clerk-user-id': user.id,
               },
            });

            const {isPro, uploads} = res.data;
            if (!isPro && uploads.length >= 2) {
               setCanUpload(false);
            }
         } catch (err) {
            console.error('Failed to fetch user status', err);
         }
      };

      fetchUploadStatus();
   }, [user]);

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!user) {
         return;
      }

      if (!canUpload) {
         const res = await axios.post('https://text-it-8kzf.onrender.com/api/payment/create-checkout-session', {
            clerkId: user.id,
         });
         window.location.href = res.data.url;

         setErrorMessage('You have reached your upload limit, please upgrade to Pro before!');
         return;
      }

      const selected = e.target.files?.[0];
      if (selected) {
         setFile(selected);
         setErrorMessage(null);
      }
   };

   const handleUpload = async () => {
      if (!file) {
         setErrorMessage('Please select an audio file.');
         return;
      }

      if (!user?.id) {
         setErrorMessage('You must be signed in to upload');
         return;
      }

      try {
         setLoading(true);

         const formData = new FormData();
         formData.append('audio', file);

         const res = await axios.post('https://text-it-8kzf.onrender.com/api/upload', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
               'x-clerk-user-id': user.id,
            },
         });

         console.log('Upload response:', res.data);
         router.push('/my-uploads');
      } catch (err) {
         console.error('Upload failed:', err);
         setErrorMessage('Upload failed.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-1/2 h-1/2 flex flex-col gap-5">
         <label
            htmlFor="file-upload"
            className="border-2 border-dashed border-violet-400 text-violet-400 w-full h-full rounded-xl flex items-center justify-center hover:cursor-pointer hover:drop-shadow-[0_0px_5px_rgba(166_132_255/_0.75)] transition duration-300"
         >
            {!file ? (
               <img className="w-40" src="/upload-icon.svg" alt="Upload icon"/> // не знаю чому, але не можу вставити svg нормально(
            ) : (
               <p className="text-center">Selected: {file.name}</p>
            )}
         </label>

         <input
            id="file-upload"
            accept="audio/*"
            type="file"
            className="hidden"
            onChange={handleFileChange}
         />

         <button
            onClick={handleUpload}
            disabled={loading}
            className={`${file ? 'bg-violet-400 text-white border-violet-400' : 'bg-white text-violet-400 border-violet-400 cursor-not-allowed hover:shadow-none'} border-1 w-full h-16 rounded-xl text-lg hover:shadow-[0_0px_5px_rgba(166_132_255/_0.75)] transition duration-300`}
         >
            {loading ? 'Processing...' : 'Convert to Text'}
         </button>

         {errorMessage && (
            <p className="text-red-400 text-center animate-pulse">{errorMessage}</p>
         )}
      </div>
   );
};

export default UploadFile;
