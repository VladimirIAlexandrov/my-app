import React from 'react';
import ListComponent from './ListComponent';

const MyComponent = ({ data }) => {
    return <ListComponent array={data} clsss ="list"/>;
};

export default MyComponent;