
import doctor2 from '@/assets/cover2.jpg';


const DoctorsScrollX=()=>{
    return (
        <section className="flex flex-col justify-center max-w-6xl min-h-44 px-4  mx-auto sm:px-6">
                <div className="flex flex-wrap items-center justify-center mb-8">
        <h2 className="mr-10 text-4xl font-bold leading-none md:text-5xl">
            Our Speacilities
        </h2>
      
    </div>


    <div className="flex flex-wrap -mx-4">
       

        <div className="w-full max-w-full mb-8 sm:w-1/2 px-4 lg:w-1/3 flex flex-col ">
            <img
            src={doctor2}
            alt="Card img"
            className="object-cover object-center w-full h-48 rounded-t-lg"
          />
            <div className="flex flex-grow">
                <div className="triangle"></div>
                <div className="flex flex-col justify-between px-4 py-6 bg-white border border-gray-400 rounded-b-lg">
                    <div>
                        <a href="#"
                            className="inline-block mb-4 text-xs font-bold capitalize border-b-2 border-blue-600 hover:text-blue-600">Client-based
                            Adoption</a>
                        <a href="#"
                            className="block mb-4 text-2xl font-black leading-tight hover:underline hover:text-blue-600">
                            Dr sethu ram
                        </a>
                        <p className="mb-4">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla delectus.
                        </p>
                    </div>
                    <div>
                        <span 
                            className="inline-block px-4 py-2 bg-[#928EDE] rounded-xl mt-2 text-base font-black text-white  border-b border-transparent hover:border-blue-600">Book Now </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full max-w-full mb-8 sm:w-1/2 px-4 lg:w-1/3 flex flex-col ">
            <img
            src={doctor2}
            alt="Card img"
            className="object-cover object-center w-full h-48 rounded-t-lg"
          />
            <div className="flex flex-grow">
                <div className="triangle"></div>
                <div className="flex flex-col justify-between px-4 py-6 bg-white border border-gray-400 rounded-b-lg">
                    <div>
                        <a href="#"
                            className="inline-block mb-4 text-xs font-bold capitalize border-b-2 border-blue-600 hover:text-blue-600">Client-based
                            Adoption</a>
                        <a href="#"
                            className="block mb-4 text-2xl font-black leading-tight hover:underline hover:text-blue-600">
                            Dr varsha
                        </a>
                        <p className="mb-4">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla delectus.
                        </p>
                    </div>
                    <div>
                        <span 
                            className="inline-block px-4 py-2 bg-[#928EDE] rounded-xl mt-2 text-base font-black text-white  border-b border-transparent hover:border-blue-600">Book Now </span>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="w-full max-w-full mb-8 sm:w-1/2 px-4 lg:w-1/3 flex flex-col ">
            <img
            src={doctor2}
            alt="Card img"
            className="object-cover object-center w-full h-48 rounded-t-lg"
          />
            <div className="flex flex-grow">
                <div className="triangle"></div>
                <div className="flex flex-col justify-between px-4 py-6 bg-white border border-gray-400 rounded-b-lg">
                    <div>
                        <a href="#"
                            className="inline-block mb-4 text-xs font-bold capitalize border-b-2 border-blue-600 hover:text-blue-600">Client-based
                            Adoption</a>
                        <a href="#"
                            className="block mb-4 text-2xl font-black leading-tight hover:underline hover:text-blue-600">
                            Dr lal
                        </a>
                        <p className="mb-4">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla delectus.
                        </p>
                    </div>
                    <div>
                        <span 
                            className="inline-block px-4 py-2 bg-[#928EDE] rounded-xl mt-2 text-base font-black text-white  border-b border-transparent hover:border-blue-600">Book Now </span>
                    </div>
                </div>
            </div>
        </div>

       

    </div>
</section>
    )
}
export default DoctorsScrollX