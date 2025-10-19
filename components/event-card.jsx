"use client"
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useFetch from '@/hooks/usefetch';
import { deleteEvent } from '@/actions/events';

const EventCard = ({event,username,isPublic=false}) => {
    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();
    const handlecopy=async ()=>{
         try {
      await navigator.clipboard.writeText(
        `${window?.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    }
    const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async () => {
    if (window?.confirm("Are you sure you want to delete this event?")) {
      await fnDeleteEvent(event.id);
      router.refresh();
    }
  };
  return (
    <Card  className="flex flex-col justify-between cursor-pointer">
  <CardHeader>
    <CardTitle className="text-2xl">{event.title}</CardTitle>
    <CardDescription className="flex justify-between">
         <span>
            {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
          </span>
          <span>{event._count.bookings} Bookings</span>
    </CardDescription>
    
  </CardHeader>
    
  <CardContent>
   <p>{event.description}</p>
  
  </CardContent>
  {!isPublic && (
    <CardFooter className="flex gap-2">
        
      <Button variant="outline" className="flex items-center" onClick={handlecopy}>
        <Link className='mr-2 h-4 w-4'></Link>
         {isCopied ? "Copied!" : "Copy Link"}
        </Button>
       <Button variant="destructive" onClick={handleDelete} disabled={loading}>
        <Trash className='mr-2 h-4 w-4' /> {loading ? "Deleting..." : "Delete"}</Button>
    </CardFooter>
    
  )}
</Card>
  )
}

export default EventCard
