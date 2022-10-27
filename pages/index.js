import React, { useRef, useState, useEffect } from "react";
import { fetchData, cleanUsername } from "../utils";
import dayjs from 'dayjs'
import { Datepicker, AreaChart } from "@tremor/react";

const App = () => {
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [selectedContributions, setSelectedContributions] = useState([])
  const [error, setError] = useState(null);
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');

  useEffect(() => {
    if (!data) {
      return;
    }
    setstartDate(dayjs().subtract(30, 'days'))
    setendDate(dayjs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  useEffect(() => {
    handleFiltering(startDate, endDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);


  const handleFiltering = (startDate, endDate) => {
    startDate = dayjs(startDate).format('YYYY-MM-DD')
    endDate = dayjs(endDate).format('YYYY-MM-DD')
    const range = data?.contributions.filter(item => item.date > startDate && item.date < endDate)
    const formatData = []
    range?.forEach(item => {
      formatData.push({ date: dayjs(item.date).format('DD MMM'), contributions: item.contributions })
    })
    setSelectedContributions(formatData)
  }

  const handleSubmit = e => {
    e.preventDefault();

    setUsername(cleanUsername(username));
    setLoading(true);
    setError(null);
    setData(null);

    fetchData(cleanUsername(username))
      .then(data => {
        setLoading(false);
        if (data.years.length === 0) {
          setError("Could not find github profile!");
        } else {
          setData(data);
          inputRef.current.blur();
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        setError("I could not check your profile successfully...");
      });
  };

  return (
    <div className="container mx-auto">
      <div className="py-4 border-b flex justify-between">
        {/*  form */}
        <form onSubmit={handleSubmit}>
          <div className="">
            <input
              ref={inputRef}
              placeholder="Your GitHub Username"
              onChange={e => setUsername(e.target.value)}
              value={username}
              id="username"
              autoFocus
              className="px-3 w-64 py-2 focus:outline-none rounded-md shadow-sm border"
            />
            <button type="submit" disabled={username.length <= 0 || loading} className="rounded-md ml-2 bg-gradient-to-r  from-[#40C463] to-[#216e39] px-4 py-2 text-white">
              Search
            </button>
          </div>
        </form>
        {/* calendar */}
        <div className="w-96">
          {data && (
            <Datepicker
              placeholder="Select..."
              enableRelativeDates={true}
              defaultStartDate={new Date(new Date().setDate(new Date().getDate() - 30))}
              defaultEndDate={new Date()}
              color="green"
              maxWidth="max-w-none"
              marginTop="mt-0"
              handleSelect={(startDate, endDate) => handleFiltering(startDate, endDate)}
            />
          )}
        </div>
      </div>
      {/* page content */}
      {loading ? (
        <p className="text-center mt-20">Fetching Github profile...</p>
      ) : (
        <div>
          {/* error */}
          {error !== null && <p className="text-center mt-20">{error}</p>}
          {/* chart */}
          {data !== null && !loading && (
            <div className="mt-5 text-2xl">
              <h1 className="font-bold">Result</h1>
              <AreaChart
                data={selectedContributions}
                categories={["contributions"]}
                dataKey="date"
                height="h-72"
                colors={["green"]}
                marginTop="mt-4"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
