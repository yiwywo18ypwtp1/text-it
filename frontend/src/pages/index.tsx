import Header from "../../components/Header"
import UploadFile from "../../components/UploadFile"


export default function Home() {
   return (
      <div className={'flex flex-row'}>
         <Header />

         <main className={"bg-white w-full flex flex-col items-center justify-center"}>
            <UploadFile />
         </main>
      </div>
   );
}
