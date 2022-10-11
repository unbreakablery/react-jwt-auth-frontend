const useCurrentUser = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (!currentUser || currentUser === {}) {
    return null;
  } else {
    return currentUser;
  }
}

export default useCurrentUser;