
import React from "react";

const SlotsList = () => {
  const users = [
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "555-555-5555",
      status: "Active",
    },
    {
      name: "Jane Doe",
      email: "janedoe@gmail.com",
      phone: "555-555-5555",
      status: "Inactive",
    },
    {
      name: "Jane Doe",
      email: "janedoe@gmail.com",
      phone: "555-555-5555",
      status: "Inactive",
    },
    {
      name: "Jane Doe",
      email: "janedoe@gmail.com",
      phone: "555-555-5555",
      status: "Inactive",
    },
    // Add more users here
  ];

  return (
    <div className="shadow-lg w-1/2 rounded-lg overflow-hidden mx-auto mb-5 ">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-white shadow-lg border-b-2">
            <th className="w-1/4 py-4 px-6 text-left text-black font-bold uppercase">
              Date
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-black font-bold uppercase">
              Slots
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((user, index) => (
            <tr key={index}>
              <td className="py-4 px-6 border-b border-gray-200">
                {user.name}
              </td>
              <td className="py-4 px-6 border-b border-gray-200 truncate">
                <button className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-teal-600">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SlotsList
