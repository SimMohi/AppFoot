import React from 'react';

const Header = ({title,other}) => {

    return (
        <>
            <div>
                <span className="lead">{title}</span>
                <span className=" float-right mr-4">{other}</span>
            </div>
            <hr />
            <br />
        </>
    );
}
export default Header;