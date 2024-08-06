




import React from "react";

const DoctorFilterSort = () => {
  return (
    <div className="m-2 w-screen max-w-screen-md mx-auto">
      <div className="flex flex-col">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <form>
            <div className="relative mb-3 w-full flex items-center justify-between rounded-md">
           {/* svg */}
              <input
                type="text"
                name="search"
                className="h-12 w-full rounded-lg cursor-text  border border-gray-100 bg-gray-100 py-4 pr-40 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Search Doctor"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="flex flex-col">
                <label
                  htmlFor="manufacturer"
                  className="text-sm font-medium text-stone-600"
                >
                  Department
                </label>
                <select
                  id="manufacturer"
                  className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option>Cadberry</option>
                  <option>Starbucks</option>
                  <option>Hilti</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-stone-600"
                >
                  Date of Entry
                </label>
                <input
                  type="date"
                  id="date"
                  className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
           
            </div>

            <div className="mt-2 grid w-full grid-cols-2 justify-end space-x-4 md:flex">
              <button
                type="button"
                className="rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-700 outline-none hover:opacity-80 focus:ring"
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none hover:opacity-80 focus:ring"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorFilterSort
