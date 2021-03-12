/**
 * Exports our main Fib component allowing users to enter a index to get the fib for.
 *
 * @Note: notice we are not making axios requests to our API server using a preconfigured port and hostname, only the
 * pathname of the objects we wish to retrieve or post to. In general ports can change and we don't want tight coupling,
 * especially in prod environment where we don't want to be juggling various ports.
 * And yes, the request paths have '/api/*' but in server we don't expect that path prefix.
 * -> That is the purpose of our nginx (see default.conf):
 *   - strips off the '/api' and proxies the rest of the path to our api server
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Fib = () => {
    const [seenIndices, setSeenIndices] = useState([]);  // comes from postgres (see server)
    const [values, setValues] = useState({});  // comes from redis (see server)
    const [index, setIndex] = useState('');

    useEffect(() => {
        const fetchValues = async () => {
            const {data} = await axios.get('/api/values/current');
            setValues(data);
        };
        const fetchIndices = async () => {
          const {data} = await axios.get('/api/values/all');
          setSeenIndices(data);
        };

        fetchValues();
        fetchIndices();
    }, []);

    const renderSeenIndices = () => {
      return seenIndices.map(({number}) => number).join(', ');
    };

    const renderValues = () => {
        const entries = [];
        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            );
        }

        return entries;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await axios.post('/api/values/', {index: index});
        setIndex('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter a fib index:</label>
                <input
                    value={index}
                    onChange={e => setIndex(e.target.value)}
                />
                <button>Submit</button>
            </form>

            <h3>Indices I have seen:</h3>
            {renderSeenIndices()}

            <h3>Calculated Fib values:</h3>
            {renderValues()}
        </div>
    );
};

export default Fib;
