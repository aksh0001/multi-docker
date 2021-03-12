/**
 * Exports a simple functional component, nothing special, purely to demo full-fledged multi-page frontend.
 */
import React from 'react';
import {Link} from 'react-router-dom';

const OtherPage = () => {
    return (
        <div>
            I'm some other page.
            <Link to="/">Go back home</Link>
        </div>
    );
};

export default OtherPage;