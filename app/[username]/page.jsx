import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {notFound} from "next/navigation"
// import {notFound} from "next/navigation"
import {getUserByUsername} from "@/actions/user"
const UserPage=async({params})=>{
    const user = await getUserByUsername(params.username)
    if(!user){
        notFound();
    }
    return(
        <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 text-center">
          Welcome to my scheduling page. Please select an event below to book a
          call with me.
        </p>
      </div>
      </div>
    )
}
export default UserPage;