import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';

function App() {
  const [page, setPage] = useState(0);
  const [hits, setHits] = useState([]);

  let timer = useRef(false);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`
        )
        .then((response) => {
          setHits((prevHits) => [...prevHits, ...response.data.hits]);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    timer.current = setInterval(() => {
      setPage((prevPage) => prevPage + 1);
    }, 10000);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <div>
      <MaterialTable
        columns={[
          { title: 'Title', field: 'title' },
          { title: 'URL', field: 'url' },
          { title: 'Created', field: 'created_at' },
          { title: 'Autor', field: 'author' },
        ]}
        data={hits}
        options={{
          paging: false,
        }}
      />
    </div>
  );
}

export default App;
