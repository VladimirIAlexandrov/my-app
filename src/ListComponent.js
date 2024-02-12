import React from 'react';
import Element from './Element';

const ListComponent = ({ array }) => {
    return (
        <ul className="list">
            {array.map((element, index) => (
                <div class = "list-item" array_id={index}>
                    <Element value={element} />
                </div>
            ))}
        </ul>
    );
};

export default ListComponent;