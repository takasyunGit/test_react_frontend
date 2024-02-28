export const useFetchUsers = () => {
  const [userList, setUser] = useState([{id: 1}])
  const onClickFetchUser = () => alert("関数実行")
  return {userList, onClickFetchUser}
}