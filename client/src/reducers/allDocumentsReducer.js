import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 * 
 * 
 * @export
 * @param {any} [state=initialState] 
 * @param {any} action 
 * @returns  {state}:
 */
export default function allDocumentsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ALL_DOCUMENTS:
      return Object.assign({}, state, { documents: action.documents });
    case actionTypes.PAGINATED_DOCUMENTS:
      return  Object.assign({}, state, {
         documents: action.documents, pageCount: action.pageCount,
          currentPage: action.currentPage }); 
    case actionTypes.FIND_DOCUMENT:
      return Object.assign({}, state, {
         documents: action.documents, pageCount: action.pageCount }); 
    case actionTypes.DOCUMENT_RETRIEVAL_FAILED:
      return [...state, Object.assign({}, action.status)];
    case actionTypes.DOCUMENT_DELETED:
      return Object.assign({}, state, {
         documents: state.documents.filter((document) => {
          return document.id !== action.documentid;
        }) });
    case actionTypes.VIEW_DOCUMENT:
      return Object.assign({}, state, { document: action.document });  
    case actionTypes.DOCUMENT_CREATED:
      return Object.assign({}, state, 
      { status: action.status, documents: action.documents });
    case actionTypes.DOCUMENT_CREATE_FAILED:
      return Object.assign({}, state, { status: action.status });
    case actionTypes.USER_DOCUMENTS_FOUND:
      return Object.assign({}, state, { myDocuments: action.documents,
         pageCount: action.pageCount, isLoading:false });
    case actionTypes.USER_DOCUMENTS_NOT_FOUND:
      return Object.assign({}, state, { documents: action.documents,
         isLoading:false });
    case actionTypes.CLEAR_ALL:
      return  Object.assign({}, state, { documents: action.documents });
    default:
      return state;
  }
}
