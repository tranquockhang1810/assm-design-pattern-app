
import { UserModel } from "@/src/api/features/authenticate/models/LoginModel";
import { SearchRepo } from "@/src/api/features/search/SearchRepository"
import { useState } from "react"
import Toast from "react-native-toast-message"

const SearchViewModel = (repo: SearchRepo) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 30;
  const [hasMore, setHasMore] = useState(false);

  const resetSearchResult = () => {
    setUsers([]);
    setTotal(0);
    setPage(1);
    setHasMore(true);
  }

  const searchUsers = async (keyword: string, newPage: number = 1) => {
    try {
      setLoading(true)
      if (!keyword) {
        resetSearchResult();
        return
      }
      const res = await repo.search({
        keyword: keyword,
        page: newPage,
        limit: limit
      });
      if (!res?.error) {
        if (newPage === 1) {
          setUsers(res?.data);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...res?.data]);
        }
        const { page: currentPage, limit: currentLimit, total: totalRecords } = res?.paging;
        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        Toast.show({
          type: 'error',
          text1:  "Search failed!",
          text2: res?.error?.message
        })
        resetSearchResult();
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1:  "Search failed!",
        text2: error?.error?.message
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMoreUsers = (keyword: string) => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      searchUsers(keyword,page + 1);
    }
  };

  return {
    searchUsers,
    loadMoreUsers,
    loading,
    users,
    total
  }
}

export default SearchViewModel