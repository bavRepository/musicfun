import { Routing } from '@/common/routing'
import { Header } from '@/common/components'
import s from './app.module.css'
import { ToastContainer } from 'react-toastify'
import { useGlobalLoading } from '@/common/hooks/useGlobalLoading.ts'
import { LinearProgress } from '@/common/components/LinearProgress/LinearProgress.tsx'

export const App = () => {
  const isGlobalLoading = useGlobalLoading()
  return (
    <>
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
    </>
  )
}
