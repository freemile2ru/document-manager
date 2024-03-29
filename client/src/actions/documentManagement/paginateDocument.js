import axios from 'axios';
import actionTypes from '../actionTypes';
import setLoading from '../helper/setLoading';

export default (token, offset, limit) => {
  return (dispatch) => {
    setLoading.isLoading(dispatch,actionTypes);
    return axios.get(`/api/documents/?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: token
      }
    })
      .then((response) => {
        dispatch({
          type: actionTypes.PAGINATED_DOCUMENTS,
          documents: response.data.results.rows,
          pageCount: response.data.pagination.pageCount,
          currentPage: response.data.pagination.currentPage,
        });
        setLoading.isNotLoading(dispatch,actionTypes);
      }).catch((err) => {
        dispatch({
          type: actionTypes.DOCUMENT_RETRIEVAL_FAILED,
          status: 'failed',
          error: err.message
        });
        setLoading.isNotLoading(dispatch,actionTypes);
      });
  };
};