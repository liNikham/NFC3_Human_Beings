import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const ApplicationStatus = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const fetchStatus = async () => {
    const url = `/api/adopt/status?email=${user?.email}`;
    const res = await axiosPrivate.get(url);
    return res.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['applicationStatus', user?.email],
    queryFn: fetchStatus,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h2 className="text-xl font-semibold mb-4">Your Adoption Application Status</h2>
      {data.length === 0 ? (
        <p>You have no applications.</p>
      ) : (
        <table className="table-auto w-full bg-white shadow-lg rounded-sm border border-gray-200">
          <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {data.map((app) => (
              <tr key={app._id}>
                <td className="p-4">{app.user_name}</td>
                <td className="p-4">{app.user_email}</td>
                <td className="p-4">{app.user_number}</td>
                <td className="p-4">{app.user_address}</td>
                <td className="p-4">{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationStatus;
