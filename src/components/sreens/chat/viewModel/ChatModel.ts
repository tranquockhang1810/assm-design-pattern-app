import { MessagesRepo } from "@/src/api/features/messages/MessagesRepo"
import { ChatModel } from "@/src/api/features/messages/models/Chat"
import { useState } from "react"


const ChatViewModel = (repo: MessagesRepo) => {
    const [chatList, setChatList] = useState<ChatModel[]>([])
    const [loadingChatList, setLoadingChatList] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchChatList = async (newPage: number = 1) => {
        try {
            
            setLoadingChatList(true)
            const response = await repo.getChatList({
                page: newPage,
                limit:15
            })
            
            if (!response.error){
                if (newPage ===1){
                    setChatList(response?.data as ChatModel[] || [])
                } else {
                    setChatList((prev) => [...prev, ...(response?.data as ChatModel[] || [])])
                }
                const {page: currentPage, limit: currentLimit, total: totalRecords} = response?.paging
                setTotal(totalRecords)
                setPage(currentPage)
                setHasMore(currentPage * currentLimit < totalRecords)
            } 
        }catch (error: any) {
            console.error(error)
        } finally {
            setLoadingChatList(false)
        }
    }

    const loadMoreChat = () => {
        if (!loadingChatList && hasMore){
            setPage((prevPage) => prevPage + 1)
            fetchChatList(page +1)
        }
    }
 
    return{
        chatList,
        loadingChatList,
        fetchChatList,
        loadMoreChat,
        page
    }

}

export default ChatViewModel