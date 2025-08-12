import { logout } from "../(auth)/actions";



export default function LogoutButton() {
  return <form><button formAction={logout}>Log out</button></form>;
}
