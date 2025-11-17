import { useLoginMutation } from '@/features/auth/api/authApi.ts'
import { Path } from '@/common/routing'

export const Login = () => {
  const [login] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OauthRedirect

    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

    // Открываем всплывающее окно для OAuth авторизации
    window.open(url, 'oauthPopup', 'width=500, height=600')
    const receiveMessage = (event: MessageEvent) => {
      const { code } = event.data
      if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

      if (!code) return
      window.removeEventListener('message', receiveMessage)
      login({ code, redirectUri, rememberMe: false })
    }
    window.addEventListener('message', receiveMessage)
  }

  return (
    <button type={'button'} onClick={loginHandler}>
      login
    </button>
  )
}
