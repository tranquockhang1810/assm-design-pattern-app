import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo";
import { Image, MessageModel } from "@/src/api/features/messages/models/Messages";
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
  
        const response = await repo.getMessages({
          userId: userId,
          page: newPage,
          limit: 15,
        });
  
        if (!response.error) {
          const newMessages = response?.data?.messages || [];
          
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
  
    const uploadImage = async (image: Image[]) => {
      try {
        setLoading(true);
        console.log("Uploading image: ", image);
        
        const response = await repo.uploadImage(image);
        console.log("Upload response: ", response);
        
        if (!response.error) {
          return response.data;
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    return {
      mess,
      loading,
      fetchMess,
      loadMoreMess,
      page,
      setMess,
      uploadImage
    };
  };
  
  export default MessViewModel;