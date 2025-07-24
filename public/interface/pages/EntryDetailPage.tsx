
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { QR_CODE_BASE_URL } from '../constants';

const EntryDetail: React.FC = () => {
  const { entry_id } = useParams<{ entry_id: string }>();
  const navigate = useNavigate();
  const { getEntryById, updateEntryDoneStatus, loading, getEventById } = useData();

  // const entry = entry_id ? getEntryById(entry_id) : undefined;
  const entry = getEntryById(entry_id || '');
  const event = entry ? getEventById(entry.parent_event_id) : undefined;
  console.log('EntryDetailPage - entry_id:', entry_id);
  console.log('EntryDetailPage - entry:', entry);
  console.log('EntryDetailPage - event:', event);
  if (loading) {
    return <Layout loading={true}><div/></Layout>;
  }

  if (!entry || !event) {
    return (
      <Layout loading={false}>
        <div className="text-center">
          <p>Entry not found.</p>
          <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
          <br />
                    <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
          {/* <Link to="#" onClick={() => window.history.back()} className="text-blue-600 hover:underline">Go Back</Link> */}
        </div>
      </Layout>
    );
  }

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;
    updateEntryDoneStatus(entry.entry_id, newStatus);

    try {
      const response = await fetch('/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateEntryStatus',
          entry_id: entry.entry_id,
          status: newStatus ? 1 : 0, // Convert boolean to 1 or 0 for database
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
    } catch (error) {
      console.error('Error updating entry status:', error);
      // Optionally, revert the UI change if the API call fails
      updateEntryDoneStatus(entry.entry_id, !newStatus);
      alert('Failed to update status. Please try again.');
    }
  };
  
  const eventDate = new Date(event.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' });
  const subtitle = `${event.name} (${eventDate})`;
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        timeZone: 'UTC',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
    }).toUpperCase();
  };

  return (
    <Layout loading={loading}>
        <Header title="Photography Schedule" subtitle={subtitle} />
        <div className="mt-6 mb-4">
            <Link to={`/event/${event.event_id}`} className="text-blue-600 hover:underline text-sm mb-4 block">{'<< Back to List'}</Link>
        </div>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">{formatDateTime(entry.date)}</p>
            <h2 className="text-4xl font-light text-gray-900 my-2">{entry.name}</h2>
            <p className="text-2xl text-gray-700 font-light">{entry.reason}</p>
            <a href="#" className="text-blue-500 hover:underline mt-2 inline-block">More...</a>
            
            <div className="mt-8 flex flex-col items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <span className="text-xl">Done</span>
                    <input
                      type="checkbox"
                      checked={entry.done}
                      onChange={handleCheckboxChange}
                      className="hidden"
                    />
                    <div className={`w-10 h-10 border-2 ${entry.done ? 'bg-green-500 border-green-600' : 'border-gray-400'} flex items-center justify-center`}>
                        {entry.done && (
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        )}
                    </div>
                </label>
            </div>

            <div className="mt-8 flex justify-center">
                <p>TODO: This needs to use the proper unique ID from the provider scraped in the converted table, or via API?</p>
                {entry.entry_id && <QRCode value={`${QR_CODE_BASE_URL}${entry.entry_id}`} size={256} />}
            </div>
        </div>
    </Layout>
  );
};

export default EntryDetail;
