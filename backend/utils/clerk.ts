require('dotenv').config();
const clerkApiKey = process.env.CLERK_SECRET_KEY;


export async function getClerkUserData(clerkId: string) {
   const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      headers: {
         Authorization: `Bearer ${clerkApiKey}`,
         'Content-Type': 'application/json',
      },
   });

   if (!res.ok) {
      throw new Error(`Failed to fetch Clerk user data: ${res.statusText}`);
   }

   const data = await res.json();
   return data;
}
