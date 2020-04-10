import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles({
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
});

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(null);
  const [page, setPage] = useState(0);
  const [hits, setHits] = useState([]);
  const [more, setMore] = useState(false);

  let timer = useRef(false);

  const handleClose = () => {
    setOpen(false);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`
        )
        .then((response) => {
          setHits((prevHits) => [...prevHits, ...response.data.hits]);

          if (page > response.data.nbPages - 1) {
            setMore(false);
            clearInterval(timer.current);
          } else {
            setMore(true);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    timer.current = setInterval(() => {
      setPage((prevPage) => prevPage + 1);
    }, 1000);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <div>
      <InfiniteScroll
        dataLength={hits.length}
        next={loadMore}
        hasMore={more}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <MaterialTable
          columns={[
            { title: 'Title', field: 'title' },
            { title: 'URL', field: 'url', filtering: false },
            { title: 'Created', field: 'created_at', searchable: false },
            { title: 'Autor', field: 'author', filtering: false },
          ]}
          data={hits}
          options={{
            paging: false,
            search: true,
            filtering: true,
          }}
          onRowClick={(event, row) => {
            setRow(row);
            setOpen(true);
          }}
        />
      </InfiniteScroll>

      <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
        <DialogTitle id="dialog-title" onClose={handleClose}>
          Modal
        </DialogTitle>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <code>
            <pre>{JSON.stringify(row, null, 2)}</pre>
          </code>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
