import axios from 'axios'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
    'API-KEY': import.meta.env.VITE_API_KEY,
  },
})



import axios from "axios"
import { createRoot } from "react-dom/client"
import { useEffect, useState } from "react"

// Types
type Post = {
  id: string
  body: string
  title: string
  userId: string
}

// Api
export const instance = axios.create({ baseURL: "https://exams-frontend.kimitsu.it-incubator.io/api/" })

const postsAPI = {
  getPosts() {
    // Promise.resolve() стоит в качестве заглушки, чтобы TS не ругался и код компилировался
    // Promise.resolve() нужно удалить и написать правильный запрос для получения постов
    const posts = instance.get('/api/todos').then(res => console.log(res.data))
    return Promise.resolve()
  },
}

// App
export const App = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    postsAPI.getPosts().then((res: any) => {
      setPosts(res.data)
    })
  }, [])

  return (
      <>
        <h1>📜 Список постов</h1>
        {posts.length ? (
            posts.map((p) => {
              return (
                  <div key={p.id}>
                    <b>title</b>: {p.title}
                  </div>
              )
            })
        ) : (
            <h2>Постов нету 😥</h2>
        )}
      </>
  )
}

createRoot(document.getElementById("root")!).render(<App />)

// 📜 Описание:
// Напишите запрос на сервер для получения всех постов
// Типизацию возвращаемых данных в ответе указывать необязательно, но можно и указать (в ответах учтены оба варианта).
// Исправленную версию строки напишите в качестве ответа.