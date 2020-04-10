import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

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

  let timer = useRef(false);

  const handleClose = () => {
    setOpen(false);
  };

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
        onRowClick={(event, row) => {
          setRow(row);
          setOpen(true);
        }}
      />
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
