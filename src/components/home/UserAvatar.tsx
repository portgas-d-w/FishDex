import { UserMenu } from '@/components/shared/UserMenu'

type Props = {
  username: string
  email: string
  avatarUrl: string | null
}

export function UserAvatar({ username, email, avatarUrl }: Props) {
  return <UserMenu username={username} email={email} avatarUrl={avatarUrl} />
}
