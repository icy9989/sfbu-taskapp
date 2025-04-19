"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Lock } from "lucide-react"
import { signIn } from "next-auth/react";
import axios from "axios"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(5),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(5)
})

const SignUpPage = () => {

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  const loading = form.formState.isSubmitting;

  const toggleVariant = useCallback(() => {

    if(!loading) {
      router.push("/login");
    }
    
  },[router,loading]);

  const onSubmit = async (values) => {
    try {
            
      await axios.post("/api/register", {
        name: values.name,
        email: values.email,
        password: values.password
      })

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/"
      })

      router.push("/dashboard");

    } catch (error) {
        console.log(error);
    }
  }
 
  return (
    <Card className="w-full max-w-sm flex flex-col justify-center items-center py-5">
        <CardHeader>
            <div className="w-24 h-24 relative rounded-full mb-3 flex justify-center items-center">
                <Image
                src="/images/logo.png"
                alt="logo"
                width={300}
                height={300}
                />
            </div>
            <CardTitle className="text-center text-2xl text-primary font-bold">
                Create an account
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center px-3 rounded-lg border-2 focus-within:border-primary overflow-hidden">
                            <FormLabel className="text-muted-foreground bg-slate-200 peer-focus-visible:bg-slate-800 p-1 rounded-md"><User /></FormLabel>
                            <FormControl className="ml-1">
                            <Input 
                                disabled={loading}
                                placeholder="name" 
                                {...field} 
                                autoComplete="off"
                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent peer" 
                                style={{ marginTop: 0 }} 
                            />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center px-3 rounded-lg border-2 focus-within:border-primary overflow-hidden">
                            <FormLabel className="text-muted-foreground bg-slate-200 peer-focus-visible:bg-slate-800 p-1 rounded-md"><User /></FormLabel>
                            <FormControl className="ml-1">
                              <Input
                                disabled={loading} 
                                placeholder="Email" 
                                {...field} 
                                autoComplete="off"
                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent peer" 
                                style={{ marginTop: 0 }} 
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center px-3 rounded-lg border-2 focus-within:border-primary overflow-hidden">
                            <FormLabel className="text-muted-foreground bg-slate-200 p-1 rounded-md"><Lock /></FormLabel>
                            <FormControl className="ml-1">
                                <Input 
                                disabled={loading}
                                placeholder="Password" 
                                type="password" 
                                {...field} 
                                autoComplete="off"
                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                                style={{ marginTop: 0 }} 
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="pt-5">
                        <Button type="submit" disabled={loading} className="w-full rounded-full">Sign Up</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
        <CardFooter>
            <p className="text-sm">Already have an account?
                <span
                onClick={toggleVariant} 
                className="text-sm text-primary font-semibold ml-1 cursor-pointer hover:underline">
                Login
                </span>
            </p> 
        </CardFooter>
    </Card>           
  )
}

export default SignUpPage