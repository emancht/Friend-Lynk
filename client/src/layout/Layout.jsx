import React from 'react';
import Header from './Header.jsx';

const Layout = (props) => {
    return (
        <>
            <div className="bg-gray-100 min-h-screen flex flex-col">
                <Header />
                    {props.children}

            </div>
        </>
    );
};

export default Layout;
