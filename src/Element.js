import React from 'react';

const Element = ({ value }) => {
    return (
        <div class = "list-content" id = {value.id} > {value.content}</div>
    );
};

export default Element;