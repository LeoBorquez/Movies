import { useEffect, useState } from 'react'

export const useFetch = url => {

    const [state, setState] = useState({ data: null, load: true });

    useEffect(() => {
        setState(state => ({ data: state.data, load: true }));
        fetch(url)
        .then(x => x.text())
        .then(y => {
            console.log(y);
            setState({ data: y, load: false });
        });
    }, [url, setState]); 

    return state;
};