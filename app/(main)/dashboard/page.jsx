"use client"
import React from 'react'
import {useUser} from "@clerk/nextjs"
import { CardHeader, CardTitle ,Card, CardContent} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import {userschema} from "@/app/lib/validator"
import { useEffect } from 'react'
import useFetch from '@/hooks/usefetch'
import { BarLoader } from "react-spinners";
const page = () => {
 const {isLoaded,user}= useUser()
  const {register,handleSubmit,setValue,formState:{errors}}=useForm({
  resolver:zodResolver(userschema),
 })
  useEffect(() => {
    setValue("username", user?.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);
 const updateUsernameApi = async (username) => {
  const res = await fetch('/api/user/username', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data;
 }
 const{loading,error,fn:fnUpdateUsername}=useFetch(updateUsernameApi)
 const onSubmit=async(data)=>{
  fnUpdateUsername(data.username)
 }
  return (
    <div className="space-y-8">
     <Card>
      <CardHeader>
        <CardTitle>
Welcome,{user?.firstName}
        </CardTitle>
      </CardHeader>
      </Card>
      <Card>
      <CardHeader>
        <CardTitle>
Your Unique Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div >
            <div className="flex items-center gap-2">
              <span>{window?.location.origin}/</span>
              <Input {...register("username")} placeholder="username"></Input>
            </div>
             {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
             )}
           {error && (
                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
          <Button>Update Username</Button>
        </form>
      </CardContent>
      </Card>

    </div>
  )
}

export default page
