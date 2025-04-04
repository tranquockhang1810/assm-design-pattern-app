import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { MessageModel } from "@/src/api/features/messages/models/Messages";
import { useState } from "react";

const MessViewModel = (repo: MessagesRepo) => {
    const [mess, setMess] = useState<MessageModel[]>([]); // Sửa thành mảng MessageModel
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
  
    const fetchMess = async (newPage: number = 1, userId: string) => {
      try {
        setLoading(true);
        console.log("fetchMess", newPage, userId);
  
        const response = await repo.getMessages({
          userId: userId,
          page: newPage,
          limit: 15,
        });
        console.log("response", response);
  
        if (!response.error) {
          const newMessages = response?.data?.messages || [];
          console.log("newMessages", newMessages);
          
          if (newPage === 1) {
            setMess(newMessages); // Đặt lại danh sách tin nhắn khi tải trang đầu tiên
          } else {
            setMess((prev) => [...prev, ...newMessages]); // Nối thêm tin nhắn khi tải trang tiếp theo
          }
          const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;
          setTotal(totalRecords);
          setPage(currentPage);
          setHasMore(currentPage * currentLimit < totalRecords);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    const loadMoreMess = (userId: string) => {
      if (!loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMess(nextPage, userId);
      }
    };
  
    return {
      mess,
      loading,
      fetchMess,
      loadMoreMess,
      page,
      setMess,
    };
  };
  
  export default MessViewModel;