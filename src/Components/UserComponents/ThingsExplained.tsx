import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
const ThingsExplained=()=>{

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:p-12 w-full p-4">
	<div className="p-6 bg-gray-100">
		<p className="text-center text-4xl">
			<FontAwesomeIcon icon={faMagnifyingGlass}/>
		</p>

		<h2 className="font-semibold text-lg text-center text-gray-800 mt-2">
			Find
		</h2>

		<p className="mt-2 text-gray-800 text-center">
			Discover the perfect physician to meet your unique healthcare needs. Our commitment is to help you find a doctor who aligns with your specific health requirements
		</p>
	</div>
	<div className="p-6 bg-gray-100">
		<p className="text-center text-4xl">
			<FontAwesomeIcon icon={faAddressCard}/>
		</p>

		<h2 className="font-semibold text-lg text-center text-gray-800 mt-2">
			Your Feature Here
		</h2>

		<p className="mt-2 text-gray-800 text-center">
			Our user-friendly platform streamlines the booking process, ensuring a seamless and convenient experience. Arranging your visit has never been easier
		</p>
	</div>
	<div className="p-6 bg-gray-100">
		<p className="text-center text-4xl">
		   	<FontAwesomeIcon icon={faCircleCheck}/>
		</p>

		<h2 className="font-semibold text-lg text-center text-gray-800 mt-2">
			Notify
		</h2>

		<p className="mt-2 text-gray-800 text-center">
			Our advanced system ensures you are promptly notified and kept on track with your healthcare schedule.
		</p>
	</div>
	<div className="p-6 bg-gray-100">
		<p className="text-center text-4xl">
				<FontAwesomeIcon icon={faHeart}/>
		</p>

		<h2 className="font-semibold text-lg text-center text-gray-800 mt-2">
			24 X 7 Support
		</h2>

		<p className="mt-2 text-gray-800 text-center">
		Our dedicated team is committed to providing unwavering assistance and care whenever you need it
		</p>
	</div>
</div>
    )
}
export default ThingsExplained