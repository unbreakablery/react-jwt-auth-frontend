import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useComments = (token) => {
  const getComments = async (docId) => {
    try {
      const result = await axios.get(`${BASE_URL}/comment`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        params: {
          docId: docId
        }
      });

      return {data: result.data, isError: false, error: {}};
    } catch (err) {
      return {data: null, isError: true, error: err};
    }
  }

  const saveComment = async (docId, comment, author) => {
    try {
      const result = await axios.post(`${BASE_URL}/comment`, {
        docId: docId,
        comment: comment,
        author: author
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      
      return {data: result.data, isError: false, error: {}};
    } catch (err) {
      return {data: null, isError: true, error: err};
    }
  }
  
  const deleteComment = async (id) => {
    try {
      const {data} = await axios.delete(`${BASE_URL}/comment`, {
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
    getComments,
    saveComment,
    deleteComment,
  }
}

export default useComments;
