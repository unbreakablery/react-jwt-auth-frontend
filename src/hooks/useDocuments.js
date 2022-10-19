import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useDocuments = (token) => {
  const getDocuments = async () => {
    try {
      const {data: {data}} = await axios.post(`${BASE_URL}/graphql`, {
          query: "{docs (_id: null) {_id type name html author}}"
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
      });
      return {data: data.docs, isError: false, error: {}};
    } catch (err) {
      return {data: null, isError: true, error: err};
    }
  }
  
  const deleteDocument = async (id) => {
    try {
      const {data} = await axios.delete(`${BASE_URL}/doc`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          data: {
            id: id
          },
      });
      return {data, isError: false, error: {}};
    } catch (err) {
      return {data: null, isError: true, error: err.response.data};
    }
  }

  return {
    getDocuments,
    deleteDocument
  }
}

export default useDocuments;
